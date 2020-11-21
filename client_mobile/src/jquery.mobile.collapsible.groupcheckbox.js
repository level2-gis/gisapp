/**
 * Collapsible widget with group checkbox for toggling nested children checkboxes
 *
 * jQuery Mobile custom widget extending Collapsible:
 *   https://github.com/jquery/jquery-mobile/blob/1.3.1/js/widgets/collapsible.js
 *
 * Enable by setting data-groupcheckbox="true" in the collapsible element
 *
 * Events:
 *   groupchange(event)
 *     Triggered when the group checkbox or any of its children checkboxes are changed
 *
 * Triggers:
 *   trigger('checkgroup', <boolean>)
 *     Check or uncheck the group checkbox
 */

(function ($, undefined) {

    $.widget('mobile.collapsible', $.mobile.collapsible, {
        options: {
            groupcheckbox: false,
            checkedIcon: 'checkbox-on',
            uncheckedIcon: 'checkbox-off'
        },

        _create: function () {
            this._super();

            if (this.options.groupcheckbox) {
                var $el = this.element;
                var o = this.options;
                var collapsible = $el;
                var collapsibleHeading = $el.children(o.heading).first();
                var collapsibleContent = collapsible.children('.ui-collapsible-content');
                var collapsibleButton = collapsibleHeading.find('a').first();

                // add group checkbox button
                var groupButton = collapsibleHeading.append("<a href='#' class='ui-collapsible-groupcheckbox'>&nbsp;</a>").find('a').last();
                groupButton.buttonMarkup({
                    shadow: false,
                    corners: false,
                    iconpos: o.iconpos,
                    icon: o.uncheckedIcon,
                    mini: o.mini,
                    theme: o.theme
                });

                // add collapsible events
                collapsible.bind('checkgroup', function (event, checked) {
                    // forward event to group button
                    groupButton.trigger('checkgroup', checked);

                    event.preventDefault();
                    event.stopPropagation();
                });

                // remove heading events
                collapsibleHeading.unbind('tap').unbind('click');

                // add collapse button events
                collapsibleButton
                    .bind('tap', function (event) {
                        $(this).addClass($.mobile.activeBtnClass);
                    })
                    .bind('click', function (event) {
                        var type = collapsibleHeading.is('.ui-collapsible-heading-collapsed') ? 'expand' : 'collapse';
                        collapsible.trigger(type);

                        event.preventDefault();
                        event.stopPropagation();
                    });

                // add group button events
                groupButton
                    .bind('click', function (event) {
                        var checked = !$(this).is('.ui-collapsible-groupcheckbox-button-checked');

                        // toggle checkbox
                        $(this).trigger('checkgroup', checked);

                        event.preventDefault();
                        event.stopPropagation();
                    })
                    .bind('checkgroup', function (event, checked) {
                        // check children group checkboxes
                        collapsibleContent.children('.ui-collapsible[data-groupcheckbox=true]').trigger('checkgroup', checked);

                        // check children checkboxes
                        collapsibleContent.children('.ui-checkbox').find(':checkbox').prop('checked', checked).checkboxradio('refresh');
                        // check children checkboxes that are not yet enhanced
                        collapsibleContent.children('label').find(':checkbox').prop('checked', checked);

                        // update group checkbox
                        updateGroupCheckbox();

                        event.preventDefault();
                        event.stopPropagation();
                    });

                // sync group checkbox to children checkboxes
                var updateGroupCheckbox = function (event) {
                    // collect children checkboxes
                    var groupCheckboxChildren = collapsibleContent.children('.ui-collapsible[data-groupcheckbox=true]');
                    var checkboxChildren = collapsibleContent.children('.ui-checkbox, label').find(':checkbox');

                    var hasPartiallyCheckedChildren = groupCheckboxChildren.is('.ui-collapsible-groupcheckbox-somechecked');
                    var hasCheckedChildren = groupCheckboxChildren.is('.ui-collapsible-groupcheckbox-checked') || checkboxChildren.is(':checked');
                    var hasUncheckedChildren = groupCheckboxChildren.is(':not(.ui-collapsible-groupcheckbox-checked)') || checkboxChildren.is(':not(:checked)');

                    // update group checkbox
                    var checked = false;
                    var partiallyChecked = false;
                    if (hasPartiallyCheckedChildren || (hasCheckedChildren && hasUncheckedChildren)) {
                        // some children checked
                        partiallyChecked = true;
                        checked = true;
                    } else if (hasCheckedChildren) {
                        // all children checked
                        checked = true;
                    } else {
                        // no children checked
                    }

                    // update styles
                    collapsible
                        .toggleClass('ui-collapsible-groupcheckbox-checked', checked)
                        .toggleClass('ui-collapsible-groupcheckbox-somechecked', partiallyChecked);
                    groupButton
                        .toggleClass('ui-collapsible-groupcheckbox-button-checked', checked)
                        .toggleClass('ui-collapsible-groupcheckbox-button-somechecked', partiallyChecked);
                    groupButton.find('.ui-icon')
                        .toggleClass('ui-icon-' + o.checkedIcon, checked)
                        .toggleClass('ui-icon-' + o.uncheckedIcon, !checked);

                    if (event == null || event.type != 'groupchange') {
                        // trigger event to update parents
                        collapsible.trigger('groupchange');
                    }
                };

                // initial state after creation
                updateGroupCheckbox();

                // sync to children checkboxes
                collapsibleContent.delegate('> .ui-collapsible[data-groupcheckbox=true]', 'groupchange', updateGroupCheckbox);
                collapsibleContent.delegate('> .ui-checkbox :checkbox', 'change checkboxradiocreate', updateGroupCheckbox);
            }
        }
    });

})(jQuery);
