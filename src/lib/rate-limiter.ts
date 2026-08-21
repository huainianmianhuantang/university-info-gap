/**
 * 限流工具：优先使用 Cloudflare KV（跨实例共享、持久化），
 * 未配置 KV 绑定时自动回退到进程内内存 Map（本地开发 / 单实例）。
 *
 * 绑定说明（生产环境）：
 * - 在 Cloudflare 控制台 Workers & Pages → 对应 Pages 项目 → Settings → Bindings
 *   添加 KV namespace 绑定，变量名固定为 `RATE_LIMIT_KV`。
 * - 本地开发不需要绑定：代码会回退到内存限流。
 */

interface KVNamespaceLike {
  get(key: string, type: 'json'): Promise<unknown>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

interface RateLimitEnv {
  RATE_LIMIT_KV?: KVNamespaceLike;
}

let cachedEnv: RateLimitEnv | null | undefined;

async function getEnv(): Promise<RateLimitEnv | null> {
  if (cachedEnv !== undefined) return cachedEnv;
  try {
    const mod = (await import('cloudflare:workers')) as { env?: RateLimitEnv };
    cachedEnv = mod.env ?? {};
  } catch {
    cachedEnv = null;
  }
  return cachedEnv;
}

/** 进程内兜底限流（KV 不可用或未绑定时），滑动窗口 */
const memBuckets = new Map<string, number[]>();

function memRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const hits = (memBuckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    memBuckets.set(key, hits);
    return true;
  }
  hits.push(now);
  memBuckets.set(key, hits);
  return false;
}

/** KV 滑动窗口限流：时间戳数组存 JSON，TTL 对齐窗口长度 */
async function kvRateLimited(
  kv: KVNamespaceLike,
  key: string,
  limit: number,
  windowMs: number,
): Promise<boolean> {
  const now = Date.now();
  const raw = await kv.get(key, 'json');
  const timestamps: number[] = Array.isArray(raw)
    ? raw.filter((t): t is number => typeof t === 'number' && now - t < windowMs)
    : [];
  const ttl = Math.max(60, Math.ceil(windowMs / 1000));
  if (timestamps.length >= limit) {
    await kv.put(key, JSON.stringify(timestamps), { expirationTtl: ttl });
    return true;
  }
  timestamps.push(now);
  await kv.put(key, JSON.stringify(timestamps), { expirationTtl: ttl });
  return false;
}

export interface RateLimiter {
  (source: string): Promise<boolean>;
  /** 当前实际使用的存储模式 */
  mode(): Promise<'kv' | 'memory'>;
}

export function createRateLimiter(limit: number, windowMs: number, bucketName: string): RateLimiter {
  const limiter = (async (source: string): Promise<boolean> => {
    const env = await getEnv();
    const kv = env?.RATE_LIMIT_KV;
    if (!kv) return memRateLimited(`${bucketName}:${source}`, limit, windowMs);
    return kvRateLimited(kv, `rl:${bucketName}:${source}`, limit, windowMs);
  }) as RateLimiter;
  limiter.mode = async () => {
    const env = await getEnv();
    return env?.RATE_LIMIT_KV ? 'kv' : 'memory';
  };
  return limiter;
}
