cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.adobe.plugins.GAPlugin/www/GAPlugin.js",
        "id": "com.adobe.plugins.GAPlugin.GAPlugin",
        "clobbers": [
            "GAPlugin"
        ]
    },
    {
        "file": "plugins/me.apla.cordova.share-social/www/share-social.js",
        "id": "me.apla.cordova.share-social.shareSocial",
        "clobbers": [
            "plugins"
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
        "file": "plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js",
        "id": "org.apache.cordova.inappbrowser.inappbrowser",
        "clobbers": [
            "window.open"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.splashscreen/www/splashscreen.js",
        "id": "org.apache.cordova.splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.adobe.plugins.GAPlugin": "2.4.0",
    "me.apla.cordova.share-social": "0.1.0",
    "org.apache.cordova.device": "0.2.13",
    "org.apache.cordova.inappbrowser": "0.5.4",
    "org.apache.cordova.splashscreen": "0.3.5"
}
// BOTTOM OF METADATA
});