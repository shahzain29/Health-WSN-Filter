#import "AppDelegate.h"
#import "RCTAppleHealthKit.h"
#import <React/RCTBundleURLProvider.h>



@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"AwesomeProject";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self
                                              launchOptions:launchOptions];

  
 
  [[RCTAppleHealthKit new] initializeBackgroundObservers:bridge];
  return [super application:application didFinishLaunchingWithOptions:launchOptions ];
  
  return YES;

  
}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}




- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}


@end
