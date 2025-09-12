package com.libmavlinkconnect

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.facebook.react.module.annotations.ReactModule
import com.android.mavlinkconnectsdk.Controller
import com.facebook.react.bridge.ReadableMap  

@ReactModule(name = LibMavlinkConnectModule.NAME)
class LibMavlinkConnectModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val NAME = "LibMavlinkConnect"
    }

    private var controller: Controller? = null
    private var isSerialInitialized: Boolean = false

    override fun getName(): String = NAME

    private fun getController(): Controller {
        if (controller == null) {
            controller = Controller(reactContext)
            Log.d(NAME, "Controller initialized successfully")
        }
        return controller!!
    }

    @ReactMethod
    fun initConnection(mode: String, promise: Promise) {
        Log.d(NAME, "TCP initConnection called with mode: $mode")

        val ctrl = getController()
        ctrl.connectionType(mode.uppercase())
        
        if(ctrl.isConnected()){
            Log.d(NAME, "TCP connection initialized successfully")
        }
        // ctrl.getMavlinkDataJson()
        // ctrl.telemInit()
        when (mode.uppercase()) {
            "TCP" -> {
                // val result = ctrl.telemInit()
                // Log.d(NAME,  "TCP telemetry initialized: $result")
                // promise.resolve(result)
            }
            "UDP" -> {
                ctrl.startUdpTransport()
                Log.d(NAME, "UDP transport started.")
                promise.resolve("UDP transport started successfully.")
            }
            "SERIAL" -> {
                if (!isSerialInitialized) {
                    ctrl.initSerialConnection()
                    isSerialInitialized = true
                    Log.d(NAME, "Serial connection initialized successfully")
                    promise.resolve("Serial connection initialized successfully")
                } else {
                    Log.w(NAME, "Serial already initialized.")
                    promise.resolve("Serial connection already initialized.")
                }
            }
            else -> {
                val errorMsg = "Unsupported connection mode: $mode"
                Log.e(NAME, errorMsg)
                promise.reject("UNSUPPORTED_MODE", errorMsg)
            }
        }
    }

    @ReactMethod
    fun stopConnection(mode: String, promise: Promise) {
        val ctrl = controller ?: run {
            promise.resolve("Controller not initialized")
            return
        }
        
        when (mode.uppercase()) {
            "TCP" -> {
                ctrl.telemStop()
                Log.d(NAME, "TCP telemetry stopped.")
                promise.resolve("TCP connection stopped successfully.")
            }
            "UDP" -> {
                ctrl.stopUdpTransport()
                Log.d(NAME, "UDP transport stopped.")
                promise.resolve("UDP connection stopped successfully.")
            }
            "SERIAL" -> {
                if (isSerialInitialized) {
                    ctrl.stopSerialConnection()
                    Controller.nativeCleanup()
                    isSerialInitialized = false
                    Log.d(NAME, "Serial connection stopped and cleaned up.")
                    promise.resolve("Serial connection stopped successfully.")
                } else {
                    Log.w(NAME, "Serial not initialized.")
                    promise.resolve("Serial connection already stopped.")
                }
            }
            else -> {
                val errorMsg = "Unsupported connection mode: $mode"
                Log.e(NAME, errorMsg)
                promise.reject("UNSUPPORTED_MODE", errorMsg)
            }
        }
    }

    @ReactMethod
    fun getMavlinkDataJson(promise: Promise) {
        val ctrl = controller ?: run {
            promise.reject("CONTROLLER_NOT_INIT", "Controller not initialized")
            return
        }
        val result = ctrl.getMavlinkDataJson()
        Log.d(NAME, "Mavlink Data in frontend: $result")
        promise.resolve(result)
    }


    @ReactMethod
    fun dispatchCommand(command: String,promise: Promise) {
        val ctrl = controller ?: run {
            promise.reject("CONTROLLER_NOT_INIT", "Controller not initialized")
            return
        }

        try {
            Log.d(NAME, "dispatchCommand")
            ctrl.dispatchCommand(command)
        } catch (e: IllegalArgumentException) {
            Log.e(NAME, "Invalid DroneCommand:")
            promise.reject("INVALID_COMMAND", "Unknown DroneCommand: ")
        }
    }

    @ReactMethod
    fun dispatchAction(command: String, params: ReadableMap, promise: Promise) {
        val ctrl = controller ?: run {
            promise.reject("CONTROLLER_NOT_INIT", "Controller not initialized")
            return
        }

        try {
            Log.d(NAME, "dispatchAction called with $command and params: $params")

            // Convert ReadableMap → Kotlin Map<String, Float>
            val paramMap = mutableMapOf<String, Float>()
            val iterator = params.keySetIterator()
            while (iterator.hasNextKey()) {
                val key = iterator.nextKey()
                paramMap[key] = params.getDouble(key).toFloat()
            }

            // Forward to Controller
            ctrl.dispatchAction(command, paramMap)

            promise.resolve("Command $command dispatched successfully")
        } catch (e: Exception) {
            Log.e(NAME, "dispatchAction failed", e)
            promise.reject("DISPATCH_ERROR", e.message)
        }
    }    
    @ReactMethod
    fun sendGuidedCommand(command: String, promise: Promise) {
        val ctrl = controller ?: run {
            promise.reject("CONTROLLER_NOT_INIT", "Controller not initialized")
            return
        }
        // ctrl.sendGuidedCommandNative(command)
        Log.d(NAME, "Guided command '$command' sent successfully.")
        promise.resolve("Guided command '$command' sent successfully.")
    }

    @ReactMethod
    fun sendSerialData(data: ReadableArray, promise: Promise) {
        val ctrl = controller ?: run {
            promise.reject("CONTROLLER_NOT_INIT", "Controller not initialized")
            return
        }
        
        if (!isSerialInitialized) {
            promise.reject("SERIAL_NOT_INIT", "Serial connection not initialized.")
            return
        }
        
        val byteArray = ByteArray(data.size())
        for (i in 0 until data.size()) {
            byteArray[i] = data.getInt(i).toByte()
        }
        
        val result = Controller.receiveDataFromNative(byteArray)
        if (result) {
            Log.d(NAME, "Serial data sent to native successfully: ${byteArray.size} bytes")
            promise.resolve("Serial data sent successfully")
        } else {
            Log.e(NAME, "Failed to send serial data to native")
            promise.reject("SEND_SERIAL_ERROR", "Failed to send serial data to native")
        }
    }

    @ReactMethod
    fun isSerialInitialized(promise: Promise) {
        promise.resolve(isSerialInitialized)
    }

    @ReactMethod
    fun getConnectionStatus(promise: Promise) {
        val map = WritableNativeMap()
        map.putBoolean("serialInitialized", isSerialInitialized)
        map.putBoolean("controllerInitialized", controller != null)
        promise.resolve(map)
    }

    @ReactMethod
    fun cleanup(promise: Promise) {
        val ctrl = controller ?: run {
            promise.resolve("Controller not initialized")
            return
        }
        
        if (isSerialInitialized) {
            ctrl.stopSerialConnection()
            Controller.nativeCleanup()
            isSerialInitialized = false
        }
        controller = null
        Log.d(NAME, "Cleanup completed.")
        promise.resolve("Cleanup completed.")
    }

    fun sendEvent(eventName: String, eventData: String) {
        Log.d(NAME, "Sending event to JS: $eventName with data: $eventData")
        reactContext
            .getJSModule(RCTDeviceEventEmitter::class.java)
            .emit(eventName, eventData)
    }

    fun onSerialDataReceived(data: ByteArray) {
        Log.d(NAME, "Serial data received: ${data.size} bytes")
        Controller.sendDataToNative(data)
        
        val eventData = Arguments.createMap()
        eventData.putString("type", "serial_data_received")
        eventData.putInt("size", data.size)
        sendEvent("SerialDataReceived", eventData.toString())
    }

    @ReactMethod
    fun getSerialInfo(promise: Promise) {
        val map = WritableNativeMap()
        map.putBoolean("initialized", isSerialInitialized)
        map.putString("status", if (isSerialInitialized) "connected" else "disconnected")
        promise.resolve(map)
    }
}