export type Dim = '理' | '工' | '医' | '农' | '文' | '经' | '艺';

export interface QuizOption {
  label: string;
  score?: Partial<Record<Dim, number>>;
  cities?: string[];
  typePref?: '综合' | '理工' | '师范' | '农林' | '其他';
}

export interface QuizQuestion {
  id: string;
  title: string;
  subtitle?: string;
  options: QuizOption[];
}

export const DIM_LABELS: Record<Dim, string> = {
  理: '理学·基础研究',
  工: '工学·工程技术',
  医: '医学·健康',
  农: '农学·生命与自然',
  文: '人文社科',
  经: '经管法商',
  艺: '艺术与传媒',
};

export const DIM_MAJORS: Record<Dim, string[]> = {
  理: ['数学', '物理学', '化学', '生物科学', '统计学', '天文学', '地理科学'],
  工: ['计算机科学与技术', '电子信息', '机械工程', '自动化', '航空航天', '土木建筑', '材料', '能源动力'],
  医: ['临床医学', '口腔医学', '基础医学', '药学', '公共卫生', '护理学'],
  农: ['农学', '园艺', '植物保护', '动物科学', '食品科学', '资源环境科学'],
  文: ['中国语言文学', '历史学', '哲学', '新闻传播', '教育学', '外语', '法学(社科方向)'],
  经: ['经济学', '金融学', '工商管理', '会计学', '法学', '国际经贸', '公共管理'],
  艺: ['设计学', '美术学', '音乐舞蹈', '戏剧影视', '数字媒体艺术'],
};

export const QUESTIONS: QuizQuestion[] = [
  {
    id: 'interest',
    title: '你平时对哪类内容最感兴趣？',
    subtitle: '选一个最贴近的',
    options: [
      { label: '数学、物理、逻辑推理', score: { 理: 3, 工: 1 } },
      { label: '动手做实验、拆装创造', score: { 工: 3, 理: 1 } },
      { label: '阅读写作、历史人文、语言', score: { 文: 3 } },
      { label: '生命、健康、医学知识', score: { 医: 3, 农: 1 } },
      { label: '商业、经济、社会热点', score: { 经: 3 } },
      { label: '绘画、音乐、设计、表演', score: { 艺: 3 } },
    ],
  },
  {
    id: 'strength',
    title: '高中阶段你最擅长的科目是？',
    options: [
      { label: '数学 / 物理', score: { 理: 2, 工: 2 } },
      { label: '化学 / 生物', score: { 医: 2, 农: 2 } },
      { label: '语文 / 英语 / 历史 / 政治', score: { 文: 2, 经: 1 } },
      { label: '信息技术 / 通用技术', score: { 工: 2, 理: 1 } },
      { label: '美术 / 音乐 / 体育', score: { 艺: 2, 文: 1 } },
    ],
  },
  {
    id: 'studyStyle',
    title: '你更喜欢哪种学习方式？',
    options: [
      { label: '推导公式、刷题、钻研原理', score: { 理: 3 } },
      { label: '做实验、动手实操', score: { 工: 2, 医: 1, 农: 2 } },
      { label: '阅读、写作、讨论交流', score: { 文: 2, 经: 1 } },
      { label: '做项目、组队实践、商业模拟', score: { 工: 1, 经: 2 } },
      { label: '创作、排练、展示作品', score: { 艺: 3 } },
    ],
  },
  {
    id: 'career',
    title: '未来你更向往哪类职业？',
    options: [
      { label: '科研人员、高校教师', score: { 理: 3, 医: 1 } },
      { label: '工程师、技术研发', score: { 工: 3 } },
      { label: '医生、医疗健康', score: { 医: 3 } },
      { label: '教师、公务员、媒体、出版', score: { 文: 3 } },
      { label: '金融、创业、企业管理', score: { 经: 3 } },
      { label: '设计师、演员、音乐人、自媒体', score: { 艺: 3 } },
    ],
  },
  {
    id: 'lab',
    title: '你能接受临床、实验或下田实习这类实践吗？',
    options: [
      { label: '非常愿意，喜欢接触真实场景', score: { 医: 2, 农: 2, 工: 1 } },
      { label: '可以接受，不排斥', score: { 医: 1, 农: 1 } },
      { label: '不太想，更喜欢案头或创意工作', score: { 文: 1, 经: 1, 艺: 1 } },
    ],
  },
  {
    id: 'city',
    title: '你对城市有偏好吗？',
    subtitle: '影响学校推荐排序',
    options: [
      { label: '北京', cities: ['北京'] },
      { label: '上海', cities: ['上海'] },
      { label: '广州 / 深圳', cities: ['广东'] },
      { label: '南京 / 杭州 / 合肥', cities: ['江苏', '浙江', '安徽'] },
      { label: '武汉 / 长沙', cities: ['湖北', '湖南'] },
      { label: '成都 / 重庆', cities: ['四川', '重庆'] },
      { label: '东北（沈阳/大连/长春/哈尔滨）', cities: ['辽宁', '吉林', '黑龙江'] },
      { label: '西安 / 兰州', cities: ['陕西', '甘肃'] },
      { label: '天津 / 山东', cities: ['天津', '山东'] },
      { label: '无所谓，看学校实力', cities: [] },
    ],
  },
  {
    id: 'life',
    title: '住宿与生活条件，你最在意什么？',
    options: [
      { label: '独立卫浴、空调、新宿舍', score: {} },
      { label: '食堂好吃、生活便利', score: {} },
      { label: '校园环境优美、氛围好', score: {} },
      { label: '条件一般也能接受', score: {} },
    ],
  },
  {
    id: 'schoolType',
    title: '你更喜欢哪类大学？',
    options: [
      { label: '综合性大学（学科齐全）', typePref: '综合' },
      { label: '理工类强校', typePref: '理工' },
      { label: '师范类院校', typePref: '师范' },
      { label: '农林类院校', typePref: '农林' },
      { label: '都可以，看具体专业', typePref: '其他' },
    ],
  },
  {
    id: 'cost',
    title: '对学费和生活成本的敏感度？',
    options: [
      { label: '比较敏感，想控制开销', score: {} },
      { label: '一般，正常水平即可', score: {} },
      { label: '不敏感，优先学校实力', score: {} },
    ],
  },
  {
    id: 'transfer',
    title: '关于转专业和二次选拔，你的想法是？',
    options: [
      { label: '想先冲名校，入学后转专业', score: {} },
      { label: '想进拔尖班 / 实验班', score: {} },
      { label: '希望一步到位读想读的专业', score: {} },
      { label: '没想好，先了解一下', score: {} },
    ],
  },
  {
    id: 'distance',
    title: '你能接受离家多远？',
    options: [
      { label: '越远越好，独立生活', score: {} },
      { label: '省内或邻近省份最好', score: {} },
      { label: '无所谓，看学校', score: {} },
    ],
  },
  {
    id: 'personality',
    title: '你的性格更接近？',
    options: [
      { label: '坐得住、喜欢钻研', score: { 理: 2, 医: 1 } },
      { label: '动手能力强、闲不住', score: { 工: 2 } },
      { label: '爱表达、善沟通、有领导力', score: { 经: 2, 文: 1 } },
      { label: '安静独立、有创意', score: { 文: 1, 艺: 1, 理: 1 } },
    ],
  },
];

export interface SchoolProfile {
  id: string;
  name: string;
  type: string;
  province: string;
  city: string;
  tags: string[];
  levels: string[];
}

/** 各兴趣维度的推荐学校（含匹配的优势专业） */
export const DIM_SCHOOLS: Record<Dim, { slug: string; majors: string[] }[]> = {
  理: [
    { slug: 'peking-university', majors: ['数学', '物理', '化学'] },
    { slug: 'tsinghua-university', majors: ['数学', '物理'] },
    { slug: 'ustc', majors: ['数学', '物理', '化学'] },
    { slug: 'fudan', majors: ['数学', '物理', '化学'] },
    { slug: 'nju', majors: ['数学', '物理', '天文'] },
    { slug: 'zhejiang-university', majors: ['数学', '化学'] },
    { slug: 'nankai', majors: ['数学', '化学'] },
    { slug: 'jilin-university', majors: ['数学', '化学'] },
    { slug: 'lzu', majors: ['化学', '物理'] },
    { slug: 'wuhan-university', majors: ['数学', '物理'] },
  ],
  工: [
    { slug: 'tsinghua-university', majors: ['计算机', '电子', '机械'] },
    { slug: 'hit', majors: ['航天', '机械', '计算机'] },
    { slug: 'xjtu', majors: ['电气', '机械', '能动'] },
    { slug: 'huazhong-ust', majors: ['机械', '光电', '计算机'] },
    { slug: 'seu', majors: ['建筑', '电子', '土木'] },
    { slug: 'buaa', majors: ['航空航天', '计算机'] },
    { slug: 'bit', majors: ['兵器', '车辆', '信息'] },
    { slug: 'tju', majors: ['化工', '建筑', '精仪'] },
    { slug: 'tongji', majors: ['土木', '建筑', '交通'] },
    { slug: 'dlut', majors: ['化工', '机械', '船舶'] },
    { slug: 'scut', majors: ['轻工', '材料', '建筑'] },
    { slug: 'npu', majors: ['航空', '航天', '航海'] },
    { slug: 'uestc', majors: ['电子', '通信', '计算机'] },
    { slug: 'cqu', majors: ['建筑', '机械', '电气'] },
    { slug: 'northeastern-university', majors: ['自动化', '冶金', '计算机'] },
    { slug: 'sysu', majors: ['电子', '计算机'] },
  ],
  医: [
    { slug: 'peking-university', majors: ['临床医学', '基础医学'] },
    { slug: 'sjtu', majors: ['临床医学', '口腔医学'] },
    { slug: 'fudan', majors: ['临床医学', '药学'] },
    { slug: 'zhejiang-university', majors: ['临床医学', '口腔医学'] },
    { slug: 'sysu', majors: ['临床医学', '口腔医学'] },
    { slug: 'scu', majors: ['口腔医学', '临床医学'] },
    { slug: 'huazhong-ust', majors: ['临床医学', '公卫'] },
    { slug: 'csu', majors: ['临床医学', '护理'] },
    { slug: 'jilin-university', majors: ['临床医学', '药学'] },
    { slug: 'sdu', majors: ['临床医学', '口腔'] },
  ],
  农: [
    { slug: 'cau', majors: ['农学', '园艺', '食品'] },
    { slug: 'nwafu', majors: ['农学', '林学', '动科'] },
    { slug: 'zhejiang-university', majors: ['农学', '食品'] },
    { slug: 'nju', majors: ['生物科学'] },
  ],
  文: [
    { slug: 'peking-university', majors: ['中文', '历史', '哲学'] },
    { slug: 'renmin-university', majors: ['中文', '新闻', '法学'] },
    { slug: 'fudan', majors: ['中文', '新闻', '哲学'] },
    { slug: 'nju', majors: ['中文', '历史', '外语'] },
    { slug: 'wuhan-university', majors: ['中文', '新闻'] },
    { slug: 'bnu', majors: ['教育', '心理', '中文'] },
    { slug: 'ecnu', majors: ['教育', '心理', '中文'] },
    { slug: 'nankai', majors: ['中文', '历史'] },
    { slug: 'xmu', majors: ['中文', '新闻', '法学'] },
    { slug: 'zhejiang-university', majors: ['中文', '历史'] },
  ],
  经: [
    { slug: 'peking-university', majors: ['经济', '金融', '法学'] },
    { slug: 'tsinghua-university', majors: ['经济', '金融', '管理'] },
    { slug: 'renmin-university', majors: ['金融', '经济', '法学'] },
    { slug: 'fudan', majors: ['经济', '金融'] },
    { slug: 'sjtu', majors: ['经济', '管理'] },
    { slug: 'wuhan-university', majors: ['经济', '法学'] },
    { slug: 'xmu', majors: ['经济', '金融', '会计'] },
    { slug: 'nankai', majors: ['金融', '经济'] },
    { slug: 'sysu', majors: ['经济', '管理', '法学'] },
    { slug: 'zhejiang-university', majors: ['经济', '管理'] },
  ],
  艺: [
    { slug: 'tsinghua-university', majors: ['设计学', '美术'] },
    { slug: 'bnu', majors: ['戏剧影视', '美术', '舞蹈'] },
    { slug: 'ecnu', majors: ['美术', '设计', '音乐'] },
    { slug: 'muc', majors: ['美术', '音乐', '舞蹈'] },
    { slug: 'xmu', majors: ['美术', '设计'] },
    { slug: 'scu', majors: ['设计', '音乐'] },
    { slug: 'sysu', majors: ['数字媒体'] },
  ],
};

/**
 * 粗略分层（按往年理科一批大致位次估算，仅用于测评结果的“冲/稳/保”参考）。
 * bound 表示该档大致门槛位次（数字越小要求越高），最终请以官方数据为准。
 */
export const SCHOOL_TIERS: Record<string, { tier: 'top' | 'mid' | 'other'; bound: number }> = {
  'peking-university': { tier: 'top', bound: 1000 },
  'tsinghua-university': { tier: 'top', bound: 1000 },
  'fudan': { tier: 'top', bound: 1800 },
  'sjtu': { tier: 'top', bound: 1800 },
  'zhejiang-university': { tier: 'top', bound: 2000 },
  'ustc': { tier: 'top', bound: 2000 },
  'nju': { tier: 'top', bound: 2500 },
  'hit': { tier: 'top', bound: 3500 },
  'xjtu': { tier: 'top', bound: 4500 },
  'renmin-university': { tier: 'mid', bound: 3000 },
  'buaa': { tier: 'mid', bound: 3500 },
  'bit': { tier: 'mid', bound: 4500 },
  'tongji': { tier: 'mid', bound: 4500 },
  'tju': { tier: 'mid', bound: 5000 },
  'nankai': { tier: 'mid', bound: 5000 },
  'huazhong-ust': { tier: 'mid', bound: 5000 },
  'wuhan-university': { tier: 'mid', bound: 5500 },
  'seu': { tier: 'mid', bound: 5500 },
  'scu': { tier: 'mid', bound: 6500 },
  'sysu': { tier: 'mid', bound: 6500 },
  'xmu': { tier: 'mid', bound: 7000 },
  'sdu': { tier: 'mid', bound: 8000 },
  'csu': { tier: 'mid', bound: 8000 },
  'scut': { tier: 'mid', bound: 8000 },
  'cqu': { tier: 'mid', bound: 8500 },
  'dlut': { tier: 'mid', bound: 9000 },
  'npu': { tier: 'mid', bound: 9000 },
  'uestc': { tier: 'mid', bound: 9000 },
  'ecnu': { tier: 'mid', bound: 9000 },
  'bnu': { tier: 'mid', bound: 9000 },
  'hunan-university': { tier: 'mid', bound: 10000 },
  'jilin-university': { tier: 'other', bound: 12000 },
  'lzu': { tier: 'other', bound: 13000 },
  'cau': { tier: 'other', bound: 13000 },
  'muc': { tier: 'other', bound: 14000 },
  'ouc': { tier: 'other', bound: 14000 },
  'northeastern-university': { tier: 'other', bound: 14000 },
  'nudt': { tier: 'other', bound: 9000 },
  'nwafu': { tier: 'other', bound: 18000 },
};

export function tierOf(rank: number, slug: string): '冲' | '稳' | '保' | null {
  const info = SCHOOL_TIERS[slug];
  if (!info || !Number.isFinite(rank) || rank <= 0) return null;
  if (rank <= info.bound * 0.7) return '保';
  if (rank <= info.bound) return '稳';
  return '冲';
}

export interface QuizAnswer {
  interest: number;
  strength: number;
  studyStyle: number;
  career: number;
  lab: number;
  city: number;
  life: number;
  schoolType: number;
  cost: number;
  transfer: number;
  distance: number;
  personality: number;
}

export interface RecommendResult {
  dims: { dim: Dim; score: number }[];
  majors: string[];
  schools: { profile: SchoolProfile; majors: string[]; score: number }[];
}

export function recommend(
  answers: Record<string, number>,
  schools: SchoolProfile[],
): RecommendResult {
  const dimScore: Record<Dim, number> = { 理: 0, 工: 0, 医: 0, 农: 0, 文: 0, 经: 0, 艺: 0 };
  const cities: string[] = [];
  let typePref = '其他';

  for (const [qid, optIdx] of Object.entries(answers)) {
    const q = QUESTIONS.find((x) => x.id === qid);
    if (!q) continue;
    const opt = q.options[optIdx];
    if (!opt) continue;
    if (opt.score) {
      for (const [dim, v] of Object.entries(opt.score)) {
        dimScore[dim as Dim] += v ?? 0;
      }
    }
    if (opt.cities) cities.push(...opt.cities);
    if (opt.typePref) typePref = opt.typePref;
  }

  const dims = (Object.entries(dimScore) as [Dim, number][])
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  const schoolScore = new Map<string, { score: number; majors: string[] }>();
  dims.slice(0, 3).forEach(([dim], idx) => {
    const weight = [4, 2, 1][idx] ?? 0;
    for (const s of DIM_SCHOOLS[dim] ?? []) {
      const cur = schoolScore.get(s.slug) ?? { score: 0, majors: [] };
      cur.score += weight;
      cur.majors = [...new Set([...cur.majors, ...s.majors])];
      schoolScore.set(s.slug, cur);
    }
  });

  for (const profile of schools) {
    const cur = schoolScore.get(profile.id);
    if (!cur) continue;
    let bonus = 0;
    if (cities.includes(profile.province) || cities.some((c) => profile.city.includes(c) || c.includes(profile.city))) {
      bonus += 2;
    }
    if (typePref === '综合' && profile.type === '综合') bonus += 1.5;
    if (typePref === '理工' && profile.type === '理工') bonus += 1.5;
    if (typePref === '师范' && profile.type === '师范') bonus += 1.5;
    if (typePref === '农林' && profile.type === '农林') bonus += 1.5;
    cur.score += bonus;
    schoolScore.set(profile.id, cur);
  }

  const ranked = [...schoolScore.entries()]
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 8)
    .map(([slug, v]) => {
      const profile = schools.find((s) => s.id === slug)!;
      return { profile, majors: v.majors, score: v.score };
    });

  const majors = [
    ...new Set(
      dims.slice(0, 3).flatMap(([dim]) => DIM_MAJORS[dim] ?? []),
    ),
  ].slice(0, 12);

  return {
    dims: dims.slice(0, 3).map(([dim, score]) => ({ dim, score })),
    majors,
    schools: ranked,
  };
}
