package com.anonymous.AndroidFileSystemPermission;

import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class ManagePermissionModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private ReactApplicationContext mApplicationContext;

    ManagePermissionModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        mApplicationContext = getReactApplicationContext();
    }

    @Override
    public String getName() {
        return "ManagePermission";
    }

    /**
     * MANAGE_EXTERNAL_STORAGE権限問い合わせ関数
     */
    @ReactMethod
    private void getManageStoragePermission(Promise promise) {
        try {
            // true:許可 false:拒否
            promise.resolve(Environment.isExternalStorageManager());
        } catch (Exception error) {
            promise.reject(error);
        }
    }

    /**
     * MANAGE_EXTERNAL_STORAGE権限リクエスト関数
     */
    @ReactMethod
    private void requestManageStoragePermission(Promise promise) {
        try {
            Intent intent = new Intent();
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.setAction(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION);
            Uri uri = Uri.fromParts("package", this.reactContext.getPackageName(), null);
            intent.setData(uri);
            this.reactContext.startActivity(intent);
            promise.resolve(true);
        } catch (Exception error) {
            promise.reject(error);
        }
    }
}
