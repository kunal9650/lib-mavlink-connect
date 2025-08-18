import LibMavlinkConnect from './NativeLibMavlinkConnect';

export function multiply(a: number, b: number): number {
  return LibMavlinkConnect.multiply(a, b);
}
