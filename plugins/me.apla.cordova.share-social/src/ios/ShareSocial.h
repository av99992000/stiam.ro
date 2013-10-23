//
//  Social.h
//
//  Ivan Baktsheev, 2013, plugin.xml, merging android and ios
//  --------------------
//  Cameron Lerch, 2013, original ios plugin
//  Sponsored by Brightflock: http://brightflock.com
//

#import <Cordova/CDVPlugin.h>
#import <Cordova/CDVPluginResult.h>

@interface ShareSocial : CDVPlugin {
}

- (void) share:(CDVInvokedUrlCommand*)command;
- (void) showActivities:(NSArray *)list;
@end
