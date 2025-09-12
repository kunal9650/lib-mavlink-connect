
import { connectionManager } from './connectionManager';

class DroneAction {
  // Enum-like constants
  static readonly TAKEOFF = 'TAKEOFF';


  async #executeCommand(mode: string ,param1: int, param2: int): Promise<string> {
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

  async TAKEOFF(param1,param2) { return this.#executeCommand(DroneAction.TAKEOFF); }
}

export const droneAction = new DroneAction();

export type { DroneAction };