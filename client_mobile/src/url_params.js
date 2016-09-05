/**
 * UrlParams
 *
 * parse URL parameters
 */

var UrlParams = {};

// true if protocol is HTTPS
UrlParams.useSSL = false;

// full URL
UrlParams.url = "";

// URL without query string
UrlParams.baseUrl = "";

// URL parameters
UrlParams.params = {};

// parse URL parameters
UrlParams.parse = function() {
  var  urlString = "";
  if (document.documentURI) {
    // all browsers except older IE
    urlString = document.documentURI;
  }
  else {
    // older IE
    urlString = window.location.href;
  }
  // replace spaces encoded as '+'
  urlString = urlString.replace(/\+/g, ' ');
  urlString = decodeURI(urlString);

  UrlParams.url = urlString;
  UrlParams.useSSL = UrlParams.url.match(/^https:/);

  var urlArray = urlString.split('?');
  UrlParams.baseUrl = urlArray[0];
  if (urlArray.length > 1) {
    var kvPairs = urlArray[1].split('&');
    for (var i=0; i<kvPairs.length; i++) {
      var kvPair = kvPairs[i].split('=');
      UrlParams.params[decodeURIComponent(kvPair[0])] = decodeURIComponent(kvPair[1]);
    }
  }
};
