/**
*
* Phonegap share plugin for Android
* Kevin Schaul 2011
*
*/

package ro.stiam.stiri;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;

public class Share extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        PluginResult result = null;
        try {
            JSONObject jo = args.getJSONObject(0);
            doSendIntent(jo.getString("subject"), jo.getString("text"));
            result = new PluginResult(PluginResult.Status.OK);
        } catch (JSONException e) {
            result = new PluginResult(PluginResult.Status.JSON_EXCEPTION);
        }
        callbackContext.sendPluginResult(result);
        return true;
    }

    private void doSendIntent(String subject, String text) {
        Intent sendIntent = new Intent(android.content.Intent.ACTION_SEND);
        sendIntent.setType("text/plain");
        sendIntent.putExtra(android.content.Intent.EXTRA_SUBJECT, subject);
        sendIntent.putExtra(android.content.Intent.EXTRA_TEXT, text);
        this.cordova.startActivityForResult(this, sendIntent, 0);
    }
}
