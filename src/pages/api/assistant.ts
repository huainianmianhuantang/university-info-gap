import { AI_API_KEY, AI_BASE_URL, AI_MODEL } from 'astro:env/server';

export const prerender = false;

if (typeof process !== 'undefined') {
  try {
    process.loadEnvFile?.();
  } catch {
    /* .env 不存在时忽略（生产由平台注入） */
  }
}

const SYSTEM_PROMPT = [
  '你是「象牙塔透视镜」网站的 AI 小助手，面向高考生、低年级学生和家长。',
  '网站定位：收集 985 高校的转专业政策、二次选拔、培养计划、寝室上课实况、学习资料与校园视频，帮用户看清每所大学。',
  '主要栏目与页面：',
  '- /universities/ 大学库：39 所 985 高校的概况、校徽、政策、视频',
  '- /resources/ 资料库：培养方案、保研细则、选课手册、新生指南',
  '- /quiz/ 选校测评：12 道题 + AI 建议',
  '- /compare/ 对比：把 2-3 所学校并排比较',
  '- /articles/ 专题文章：转专业、强基计划、城市生活等',
  '- /search/ 站内搜索，/submit/ 投稿，/favorites/ 我的收藏',
  '回答要求：',
  '1) 用中文，简洁口语化，一般 3-5 句；',
  '2) 结合网站栏目给出可操作建议，可提及页面路径，例如「可以到 /universities/ 大学库看看」；',
  '3) 涉及具体政策或数据时，提醒「以学校官方发布为准」；',
  '4) 不知道就直说不知道，不要编造；',
  '5) 可以建议用户去做 /quiz/ 测评，或到 /submit/ 投稿分享一手信息。',
].join('\n');

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

// 简单的进程内限流（按 IP，60 秒内最多 15 次）
const hits = new Map<string, { count: number; t: number }>();
const WINDOW = 60_000;
const MAX_HITS = 15;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const cur = hits.get(ip);
  if (!cur || now - cur.t > WINDOW) {
    hits.set(ip, { count: 1, t: now });
    return false;
  }
  cur.count += 1;
  return cur.count > MAX_HITS;
}

interface ChatMsg {
  role?: string;
  content?: string;
}

export async function POST({ request }): Promise<Response> {
  const key = AI_API_KEY || (typeof process !== 'undefined' ? process.env.AI_API_KEY : undefined);
  if (!key) {
    return json({ error: 'AI 助手暂未配置，请稍后再试' }, 503);
  }

  const host = request.headers.get('host') ?? '';
  const origin = request.headers.get('origin');
  if (origin && !origin.includes(host)) {
    return json({ error: '来源校验失败，请从本站发起对话' }, 403);
  }

  const ip =
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';
  if (rateLimited(ip)) {
    return json({ error: '问得太快啦，休息一分钟再聊吧～' }, 429);
  }

  let messages: ChatMsg[] = [];
  let userName = '';
  try {
    const raw = await request.text();
    const body = raw
      ? (JSON.parse(raw) as { messages?: ChatMsg[]; userName?: string })
      : {};
    messages = Array.isArray(body.messages) ? body.messages : [];
    userName = typeof body.userName === 'string' ? body.userName.trim().slice(0, 20) : '';
  } catch {
    return json({ error: '参数格式不对，请刷新后再试' }, 400);
  }

  if (messages.length === 0 || messages.length > 20) {
    return json({ error: '对话内容为空或过长' }, 400);
  }
  for (const m of messages) {
    if (
      !m ||
      typeof m.role !== 'string' ||
      typeof m.content !== 'string' ||
      m.content.length === 0 ||
      m.content.length > 2000
    ) {
      return json({ error: '对话内容不合法' }, 400);
    }
  }

  const base = (AI_BASE_URL || 'https://api.deepseek.com').replace(/\/$/, '');
  const model = AI_MODEL || 'deepseek-chat';
  const systemNote = userName
    ? SYSTEM_PROMPT + '\n用户昵称：' + userName + '（可以用昵称称呼用户）'
    : SYSTEM_PROMPT;

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
          { role: 'system', content: systemNote },
          ...messages.map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });
    const data = await res.json();
    const reply = (data?.choices?.[0]?.message?.content as string | undefined) ?? '';
    if (!reply) {
      return json({ error: data?.error?.message ?? '模型没有返回内容，请重试' }, 502);
    }
    return json({ reply: reply.slice(0, 4000) });
  } catch (e) {
    const msg = e instanceof Error ? e.message : '网络异常';
    return json({ error: '网络开小差了，请重试（' + msg.slice(0, 80) + '）' }, 502);
  }
}
