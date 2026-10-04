import type { IdentityPort } from '../application/drawingPorts';
export function browserIdentity(): IdentityPort {
  return {
    next: () => ({
      id: crypto.randomUUID(),
      seed: (crypto.getRandomValues(new Uint32Array(1))[0]! % 2147483646) + 1,
    }),
  };
}
