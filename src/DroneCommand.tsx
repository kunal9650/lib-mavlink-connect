import { NativeModules } from 'react-native';

const { LibMavlinkConnect } = NativeModules;

class DroneCommand {
  /**
   * Example method: initialize the specified connection mode
   */
  async executeCommand(mode: string): Promise<string> {
    return `Executing drone command: ${mode}`;
  }

  async dispatchCommand(): Promise<string> {
    return LibMavlinkConnect.dispatchCommand();
  }
}

// Export a singleton instance
export const droneCommand = new DroneCommand();

// Optional: export the class type for consumers
export type { DroneCommand };
