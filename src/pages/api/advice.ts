import { QUESTIONS } from '../../lib/recommender';

export const prerender = false;

// 运行时从环境变量读取配置（不把 Key 打进构建产物）。
// 开发时加载项目根目录 .env；生产环境由部署平台注入环境变量。
try {
  process.loadEnvFile?.();
} catch {
  /* .env 不存在时忽略（生产由平台注入） */
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
  const key = process.env.AI_API_KEY as string | undefined;
  const base = (process.env.AI_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, '');
  const model = process.env.AI_MODEL || 'deepseek-chat';

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
      { error: err.message, cause: cause ?? null, keySet: Boolean(key) },
      502,
    );
  }
}
