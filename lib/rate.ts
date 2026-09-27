import { db } from './db';

export async function limited(key: string, max = 8, windowMs = 60_000) {
  const now = new Date();
  const cutoff = new Date(now.getTime() - windowMs);
  const current = await db.loginRateLimit.findUnique({ where: { key } });
  if (!current || current.windowStart < cutoff) {
    await db.loginRateLimit.upsert({
      where: { key },
      update: { count: 1, windowStart: now },
      create: { key, count: 1, windowStart: now },
    });
    return false;
  }
  const updated = await db.loginRateLimit.update({ where: { key }, data: { count: { increment: 1 } } });
  return updated.count > max;
}
