import { NativeModules, DeviceEventEmitter } from 'react-native';
import type { EmitterSubscription } from 'react-native';

const { LibMavlinkConnect } = NativeModules;

type ConnectionMode = 'TCP' | 'UDP' | 'SERIAL';

class ConnectionManager {
  /**
   * Initialize the specified connection mode
   */
  async initConnection(mode: ConnectionMode): Promise<string> {
    console.log(`Initializing connection in mode: ${mode}`);
    return LibMavlinkConnect.initConnection(mode);
  }

  /**
   * Stop the specified connection mode
   */
  async stopConnection(mode: ConnectionMode): Promise<string> {
    return LibMavlinkConnect.stopConnection(mode);
  }

  /**
   * Retrieve the latest MAVLink data in JSON format
   */
  async getMavlinkDataJson(): Promise<string> {
    return LibMavlinkConnect.getMavlinkDataJson();
  }

  /**
   * Send a guided mode MAVLink command
   */
  async sendGuidedCommand(command: string): Promise<string> {
    return LibMavlinkConnect.sendGuidedCommand(command);
  }

  /**
   * Send raw serial data as an array of bytes
   * Note: Serial connection must be initialized first using initConnection('SERIAL')
   */
  async sendSerialData(data: number[]): Promise<string> {
    return LibMavlinkConnect.sendSerialData(data);
  }

  /**
   * Check whether the serial connection is initialized
   */
  async isSerialInitialized(): Promise<boolean> {
    return LibMavlinkConnect.isSerialInitialized();
  }

  /**
   * Get overall connection status including serial initialization state
   */
  async getConnectionStatus(): Promise<{
    serialInitialized: boolean;
    controllerInitialized: boolean;
  }> {
    return LibMavlinkConnect.getConnectionStatus();
  }

  /**
   * Get detailed serial connection information
   */
  async getSerialInfo(): Promise<{
    initialized: boolean;
    status: 'connected' | 'disconnected';
  }> {
    return LibMavlinkConnect.getSerialInfo();
  }

  /**
   * Perform cleanup for serial connections and resources
   */
  async cleanup(): Promise<string> {
    return LibMavlinkConnect.cleanup();
  }

  /**
   * Subscribe to native events from the backend, such as telemetry or serial input
   * Available events:
   * - 'SerialDataReceived': Emitted when serial data is received
   */
  addEventListener(event: string, callback: (payload: any) => void): EmitterSubscription {
    return DeviceEventEmitter.addListener(event, callback);
  }

  /**
   * Remove event listeners for the specified event
   */
  removeEventListener(event: string): void {
    DeviceEventEmitter.removeAllListeners(event);
  }

  /**
   * Event listener helper for serial data reception
   */
  onSerialDataReceived(callback: (data: { type: string; size: number }) => void): EmitterSubscription {
    return this.addEventListener('SerialDataReceived', callback);
  }

  /**
   * Remove serial data event listener
   */
  removeSerialDataListener(): void {
    this.removeEventListener('SerialDataReceived');
  }

  /**
   * Utility function to convert string to byte array for serial transmission
   */
  stringToByteArray(str: string): number[] {
    return Array.from(str, char => char.charCodeAt(0));
  }

  /**
   * Utility function to convert hex string to byte array for serial transmission
   */
  hexToByteArray(hex: string): number[] {
    const bytes: number[] = [];
    for (let i = 0; i < hex.length; i += 2) {
      bytes.push(parseInt(hex.substr(i, 2), 16));
    }
    return bytes;
  }

  /**
   * Send MAVLink message as byte array via serial
   */
  async sendMavlinkMessage(messageBytes: number[]): Promise<string> {
    return this.sendSerialData(messageBytes);
  }

  /**
   * Send text command via serial (converts to bytes automatically)
   */
  async sendTextCommand(command: string): Promise<string> {
    const byteArray = this.stringToByteArray(command);
    return this.sendSerialData(byteArray);
  }

  /**
   * Enhanced error handling wrapper for serial operations
   */
  async safeSerialOperation<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const data = await operation();
      return { success: true, data };
    } catch (error) {
      console.error(`Serial operation '${operationName}' failed:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  /**
   * Initialize serial connection with error handling
   */
  async initSerialConnection(): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    return this.safeSerialOperation(
      () => this.initConnection('SERIAL'),
      'initSerialConnection'
    ).then(result => ({
      success: result.success,
      message: result.success ? String(result.data) : undefined,
      error: result.error
    }));
  }

  /**
   * Stop serial connection with error handling
   */
  async stopSerialConnection(): Promise<{
    success: boolean;
    message?: string;
    error?: string;
  }> {
    return this.safeSerialOperation(
      () => this.stopConnection('SERIAL'),
      'stopSerialConnection'
    ).then(result => ({
      success: result.success,
      message: result.data,
      error: result.error
    }));
  }
}

// Export singleton instance
export const connectionManager = new ConnectionManager();

// Export types for external use
export type { ConnectionMode };