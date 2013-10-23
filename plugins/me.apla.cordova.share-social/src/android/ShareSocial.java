package me.apla.cordova;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Intent;
import android.net.Uri;


import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;

public class ShareSocial extends CordovaPlugin {
	
	private CallbackContext callbackContext;
	public String smsCopy = ""; 

	@Override
	public boolean execute (String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		JSONObject r = new JSONObject();
		try
		{
			if (action.equals("startSmsActivity")) {
				
				JSONObject obj = args.getJSONObject(0);
				String type = obj.has("message") ? obj.getString("message") : "";
				startSmsActivity(type ); 
			}
			else if( action.equals("startEmailActivity") ) 
			{
				JSONObject obj = args.getJSONObject(0);
				String msg = obj.has("message") ? obj.getString("message") : "";
				String subject = obj.has("subject") ? obj.getString("subject") : "";
				
				startEmailActivity(msg, subject );
			}
			else if( action.equals("share") ) 
			{
				String msg = args.getString(0);
				String img = args.getString(1);
				String url = args.getString(2);
				
				startSocialActivity(msg, img, url);
			}
			
		}
		catch (JSONException e) {
            e.printStackTrace();
            callbackContext.error(r);
            return false;
        }
		
		
		this.callbackContext = callbackContext;
		
		return true;
	}

	public void startSmsActivity( String msg) {
		
		// TODO: add restriction option to use only email, sms and so on
		// instead of different activities
		Uri uri = Uri.parse("smsto:"); 
		Intent it = new Intent(Intent.ACTION_SENDTO, uri); 
        it.putExtra("sms_body",msg ); 
        
        //this.ctx.startActivityForResult( (Plugin) this, it, 1 );
	}
	
	public void startEmailActivity ( String msg, String subject )
	{
		Intent emailIntent = new Intent(android.content.Intent.ACTION_SEND);
		
		// emailIntent.setType("text/plain");
		emailIntent.setType("message/rfc822");
		emailIntent.putExtra(android.content.Intent.EXTRA_SUBJECT, subject );  
		emailIntent.putExtra(android.content.Intent.EXTRA_TEXT, msg );  
		// this.ctx.startActivity(emailIntent); 
	}
	
	public void startSocialActivity (String msg, String img, String url)
	{
		// Intent share = new Intent(Intent.ACTION_SEND);
		// share.setType("image/jpeg") // might be text, sound, whatever
		// share.putExtra(Intent.EXTRA_STREAM, pathToPicture);
		// startActivity(Intent.createChooser(share, "share"));

		Intent richIntent = new Intent(Intent.ACTION_SEND);
		richIntent.setType("text/plain");
		// richIntent.putExtra(Intent.EXTRA_TEXT, msg );
		richIntent.putExtra(Intent.EXTRA_TEXT, msg);
		richIntent.putExtra(Intent.EXTRA_TEXT, url);
//		Intent.Ex
		
		cordova.getActivity().startActivity(Intent.createChooser(richIntent, "")); 
	}
	
	

	@Override
	public void onActivityResult(int reqCode, int resultCode, Intent data) {
		JSONObject smsObj = new JSONObject();
		try {
			smsObj.put("msg", "done");
			
			
		} catch (JSONException e) {
			e.printStackTrace();
		}
		
		this.callbackContext.success();
	}
}
