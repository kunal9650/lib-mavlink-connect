import { connectionManager } from './connectionManager';

class DroneAction {
  // Enum-like constants
  static readonly TAKEOFF = 'TAKEOFF';
  static readonly MISSIONSEND = 'MISSIONSEND';

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
  async MISSIONSEND(altitude: number,param1: number,param2: number,param3: number,param4: number,lat: number,lon: number  ) {
    return this.#executeCommand(DroneAction.MISSIONSEND, { altitude,param1,param2,param3,param4,lat,lon });
  }

}

export const droneAction = new DroneAction();

export type { DroneAction };
