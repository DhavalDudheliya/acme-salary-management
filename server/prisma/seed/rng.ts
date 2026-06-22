/**
 * Deterministic, dependency-free PRNG for reproducible seeds.
 *
 * Uses mulberry32 — a small, fast 32-bit generator. Given the same seed it
 * always produces the same sequence, so the 10k dataset is identical on every
 * run (reproducible demos, test-safe fixtures). No `Math.random`, no clock.
 */
export class Rng {
  private state: number

  constructor(seed: number) {
    this.state = seed >>> 0
  }

  /** Next float in [0, 1). */
  float(): number {
    this.state = (this.state + 0x6d2b79f5) | 0
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  /** Integer in [min, max], inclusive. */
  int(min: number, max: number): number {
    return Math.floor(this.float() * (max - min + 1)) + min
  }

  /** Uniformly pick one element of a non-empty array. */
  pick<T>(items: readonly T[]): T {
    return items[this.int(0, items.length - 1)]
  }

  /** True with probability `p` (0..1). */
  chance(p: number): boolean {
    return this.float() < p
  }

  /** Deterministic UUID v4, drawn from the same stream. */
  uuid(): string {
    const bytes = new Array<number>(16)
    for (let i = 0; i < 16; i += 1) {
      bytes[i] = this.int(0, 255)
    }
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = bytes.map((b) => b.toString(16).padStart(2, '0'))
    return (
      hex.slice(0, 4).join('') +
      '-' +
      hex.slice(4, 6).join('') +
      '-' +
      hex.slice(6, 8).join('') +
      '-' +
      hex.slice(8, 10).join('') +
      '-' +
      hex.slice(10, 16).join('')
    )
  }
}
