/**
 * A Linear Congruential Generator (LCG) for deterministic pseudo-randomness.
 * This guarantees identical simulation telemetry across runs.
 */
export class LCG {
  private state: number;

  constructor(seedStr: string) {
    this.state = this.hash(seedStr);
  }

  /**
   * Simple FNV-1a hash function to convert seed string to 32-bit integer.
   */
  private hash(str: string): number {
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  /**
   * Returns a pseudo-random number in [0, 1)
   */
  next(): number {
    // Standard numerical recipes values
    this.state = (Math.imul(this.state, 1664525) + 1013904223) >>> 0;
    return this.state / 0xffffffff;
  }

  /**
   * Returns a pseudo-random float in [min, max)
   */
  nextRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /**
   * Returns a pseudo-random integer in [min, max]
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.nextRange(min, max + 1));
  }

  /**
   * Selects a random element from an array deterministically.
   */
  choice<T>(arr: T[]): T {
    const idx = this.nextInt(0, arr.length - 1);
    return arr[idx];
  }
}
