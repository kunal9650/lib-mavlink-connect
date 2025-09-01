// import { NativeModules } from 'react-native';

// const { LibMavlinkConnect } = NativeModules;

// class DroneCommand {
//   /**
//    * Example method: initialize the specified connection mode
//    */
//   async executeCommand(mode: string): Promise<string> {
//     return `Executing drone command: ${mode}`;
//   }

//   async dispatchCommand(): Promise<string> {
//     return LibMavlinkConnect.dispatchCommand();
//   }
// }

// // Export a singleton instance
// export const droneCommand = new DroneCommand();

// // Optional: export the class type for consumers
// export type { DroneCommand };
import { NativeModules } from 'react-native';

const { LibMavlinkConnect } = NativeModules;

class DroneCommand {
  // Enum-like constants
  static readonly TAKEOFF = 'TAKEOFF';
  static readonly LAND = 'LAND';
  static readonly ARM = 'ARM';
  static readonly DISARM = 'DISARM';
  static readonly GUIDED = 'GUIDED';
  static readonly RETURN_TO_HOME = 'RETURN_TO_HOME';

  /**
   * Generic executor for any command
   */
  async executeCommand(mode: string): Promise<string> {
    return `Executing drone command: ${mode}`;
  }

  /**
   * Example: call into native module
   */
  async dispatchCommand(): Promise<string> {
    return LibMavlinkConnect.dispatchCommand();
  }

  /**
   * Convenience methods (optional)
   */
  TAKEOFF() {
    return this.executeCommand(DroneCommand.TAKEOFF);
  }

  LAND() {
    return this.executeCommand(DroneCommand.LAND);
  }

  ARM() {
    return this.executeCommand(DroneCommand.ARM);
  }

  DISARM() {
    return this.executeCommand(DroneCommand.DISARM);
  }

  GUIDED() {
    return this.executeCommand(DroneCommand.GUIDED);
  }

  RETURN_TO_HOME() {
    return this.executeCommand(DroneCommand.RETURN_TO_HOME);
  }
}

// Export singleton instance
export const droneCommand = new DroneCommand();

// Export class type if consumers need it
export type { DroneCommand };
