import { HealthController } from '../../src/main/controller/healthController';

describe('HealthController (unit)', () => {
  it('health() returns { ok: true }', () => {
    const c = new HealthController();
    expect(c.health()).toEqual({ ok: true });
  });
});
