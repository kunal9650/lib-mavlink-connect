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
import { connectionManager } from './connectionManager';

class DroneCommand {
  // Enum-like constants
  static readonly TAKEOFF = 'TAKEOFF';
  static readonly LAND = 'LAND';
  static readonly ARM = 'ARM';
  static readonly DISARM = 'DISARM';
  static readonly GUIDED = 'GUIDED';
  static readonly RETURN_TO_HOME = 'RETURN_TO_HOME';


  async #executeCommand(mode: string): Promise<string> {
    try {
      const result = await connectionManager.dispatchCommand(mode);
      console.log(`Native dispatchCommand returned: ${result}`);
      return result;
    } catch (err) {
      console.error('dispatchCommand failed:', err);
      throw err;
    }
  }

  /**
   * Public convenience methods - these are the only ways users can execute commands
   */
  async TAKEOFF(): Promise<string> {
    return this.#executeCommand(DroneCommand.TAKEOFF);
  }

  async LAND(): Promise<string> {
    return this.#executeCommand(DroneCommand.LAND);
  }

  async ARM(): Promise<string> {
    return this.#executeCommand(DroneCommand.ARM);
  }

  async DISARM(): Promise<string> {
    return this.#executeCommand(DroneCommand.DISARM);
  }

  async GUIDED(): Promise<string> {
    return this.#executeCommand(DroneCommand.GUIDED);
  }

  async RETURN_TO_HOME(): Promise<string> {
    return this.#executeCommand(DroneCommand.RETURN_TO_HOME);
  }
}

// Export singleton instance
export const droneCommand = new DroneCommand();

// Export class type if consumers need it
export type { DroneCommand };