//
//  Social.m
//
//  Ivan Baktsheev, 2013, plugin.xml, merging android and ios
//  --------------------
//  Cameron Lerch, 2013, original ios plugin
//  Sponsored by Brightflock: http://brightflock.com
//

#import "ShareSocial.h"

@interface ShareSocial ()

@end

@implementation ShareSocial

- (void)share:(CDVInvokedUrlCommand*)command {
    
    CDVPluginResult *result;
    
    if (!NSClassFromString(@"UIActivityViewController")) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsArray:@[@0, @"Social framework not available"]];
        [self.commandDelegate sendPluginResult:result callbackId:[command callbackId]];
        return;
    }
    
    NSString *text = [command.arguments objectAtIndex:0];
    if (!text) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsArray:@[@1, @"Text cannot be empty"]];
        [self.commandDelegate sendPluginResult:result callbackId:[command callbackId]];
        return;
    }

    NSString *urlString = [command.arguments objectAtIndex:2];
    NSURL *url = nil;
    
    if (urlString && [urlString isKindOfClass:[NSString class]] && [urlString length] > 0) {
        url = [NSURL URLWithString:urlString];
    } else {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsArray:@[@2, @"URL cannot be empty"]];
        [self.commandDelegate sendPluginResult:result callbackId:[command callbackId]];
        return;
    }
    
    NSMutableArray *activityItems = [[NSMutableArray alloc] initWithObjects:text, url, nil];
    
    NSString *imageName = [command.arguments objectAtIndex:1];
    __block UIImage *image = nil;
    
    // can be NSNull or empty string
    if (imageName && [imageName isKindOfClass:[NSString class]] && [imageName length] > 0) {
        NSURL *remoteImage = [[NSURL alloc] initWithString:imageName];
        if (![remoteImage scheme]) {
            // don't really know usability of this case
            image = [UIImage imageNamed:imageName]; // app resources
        } else if ([[remoteImage scheme] isEqual: @"file"]) {
            image = [UIImage imageWithContentsOfFile:imageName]; // app documents
        } else if ([[remoteImage scheme] isEqual: @"http"]) {
            // the best way to handle this — use async loading
            // but this adds delay to the actionsheet. avoid this!
            //NSURLRequest *urlRequest = [NSURLRequest requestWithURL:remoteImage];
            NSURLRequest *urlRequest = [NSURLRequest requestWithURL: remoteImage
                cachePolicy:NSURLRequestReloadIgnoringCacheData
                timeoutInterval:60.0];
            NSOperationQueue *queue = [[NSOperationQueue alloc] init];
            [NSURLConnection sendAsynchronousRequest:urlRequest queue:queue completionHandler:^(NSURLResponse *response, NSData *data, NSError *error)
            {
                if ([data length] > 0 && error == nil) {
                    image = [UIImage imageWithData:data];
                    
                    if (image) {
                        [activityItems addObject:image];
                        [self showActivities:activityItems];
                        CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                        [self.commandDelegate sendPluginResult:result callbackId:[command callbackId]];
                        return;
                    }
                }
                // TODO: add correct error description
                // else if ([data length] == 0 && error == nil)
                //     [delegate emptyReply];
                // else if (error != nil && error.code == ERROR_CODE_TIMEOUT)
                //     [delegate timedOut];
                // else if (error != nil)
                //     [delegate downloadError:error];
                
                CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsArray:@[@3, @"Image fetch error"]];
                [self.commandDelegate sendPluginResult:result callbackId:[command callbackId]];
                return;
                
            }];
            return;
        }
        
    }
    
    if (image) [activityItems addObject:image];
    
    [self showActivities:activityItems];
    // TODO: add controller delegation. purpose: prevent two sharing dialogs
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:[command callbackId]];
}

-(void) showActivities: (NSArray *)list {
    UIActivity *activity = [[UIActivity alloc] init];
    
    NSArray *applicationActivities = [[NSArray alloc] initWithObjects:activity, nil];
    UIActivityViewController *activityVC =
    [[UIActivityViewController alloc] initWithActivityItems:list
                                      applicationActivities:applicationActivities];
    [self.viewController presentViewController:activityVC animated:YES completion:nil];
    // TODO: add controller delegation. purpose: prevent two sharing dialogs
}

@end