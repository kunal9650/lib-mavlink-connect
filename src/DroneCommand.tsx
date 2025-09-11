
import { connectionManager } from './connectionManager';

class DroneCommand {
  // Enum-like constants
  static readonly STABILIZE = 'STABILIZE';
  static readonly ACRO = 'ACRO';
  static readonly ALT_HOLD = 'ALT_HOLD';
  static readonly AUTO = 'AUTO';
  static readonly GUIDED = 'GUIDED';
  static readonly LOITER = 'LOITER';
  static readonly RTL = 'LOITRTLER';
  static readonly CIRCLE = 'CIRCLE';
  static readonly POSITION = 'POSITION';
  static readonly LAND = 'LAND';
  static readonly OF_LOITER = 'OF_LOITER';
  static readonly DRIFT = 'DRIFT';
  static readonly SPORT = 'SPORT';
  static readonly FLIP = 'FLIP';
  static readonly AUTOTUNE = 'AUTOTUNE';
  static readonly POSHOLD = 'POSHOLD';
  static readonly BRAKE = 'BRAKE';
  static readonly THROW = 'THROW';
  static readonly AVOID_ADSB = 'AVOID_ADSB';
  static readonly GUIDED_NOGPS = 'GUIDED_NOGPS';
  static readonly SMART_RTL = 'SMART_RTL';
  static readonly FLOWHOLD = 'FLOWHOLD';
  static readonly FOLLOW = 'FOLLOW';
  static readonly ZIGZAG = 'ZIGZAG';
  static readonly SYSTEMID = 'SYSTEMID';
  static readonly AUTOROTATE = 'AUTOROTATE';
  static readonly AUTO_RTL = 'AUTO_RTL';


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

  async STABILIZE() { return this.#executeCommand(DroneCommand.STABILIZE); }
  async ACRO() { return this.#executeCommand(DroneCommand.ACRO); }
  async ALT_HOLD() { return this.#executeCommand(DroneCommand.ALT_HOLD); }
  async AUTO() { return this.#executeCommand(DroneCommand.AUTO); }
  async GUIDED() { return this.#executeCommand(DroneCommand.GUIDED); }
  async LOITER() { return this.#executeCommand(DroneCommand.LOITER); }
  async RTL() { return this.#executeCommand(DroneCommand.RTL); }
  async CIRCLE() { return this.#executeCommand(DroneCommand.CIRCLE); }
  async POSITION() { return this.#executeCommand(DroneCommand.POSITION); }
  async LAND() { return this.#executeCommand(DroneCommand.LAND); }
  async OF_LOITER() { return this.#executeCommand(DroneCommand.OF_LOITER); }
  async DRIFT() { return this.#executeCommand(DroneCommand.DRIFT); }
  async SPORT() { return this.#executeCommand(DroneCommand.SPORT); }
  async FLIP() { return this.#executeCommand(DroneCommand.FLIP); }
  async AUTOTUNE() { return this.#executeCommand(DroneCommand.AUTOTUNE); }
  async POSHOLD() { return this.#executeCommand(DroneCommand.POSHOLD); }
  async BRAKE() { return this.#executeCommand(DroneCommand.BRAKE); }
  async THROW() { return this.#executeCommand(DroneCommand.THROW); }
  async AVOID_ADSB() { return this.#executeCommand(DroneCommand.AVOID_ADSB); }
  async GUIDED_NOGPS() { return this.#executeCommand(DroneCommand.GUIDED_NOGPS); }
  async SMART_RTL() { return this.#executeCommand(DroneCommand.SMART_RTL); }
  async FLOWHOLD() { return this.#executeCommand(DroneCommand.FLOWHOLD); }
  async FOLLOW() { return this.#executeCommand(DroneCommand.FOLLOW); }
  async ZIGZAG() { return this.#executeCommand(DroneCommand.ZIGZAG); }
  async SYSTEMID() { return this.#executeCommand(DroneCommand.SYSTEMID); }
  async AUTOROTATE() { return this.#executeCommand(DroneCommand.AUTOROTATE); }
  async AUTO_RTL() { return this.#executeCommand(DroneCommand.AUTO_RTL); }
}

export const droneCommand = new DroneCommand();

export type { DroneCommand };