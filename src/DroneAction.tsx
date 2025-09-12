import { connectionManager } from './connectionManager';

class DroneAction {
  // Enum-like constants
  static readonly TAKEOFF = 'TAKEOFF';

  // Accept params as an object for flexibility
  async #executeCommand(
    mode: string,
    params: Record<string, number> = {}
  ): Promise<string> {
    try {
      console.log(`Executing command: ${mode} with params:`, params);
      const result = await connectionManager.dispatchAction(mode, params);
      console.log(`Native dispatchCommand returned: ${result}`);
      return result;
    } catch (err) {
      console.error('dispatchCommand failed:', err);
      throw err;
    }
  }

  /**
   * Public convenience methods
   */
  async TAKEOFF(altitude: number) {
    return this.#executeCommand(DroneAction.TAKEOFF, { altitude });
  }
}

export const droneAction = new DroneAction();

export type { DroneAction };
