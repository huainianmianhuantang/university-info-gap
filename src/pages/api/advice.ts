import { QUESTIONS } from '../../lib/recommender';
import { AI_API_KEY, AI_BASE_URL, AI_MODEL } from 'astro:env/server';
import { createRateLimiter } from '../../lib/rate-limiter';

export const prerender = false;

/** 简易内存限流：每个来源每分钟最多 12 次，防止接口被滥用消耗 API 预算 */
const adviceRateLimiter = createRateLimiter(12, 60_000, 'advice');

function requestSource(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'local'
  );
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // 无 Origin 的请求（如 curl）按同源处理
  try {
    const host = request.headers.get('host') ?? '';
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// 运行时从环境变量读取配置（不把 Key 打进构建产物）。
// 开发时加载项目根目录 .env；生产环境由部署平台注入环境变量。
if (typeof process !== 'undefined') {
  try {
    process.loadEnvFile?.();
  } catch {
    /* .env 不存在时忽略（生产由平台注入） */
  }
}

interface AdviceBody {
  answers?: Record<string, number>;
  result?: {
    dims?: { dim: string; score: number }[];
    majors?: string[];
    schools?: { name: string; majors: string[]; city?: string }[];
  };
}

const SYSTEM_PROMPT =
  '你是一名专业、客观、温和的高考志愿规划助手，面向中国考生与家长。' +
  '请根据用户的兴趣测评结果给出选专业与选校建议。要求：' +
  '1) 用中文，分点输出，每点单独一行，最多 6 点；' +
  '2) 先给结论再给依据，语言具体、避免空话；' +
  '3) 提及匹配的专业方向与学校时要结合测评数据；' +
  '4) 如问卷显示用户有转专业或二次选拔意愿，请给出具体的转专业/二次选拔策略建议；' +
  '5) 提醒结果仅供参考、最终以分数位次和官方招生章程为准；' +
  '6) 总字数控制在 500 字以内。';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function buildPrompt(body: AdviceBody): string {
  const answers = body.answers ?? {};
  const lines: string[] = [];
  for (const [qid, optIdx] of Object.entries(answers)) {
    const q = QUESTIONS.find((x) => x.id === qid);
    const opt = q?.options[Number(optIdx)];
    if (q && opt) lines.push(`- ${q.title} → ${opt.label}`);
  }
  const r = body.result ?? {};
  const dims = (r.dims ?? []).map((d) => `${d.dim}:${d.score}`).join('、');
  const majors = (r.majors ?? []).join('、');
  const schools = (r.schools ?? [])
    .map((s) => `${s.name}（${(s.majors ?? []).slice(0, 3).join('/')}）`)
    .join('、');

  return [
    '以下是一位高中生的选校测评数据：',
    '【问卷回答】',
    lines.join('\n') || '（无）',
    '【兴趣画像】',
    dims || '（无）',
    '【匹配专业方向】',
    majors || '（无）',
    '【推荐高校及匹配专业】',
    schools || '（无）',
    '',
    '请基于以上信息给出专业、具体的选专业与选校建议。',
  ].join('\n');
}

export async function POST({ request }): Promise<Response> {
  if (!sameOrigin(request)) {
    return json({ error: '跨域请求被拒绝' }, 403);
  }
  if (await adviceRateLimiter(requestSource(request))) {
    return json({ error: '请求过于频繁，请稍后再试' }, 429);
  }
  const key = AI_API_KEY || (typeof process !== 'undefined' ? process.env.AI_API_KEY : undefined);
  const base = (AI_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, '');
  const model = AI_MODEL || 'deepseek-chat';

  if (!key) {
    return json({ error: 'AI 未配置：请在 .env 中填写 AI_API_KEY' });
  }

  let body: AdviceBody;
  try {
    const raw = await request.text();
    body = raw ? (JSON.parse(raw) as AdviceBody) : {};
  } catch (e) {
    return json(
      { error: '参数格式错误', detail: e instanceof Error ? e.message : String(e) },
      400,
    );
  }
  const answers = body.answers ?? {};
  if (
    typeof answers !== 'object' ||
    Object.keys(answers).length > 20 ||
    Object.values(answers).some((v) => typeof v !== 'number')
  ) {
    return json({ error: '问卷参数不合法' }, 400);
  }
  if (Array.isArray(body.result?.schools) && body.result.schools.length > 12) {
    return json({ error: '推荐学校数量不合法' }, 400);
  }

  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildPrompt(body) },
        ],
        temperature: 0.7,
        max_tokens: 900,
      }),
    });
    const data = await res.json();
    const text = (data?.choices?.[0]?.message?.content as string | undefined) ?? '';
    if (!text) {
      return json({ error: data?.error?.message ?? '模型未返回内容' });
    }
    const points = text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.replace(/^[-•·\d.、\s]+/, '').trim())
      .filter(Boolean);
    return json({ text, points, model });
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    const cause = (err.cause as { message?: string } | undefined)?.message;
    return json(
      { error: err.message, cause: cause ?? null },
      502,
    );
  }
}
