cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.core.splashscreen/www/splashscreen.js",
        "id": "org.apache.cordova.core.splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.GAPlugin/www/GAPlugin.js",
        "id": "com.phonegap.plugins.GAPlugin.GAPlugin",
        "clobbers": [
            "GAPlugin"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/InAppBrowser.js",
        "id": "org.apache.cordova.inappbrowser.InAppBrowser",
        "clobbers": [
            "window.open"
        ]
    },
    {
        "file": "plugins/com.phonegap.TapToScroll/www/taptoscroll.js",
        "id": "com.phonegap.TapToScroll.TapToScroll",
        "clobbers": [
            "window.TapToScroll"
        ]
    },
    {
        "file": "plugins/me.apla.cordova.share-social/www/share-social.js",
        "id": "me.apla.cordova.share-social.shareSocial",
        "clobbers": [
            "plugins"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.core.splashscreen": "0.2.0",
    "com.phonegap.plugins.GAPlugin": "2.1.3",
    "org.apache.cordova.device": "0.2.3",
    "org.apache.cordova.inappbrowser": "0.2.2",
    "com.phonegap.TapToScroll": "0.1.0",
    "me.apla.cordova.share-social": "0.1.0"
}
// BOTTOM OF METADATA
});