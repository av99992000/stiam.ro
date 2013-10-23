cordova.define("me.apla.cordova.share-social.shareSocial", function(require, exports, module) {//
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
	}, 'ShareSocial', 'share', [message, image || "", url]);
};

ShareSocial.install = function() {
    if (!window.plugins) {
        window.plugins = {};    
    }

    window.plugins.shareSocial = new ShareSocial();
    return window.plugins.shareSocial;
};

cordova.addConstructor(ShareSocial.install);});
