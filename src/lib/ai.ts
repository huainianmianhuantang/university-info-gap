import type { QuizAnswer, RecommendResult, SchoolProfile } from './recommender';
import { DIM_LABELS, QUESTIONS } from './recommender';

/**
 * AI 建议引擎（v1 = 规则引擎）。
 *
 * 预留升级路径：把 AI_PROVIDER 从 'rule' 改为 'llm' 并实现 callLLM() 后，
 * 将站点部署到支持服务端函数的平台（Vercel / Netlify / Cloudflare Pages），
 * 通过服务端接口调用大模型（如 DeepSeek / OpenAI 兼容接口），
 * 避免在前端暴露 API Key。升级步骤详见 README 与最终报告。
 */
export const AI_PROVIDER: 'rule' | 'llm' = 'rule';

export interface AdviceInput {
  answers: Record<string, number>;
  result: RecommendResult;
  schools: SchoolProfile[];
}

export interface Advice {
  provider: 'rule' | 'llm';
  text: string;
  points: string[];
}

const TRANSFER_TIPS: Record<number, string> = {
  0: '你有较强的转专业意愿，选校时建议优先关注转专业政策较宽松、二次选拔机会多的学校（很多 985 在大一有校内转专业考试或实验班选拔）。',
  1: '你希望进入拔尖班/实验班，填报时留意各校的强基计划、拔尖计划与实验班选拔时间。',
  2: '你希望一步到位，建议把专业实力与学校平台放在同等权重来比较。',
  3: '转专业与二次选拔政策是重要的“后悔药”，建议选校时一并了解。',
};

const LIFE_TIPS: Record<number, string> = {
  0: '你比较看重住宿条件，建议结合本站收录的宿舍实拍视频，重点看独立卫浴、空调与校区新旧。',
  1: '你在意生活便利与食堂，可以多看校园生活 vlog 和食堂测评。',
  2: '你更看重校园氛围与环境，可优先留意校园环境口碑好的学校。',
  3: '你对条件要求不高，可以把更多权重放在专业与平台实力上。',
};

const DISTANCE_TIPS: Record<number, string> = {
  0: '你倾向独立生活，跨省就读的选择面很广，可以大胆考虑外省名校。',
  1: '你希望离家近，筛选时优先看本省及邻近省份的高校。',
  2: '你对地域不敏感，按专业与平台实力排序即可。',
};

function pick(answers: Record<string, number>, key: string): number {
  return typeof answers[key] === 'number' ? answers[key] : 0;
}

export function getAdvice(input: AdviceInput): Advice {
  const { answers, result } = input;
  const topDims = result.dims;
  const points: string[] = [];

  const dimLine =
    topDims.length > 0
      ? `你的兴趣画像偏向「${topDims.map((d, i) => `${DIM_LABELS[d.dim]}（第${i + 1}偏好）`).join('、')}」。`
      : '你的兴趣画像比较均衡，选校时可以更多参考城市、生活条件与学校平台。';
  points.push(dimLine);

  const majorsLine =
    result.majors.length > 0
      ? `与你匹配度较高的专业方向包括：${result.majors.slice(0, 6).join('、')} 等。`
      : '建议结合分数与兴趣进一步细化专业方向。';
  points.push(majorsLine);

  const schoolLine =
    result.schools.length > 0
      ? `推荐优先了解：${result.schools
          .slice(0, 5)
          .map((s) => s.profile.name)
          .join('、')}。可以点开学校详情页查看转专业政策、培养计划与宿舍/课堂实拍视频。`
      : '暂时没有高匹配学校，建议回到大学库按省份、类型浏览。';
  points.push(schoolLine);

  const tips = [
    TRANSFER_TIPS[pick(answers, 'transfer')],
    LIFE_TIPS[pick(answers, 'life')],
    DISTANCE_TIPS[pick(answers, 'distance')],
  ].filter(Boolean);
  points.push(...tips);

  points.push(
    '温馨提示：以上结果基于兴趣问卷的规则匹配，仅供参考；最终志愿请结合高考分数、位次与官方招生章程。',
  );

  return {
    provider: AI_PROVIDER,
    text: points.join('\n'),
    points,
  };
}

/**
 * 预留的 LLM 调用入口（当前未启用）。
 * 启用条件：AI_PROVIDER = 'llm'，且服务端配置好 API Key 与 endpoint。
 */
export async function getLLMAdvice(
  _input: AdviceInput,
  _apiKey?: string,
): Promise<Advice> {
  throw new Error(
    'LLM 模式未启用：请在服务端配置 API Key 后启用（见 README「AI 建议升级说明」）。',
  );
}

export { QUESTIONS };
