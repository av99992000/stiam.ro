//
//  social.js
//
//  Ivan Baktsheev, 2013, plugin.xml, merging android and ios
//  --------------------
//  Cameron Lerch, 2013, original ios plugin
//  Sponsored by Brightflock: http://brightflock.com
//

function ShareSocial() {
};

ShareSocial.prototype.available = function(callback) {
	cordova.exec(function(avail) {
		callback(avail ? true : false);
	}, null, "ShareSocial", "available", []);
};

ShareSocial.prototype.share = function(message, image, url, title, successCallback, failCallback) {

    function success(args) {
        successCallback && successCallback(args);
    }

    function fail(args) {
        failCallback && failCallback(args);
    }

	return cordova.exec(function(args) {
	   success(args);
	}, function(args) {
	   fail(args);
	}, 'me.apla.cordova.share-social', 'invokeTargetPicker', {
        request: {
            action: "bb.action.SHARE",
            //type: "text/plain", // from example
            //mime: "text/plain", // from doc https://developer.blackberry.com/html5/apis/blackberry.invoke.card.html#.invokeTargetPicker
            //data: message, //http://blackberry-webworks.github.io/WebWorks-API-Docs/WebWorks-API-Docs-next-BB10/view/blackberry.invoke.html
            uri: url,
            target_type: ["APPLICATION", "VIEWER", "CARD"]
        },
        title: title
    });
};

ShareSocial.install = function() {
    if (!window.plugins) {
        window.plugins = {};    
    }

    window.plugins.shareSocial = new ShareSocial();
    return window.plugins.shareSocial;
};

cordova.addConstructor(ShareSocial.install);