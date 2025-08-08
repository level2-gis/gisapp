Eqwc.plugins["geoportal_support"] = {};
Eqwc.plugins["geoportal_support"].customToolbarLoad = function () {

    var id = 'geoportal_support';
    var header = Ext.getCmp('GisBrowserPanel');
    var supportPanel = null;
    var newItemsCount = 0; // Track number of new items
    var cachedFeedData = null; // Cache the RSS feed data
    var lastFetchTime = 0; // Track when we last fetched the feed
    var CACHE_DURATION = 60 * 60 * 1000; // 60 minutes cache duration

    header.addTool({
        id: id,
        qtip: 'GEO-PORTAL pomoč uporabnikom',
        handler: function (event, toolEl, panel) {
            toggleSupportPanel(toolEl);
        }
    });

    header.tools[id].setRight(36);

    // Initialize new items count check
    loadFeedData();

    function loadFeedData(forceRefresh) {
        var now = new Date().getTime();
        
        // Use cached data if available and not expired, unless force refresh is requested
        if (!forceRefresh && cachedFeedData && (now - lastFetchTime) < CACHE_DURATION) {
            processExistingFeedData();
            return;
        }

        // Load RSS feed content
        Ext.Ajax.request({
            url: 'plugins/geoportal_support/php/geoportal_feed_proxy.php',
            method: 'GET',
            timeout: 30000,
            success: function(response) {
                if (response.responseText) {
                    cachedFeedData = response.responseText;
                    lastFetchTime = now;
                    processExistingFeedData();
                }
            },
            failure: function(response) {
                console.log('RSS feed request failed:', response);
            }
        });
    }

    function processExistingFeedData() {
        if (cachedFeedData) {
            countNewItems(cachedFeedData);
        }
    }

    function countNewItems(xmlText) {
        try {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xmlText, "text/xml");
            var items = xmlDoc.getElementsByTagName('item');
            
            var newCount = 0;
            
            // Get user's last login date
            var lastLoginDate = null;
            if (projectData && projectData.old_last_login) {
                var timestamp = parseInt(projectData.old_last_login);
                if (timestamp < 10000000000) {
                    timestamp = timestamp * 1000;
                }
                lastLoginDate = new Date(timestamp);
            }
            
            if (lastLoginDate) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var pubDate = new Date(item.getElementsByTagName('pubDate')[0].textContent);
                    
                    // Count all items published after last login, regardless of category
                    if (pubDate > lastLoginDate) {
                        newCount++;
                    }
                }
            }
            
            newItemsCount = newCount;
            updateIconBadge();
            
        } catch (e) {
            console.log('Error counting new items:', e);
        }
    }

    function updateIconBadge() {
        var toolEl = header.tools[id];
        if (toolEl) {
            // Remove existing badge if any
            var existingBadge = toolEl.query('.new-items-badge');
            if (existingBadge && existingBadge.length > 0) {
                existingBadge[0].remove();
            }
            
            // Add new badge if there are new items
            if (newItemsCount > 0) {
                var badge = document.createElement('div');
                badge.className = 'new-items-badge';
                badge.innerHTML = newItemsCount > 9 ? '!' : newItemsCount.toString();
                badge.style.cssText = 'position: absolute; top: 0px; right: 0px; background-color: #FF5722; color: white; font-size: 10px; font-weight: bold; padding: 0; border-radius: 10px; min-width: 16px; text-align: center; z-index: 1000; box-shadow: 0 1px 3px rgba(0,0,0,0.3);';
                
                // Append badge to tool element
                toolEl.dom.style.position = 'relative';
                toolEl.dom.appendChild(badge);
            }
        }
    }

    function toggleSupportPanel(toolEl) {
        if (supportPanel && supportPanel.isVisible()) {
            supportPanel.hide();
            return;
        }

        // Clear the badge when opening panel
        newItemsCount = 0;
        updateIconBadge();

        if (!supportPanel) {
            createSupportPanel(toolEl);
        } else {
            // Window exists but is hidden, just show it
            supportPanel.show();
            positionPanel(toolEl);
        }
    }

    function createSupportPanel(toolEl) {
        supportPanel = new Ext.Window({
            id: 'geoportal-support-panel',
            //title: 'GEO-PORTAL podpora',
            width: 400,
            height: 500,
            resizable: false,
            closable: true,
            modal: false,
            shadow: true,
            frame: true,
            autoScroll: true,
            layout: 'fit',
            html: '<div style="padding: 10px;">Nalaganje...</div>',
            closeAction: 'hide',
            keys: [{
                key: Ext.EventObject.ESC,
                fn: function() {
                    supportPanel.hide();
                }
            }],
            listeners: {
                hide: function() {
                    // Don't set to null, just hide the window
                },
                destroy: function() {
                    // Only set to null when actually destroyed
                    supportPanel = null;
                },
                afterrender: function() {
                    // Load content after window is rendered
                    loadSupportContent();
                },
                beforeclose: function() {
                    // Prevent actual closing, just hide instead
                    supportPanel.hide();
                    return false; // Prevent the default close action
                }
            }
        });

        positionPanel(toolEl);
        supportPanel.show();
    }

    function positionPanel(toolEl) {
        if (supportPanel && toolEl) {
            var toolPos = toolEl.getXY();
            var toolSize = toolEl.getSize();
            // Position the window below and to the left of the button
            supportPanel.setPosition(toolPos[0] - 380, toolPos[1] + toolSize.height + 5);
        }
    }

    function loadSupportContent() {
        // Use cached data if available and fresh, otherwise load RSS feed
        if (cachedFeedData && (new Date().getTime() - lastFetchTime) < CACHE_DURATION) {
            parseFeedAndRender(cachedFeedData);
        } else {
            // Load fresh RSS feed content
            Ext.Ajax.request({
                url: 'plugins/geoportal_support/php/geoportal_feed_proxy.php',
                method: 'GET',
                timeout: 30000,
                success: function(response) {
                    if (response.responseText) {
                        cachedFeedData = response.responseText;
                        lastFetchTime = new Date().getTime();
                        parseFeedAndRender(response.responseText);
                    } else {
                        renderErrorContent();
                    }
                },
                failure: function(response) {
                    console.log('RSS feed request failed:', response);
                    renderErrorContent();
                }
            });
        }
    }

    function parseFeedAndRender(xmlText) {
        try {
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xmlText, "text/xml");
            var items = xmlDoc.getElementsByTagName('item');
            
            var noviceItems = [];
            var nasvetiItems = [];
            
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var categories = item.getElementsByTagName('category');
                var hasNovice = false;
                var hasNasveti = false;
                
                for (var j = 0; j < categories.length; j++) {
                    var category = categories[j].textContent;
                    if (category === 'novice') hasNovice = true;
                    if (category === 'nasveti') hasNasveti = true;
                }
                
                var title = item.getElementsByTagName('title')[0].textContent;
                var link = item.getElementsByTagName('link')[0].textContent;
                var description = item.getElementsByTagName('description')[0].textContent;
                var pubDate = item.getElementsByTagName('pubDate')[0].textContent;
                
                // Extract excerpt from description (first 150 characters)
                var excerpt = description.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
                
                var newsItem = {
                    title: title,
                    link: link,
                    excerpt: excerpt,
                    pubDate: new Date(pubDate)
                };
                
                if (hasNovice) {
                    noviceItems.push(newsItem);
                }
                if (hasNasveti) {
                    nasvetiItems.push(newsItem);
                }
            }
            
            // Sort by date (newest first) and take only the required amount
            noviceItems.sort(function(a, b) { return b.pubDate - a.pubDate; });
            nasvetiItems.sort(function(a, b) { return b.pubDate - a.pubDate; });
            
            renderSupportContent(noviceItems.slice(0, 3), nasvetiItems.slice(0, 5));
            
        } catch (e) {
            renderErrorContent();
        }
    }

    function renderSupportContent(noviceItems, nasvetiItems) {
        var html = '<div style="font-family: Arial, sans-serif;">';
        
        // Get user's last login date for "NOVO" marker
        var lastLoginDate = null;
        if (projectData && projectData.old_last_login) {
            // Convert integer timestamp to Date object (multiply by 1000 if it's in seconds)
            var timestamp = parseInt(projectData.old_last_login);
            // Check if timestamp is in seconds (typical Unix timestamp) or milliseconds
            if (timestamp < 10000000000) {
                timestamp = timestamp * 1000; // Convert seconds to milliseconds
            }
            lastLoginDate = new Date(timestamp);
        }
        
        // Uporabniška navodila section
        html += '<div style="margin-bottom: 20px;">';
        html += '<h3 style="color: #1976D2; border-bottom: 2px solid #2196F3; padding-bottom: 5px; margin-bottom: 15px; font-size: 18px;">📖 <a href="javascript:void(0)" onclick="window.open(\'https://site.geo-portal.si/sv_zacetek.html\')" style="color: #1976D2; text-decoration: none; cursor: pointer;" onmouseover="this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">Uporabniška navodila</a></h3>';
        html += '</div>';
        
        // Zadnje novice section
        html += '<div style="margin-bottom: 20px;">';
        html += '<h3 style="color: #2E7D32; border-bottom: 2px solid #4CAF50; padding-bottom: 5px; margin-bottom: 15px; font-size: 18px;">📰 Zadnje novice</h3>';
        
        if (noviceItems.length > 0) {
            for (var i = 0; i < noviceItems.length; i++) {
                var item = noviceItems[i];
                var isNew = lastLoginDate && item.pubDate > lastLoginDate;
                
                html += '<div style="margin-bottom: 12px; padding: 8px; background-color: #f5f5f5; border-left: 3px solid #4CAF50;">';
                html += '<div style="font-weight: bold; color: #1976D2; font-size: 15px;">';
                html += '<a href="javascript:void(0)" onclick="window.open(\'' + item.link + '\')" style="color: #1976D2; text-decoration: none; cursor: pointer; font-size: 15px;" onmouseover="this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">' + item.title + '</a>';
                if (isNew) {
                    html += ' <span style="background-color: #FF5722; color: white; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 3px; margin-left: 8px;">NOVO</span>';
                }
                html += '</div>';
                // Uncomment lines below to also show date and excerpt:
                html += '<div style="font-size: 12px; color: #666; margin-bottom: 6px;">' + formatDate(item.pubDate) + '</div>';
                // html += '<div style="font-size: 13px; color: #333;">' + item.excerpt + '</div>';
                html += '</div>';
            }
        } else {
            html += '<div style="color: #666; font-style: italic;">Ni zadnjih novic.</div>';
        }
        
        html += '<div style="text-align: right; margin-top: 10px;">';
        html += '<a href="javascript:void(0)" onclick="window.open(\'https://site.geo-portal.si/news.html\')" style="color: #1976D2; text-decoration: underline;">Preglej ostale novice →</a>';
        html += '</div>';
        html += '</div>';
        
        // Nasveti section
        html += '<div style="margin-bottom: 20px;">';
        html += '<h3 style="color: #F57C00; border-bottom: 2px solid #FF9800; padding-bottom: 5px; margin-bottom: 15px; font-size: 18px;">💡 Nasveti</h3>';
        
        if (nasvetiItems.length > 0) {
            for (var i = 0; i < nasvetiItems.length; i++) {
                var item = nasvetiItems[i];
                var isNew = lastLoginDate && item.pubDate > lastLoginDate;
                
                html += '<div style="margin-bottom: 12px; padding: 8px; background-color: #fff3e0; border-left: 3px solid #FF9800;">';
                html += '<div style="font-weight: bold; color: #1976D2; margin-bottom: 4px; font-size: 15px;">';
                html += '<a href="javascript:void(0)" onclick="window.open(\'' + item.link + '\')" style="color: #1976D2; text-decoration: none; cursor: pointer; font-size: 15px;" onmouseover="this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">' + item.title + '</a>';
                if (isNew) {
                    html += ' <span style="background-color: #FF5722; color: white; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 3px; margin-left: 8px;">NOVO</span>';
                }
                html += '</div>';
                html += '<div style="font-size: 12px; color: #666; margin-bottom: 6px;">' + formatDate(item.pubDate) + '</div>';
                html += '<div style="font-size: 13px; color: #333;">' + item.excerpt + '</div>';
                html += '</div>';
            }
        } else {
            html += '<div style="color: #666; font-style: italic;">Ni najdenih nasvetov.</div>';
        }
        
        html += '<div style="text-align: right; margin-top: 10px;">';
        html += '<a href="javascript:void(0)" onclick="window.open(\'https://site.geo-portal.si/tag_nasveti.html\')" style="color: #1976D2; text-decoration: underline;">Preglej več nasvetov →</a>';
        html += '</div>';
        html += '</div>';
        
        // Contact section
        html += '<div style="margin-bottom: 20px;">';
        html += '<h3 style="color: #7B1FA2; border-bottom: 2px solid #9C27B0; padding-bottom: 5px; margin-bottom: 15px; font-size: 18px;">📧 <a href="javascript:void(0)" onclick="window.open(\'https://site.geo-portal.si/podpora.html\')" style="color: #7B1FA2; text-decoration: none; cursor: pointer;" onmouseover="this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">Podpora</a></h3>';
        //html += '<div style="padding: 15px; background-color: #f3e5f5; border-left: 3px solid #9C27B0; border-radius: 4px;">';
        //html += '<div style="font-weight: bold; margin-bottom: 8px;">GEO-PORTAL podpora</div>';
        //html += '<div style="margin-bottom: 4px;">📧 Email: <a href="mailto:info@geo-portal.si" style="color: #1976D2;">info@geo-portal.si</a></div>';
        //html += '<div style="margin-bottom: 4px;">🌐 Spletna stran: <a href="javascript:void(0)" onclick="window.open(\'https://site.geo-portal.si\')" style="color: #1976D2;">site.geo-portal.si</a></div>';
        //html += '</div>';
        html += '</div>';
        html += '</div>';
        
        updatePanelContent(html);
    }

    function renderErrorContent() {
        var html = '<div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">';
        html += '<div style="color: #d32f2f; margin-bottom: 20px;">⚠️ Napaka pri nalaganju vsebin</div>';
        html += '<div style="margin-bottom: 20px;">';
        html += '<div style="margin-bottom: 10px;"><a href="javascript:void(0)" onclick="window.open(\'https://site.geo-portal.si/news.html\')" style="color: #1976D2; text-decoration: underline;">Novice →</a></div>';
        html += '<div style="margin-bottom: 10px;"><a href="javascript:void(0)" onclick="window.open(\'https://site.geo-portal.si/tag_nasveti.html\')" style="color: #1976D2; text-decoration: underline;">Nasveti →</a></div>';
        html += '</div>';
        html += '<div style="padding: 15px; background-color: #f5f5f5; border-radius: 4px;">';
        html += '<div style="font-weight: bold; margin-bottom: 8px;">Kontakt</div>';
        html += '<div>📧 <a href="mailto:info@geo-portal.si" style="color: #1976D2;">info@geo-portal.si</a></div>';
        html += '</div>';
        html += '</div>';
        
        updatePanelContent(html);
    }

    function formatDate(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        return (day < 10 ? '0' : '') + day + '.' + (month < 10 ? '0' : '') + month + '.' + year;
    }

    function updatePanelContent(html) {
        if (supportPanel) {
            // Use the panel's built-in update method
            supportPanel.update('<div style="padding: 10px;">' + html + '</div>');
        }
    }

};
