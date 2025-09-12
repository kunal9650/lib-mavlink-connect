import { connectionManager } from './connectionManager';

class DroneAction {
  // Enum-like constants
  static readonly TAKEOFF = 'TAKEOFF';

  // Use number instead of int
  async #executeCommand(mode: string, param1: number, param2: number): Promise<string> {
    try {
      console.log(`Executing command: ${mode} with params: ${param1}, ${param2}`);
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
  async TAKEOFF(param1: number, param2: number) {
    return this.#executeCommand(DroneAction.TAKEOFF, param1, param2);
  }
}

export const droneAction = new DroneAction();

export type { DroneAction };
