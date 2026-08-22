export type Dim = '理' | '工' | '医' | '农' | '文' | '经' | '艺';

export interface QuizOption {
  label: string;
  score?: Partial<Record<Dim, number>>;
  cities?: string[];
  typePref?: '综合' | '理工' | '师范' | '农林' | '其他';
  /** 家长视角偏好：由家长类题目携带，驱动家长视角的学校评分 */
  parent?: {
    postgrad?: number; // 深造/保研偏好
    job?: number; // 就业声望偏好
    transfer?: number; // 转专业自由度偏好
    fame?: number; // 学校名气偏好
    majorOverFame?: number; // 专业实力优先
    cost?: 'low' | 'high'; // 成本敏感度
    strict?: number; // 学风管理（正=严格，负=宽松）
    ratio?: 'male' | 'female';
    cityTier?: 'top' | 'new';
    dims?: Partial<Record<Dim, number>>; // 专业方向偏好
  };
}

export interface QuizQuestion {
  id: string;
  title: string;
  subtitle?: string;
  audience?: 'student' | 'parent';
  options: QuizOption[];
}

export type QuizTypeId = 'student-light' | 'student-full' | 'parent-light' | 'parent-full';

export interface QuizType {
  id: QuizTypeId;
  label: string;
  desc: string;
  icon: string;
  audience: 'student' | 'parent';
  duration: string;
  questionIds: string[];
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
  // ============ 学生问卷题（含原有 12 题） ============
  {
    id: 'interest',
    audience: 'student',
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
    audience: 'student',
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
    audience: 'student',
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
    audience: 'student',
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
    audience: 'student',
    title: '你能接受临床、实验或下田实习这类实践吗？',
    options: [
      { label: '非常愿意，喜欢接触真实场景', score: { 医: 2, 农: 2, 工: 1 } },
      { label: '可以接受，不排斥', score: { 医: 1, 农: 1 } },
      { label: '不太想，更喜欢案头或创意工作', score: { 文: 1, 经: 1, 艺: 1 } },
    ],
  },
  {
    id: 'city',
    audience: 'student',
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
    audience: 'student',
    title: '住宿与生活条件，你最在意什么？',
    options: [
      { label: '独立卫浴、空调、新宿舍' },
      { label: '食堂好吃、生活便利' },
      { label: '校园环境优美、氛围好' },
      { label: '条件一般也能接受' },
    ],
  },
  {
    id: 'schoolType',
    audience: 'student',
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
    audience: 'student',
    title: '对学费和生活成本的敏感度？',
    options: [
      { label: '比较敏感，想控制开销' },
      { label: '一般，正常水平即可' },
      { label: '不敏感，优先学校实力' },
    ],
  },
  {
    id: 'transfer',
    audience: 'student',
    title: '关于转专业和二次选拔，你的想法是？',
    options: [
      { label: '想先冲名校，入学后转专业' },
      { label: '想进拔尖班 / 实验班' },
      { label: '希望一步到位读想读的专业' },
      { label: '没想好，先了解一下' },
    ],
  },
  {
    id: 'distance',
    audience: 'student',
    title: '你能接受离家多远？',
    options: [
      { label: '越远越好，独立生活' },
      { label: '省内或邻近省份最好' },
      { label: '无所谓，看学校' },
    ],
  },
  {
    id: 'personality',
    audience: 'student',
    title: '你的性格更接近？',
    options: [
      { label: '坐得住、喜欢钻研', score: { 理: 2, 医: 1 } },
      { label: '动手能力强、闲不住', score: { 工: 2 } },
      { label: '爱表达、善沟通、有领导力', score: { 经: 2, 文: 1 } },
      { label: '安静独立、有创意', score: { 文: 1, 艺: 1, 理: 1 } },
    ],
  },
  // ============ 学生全面新增 4 题 ============
  {
    id: 'dormPref',
    audience: 'student',
    title: '宿舍条件你优先要什么？',
    subtitle: '仅用于结果里的生活偏好提示',
    options: [
      { label: '独立卫浴 + 空调' },
      { label: '上床下桌、空间大' },
      { label: '新校区 / 新宿舍优先' },
      { label: '不太在意，能住就行' },
    ],
  },
  {
    id: 'canteen',
    audience: 'student',
    title: '对食堂和周边生活，你的期待是？',
    subtitle: '仅用于结果里的生活偏好提示',
    options: [
      { label: '食堂好吃很重要' },
      { label: '周边商业便利优先' },
      { label: '健康清淡、选择多' },
      { label: '无所谓，能吃饱就行' },
    ],
  },
  {
    id: 'social',
    audience: 'student',
    title: '你期待怎样的大学生活氛围？',
    options: [
      { label: '社团活动丰富、爱交朋友', score: { 文: 1, 经: 1 } },
      { label: '安静专注、适合自习研究', score: { 理: 1 } },
      { label: '运动健身、户外活动多', score: { 工: 1 } },
      { label: '氛围轻松，怎么舒服怎么来', score: { 文: 1, 艺: 1 } },
    ],
  },
  {
    id: 'workload',
    audience: 'student',
    title: '你能接受的课业强度？',
    options: [
      { label: '越卷越好，挑战高难度', score: { 理: 1, 工: 1 } },
      { label: '正常强度，认真学即可', score: {} },
      { label: '希望相对轻松，留时间给自己', score: { 文: 1, 艺: 1 } },
    ],
  },
  // ============ 家长问卷题（12 题） ============
  {
    id: 'pJob',
    audience: 'parent',
    title: '您更希望孩子未来的就业方向是？',
    options: [
      { label: '稳定就业（考公 / 国企 / 事业单位）', parent: { job: 1 } },
      { label: '高薪行业（互联网 / 金融 / 大厂）', parent: { job: 1, cost: 'high' } },
      { label: '继续深造，先读研再说', parent: { postgrad: 1 } },
      { label: '顺其自然，尊重孩子兴趣', parent: {} },
    ],
  },
  {
    id: 'pPostgrad',
    audience: 'parent',
    title: '对保研和读研，您的态度是？',
    options: [
      { label: '希望去保研率高的学校', parent: { postgrad: 1 } },
      { label: '本科毕业直接就业就好', parent: { job: 1 } },
      { label: '希望有出国深造的平台', parent: { postgrad: 1, fame: 1 } },
      { label: '还没想好，先了解', parent: {} },
    ],
  },
  {
    id: 'pCost',
    audience: 'parent',
    title: '对学费和整体开销的敏感度？',
    options: [
      { label: '比较敏感，想控制开销', parent: { cost: 'low' } },
      { label: '正常水平即可', parent: {} },
      { label: '不敏感，优先学校实力', parent: { cost: 'high' } },
    ],
  },
  {
    id: 'pCity',
    audience: 'parent',
    title: '希望孩子在哪个区域读书？',
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
    id: 'pTransfer',
    audience: 'parent',
    title: '您是否关注学校的转专业政策？',
    options: [
      { label: '关注，希望转专业政策宽松', parent: { transfer: 1 } },
      { label: '希望孩子一步到位读心仪专业', parent: {} },
      { label: '不了解，想看看各校政策', parent: {} },
    ],
  },
  {
    id: 'pTier',
    audience: 'parent',
    title: '学校名气和实力，您更看重？',
    options: [
      { label: '名气越大越好（面子 / 社会认可）', parent: { fame: 1 } },
      { label: '专业实力优先，不唯名校', parent: { majorOverFame: 1 } },
      { label: '差不多就行，适合孩子最重要', parent: {} },
    ],
  },
  {
    id: 'pFurtherStudy',
    audience: 'parent',
    title: '您是否看重学校的深造率与科研平台？',
    options: [
      { label: '看重，希望深造氛围浓', parent: { postgrad: 1 } },
      { label: '一般，正常即可', parent: {} },
      { label: '更看重本科就业', parent: { job: 1 } },
    ],
  },
  {
    id: 'pDiscipline',
    audience: 'parent',
    title: '您希望学校的学风管理是怎样的？',
    options: [
      { label: '严格管理、抓得紧', parent: { strict: 1 } },
      { label: '宽松自由、靠自觉', parent: { strict: -1 } },
      { label: '没特别要求', parent: {} },
    ],
  },
  {
    id: 'pCampus',
    audience: 'parent',
    title: '对学校所在城市级别，您的要求是？',
    options: [
      { label: '一线城市（京沪）最好', parent: { cityTier: 'top' } },
      { label: '新一线 / 省会即可', parent: { cityTier: 'new' } },
      { label: '无所谓，看学校本身', parent: {} },
    ],
  },
  {
    id: 'pLivingCost',
    audience: 'parent',
    title: '对城市生活成本（吃住行）的顾虑？',
    options: [
      { label: '顾虑较大，希望成本低', parent: { cost: 'low' } },
      { label: '正常水平可以接受', parent: {} },
      { label: '没顾虑，一线更好', parent: { cost: 'high' } },
    ],
  },
  {
    id: 'pRatio',
    audience: 'parent',
    title: '对学校的男女比例有偏好吗？',
    options: [
      { label: '无所谓，不关心', parent: {} },
      { label: '希望理工氛围浓（男生多）', parent: { ratio: 'male' } },
      { label: '希望综合 / 师范氛围（女生多）', parent: { ratio: 'female' } },
    ],
  },
  {
    id: 'pMajorStrength',
    audience: 'parent',
    title: '如果按专业方向选，您倾向哪一类？',
    subtitle: '用于专业实力优先时的匹配',
    options: [
      { label: '理科基础（数学 / 物理 / 化学）', parent: { majorOverFame: 1, dims: { 理: 2 } } },
      { label: '工科（计算机 / 电子 / 机械等）', parent: { majorOverFame: 1, dims: { 工: 2 } } },
      { label: '医学 / 生命健康', parent: { majorOverFame: 1, dims: { 医: 2 } } },
      { label: '经管法商', parent: { majorOverFame: 1, dims: { 经: 2 } } },
      { label: '人文社科（文史哲 / 教育）', parent: { majorOverFame: 1, dims: { 文: 2 } } },
      { label: '农学 / 生命自然', parent: { majorOverFame: 1, dims: { 农: 2 } } },
      { label: '艺术 / 设计 / 传媒', parent: { majorOverFame: 1, dims: { 艺: 2 } } },
      { label: '不确定，先看学校', parent: {} },
    ],
  },
];

export const QUESTION_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));

export const QUIZ_TYPES: QuizType[] = [
  {
    id: 'student-light',
    label: '学生轻量问卷',
    desc: '6 题 · 约 1 分钟，快速测兴趣方向与生活偏好',
    icon: '🎒',
    audience: 'student',
    duration: '约 1 分钟',
    questionIds: ['interest', 'strength', 'studyStyle', 'career', 'city', 'life'],
  },
  {
    id: 'student-full',
    label: '学生全面问卷',
    desc: '16 题 · 约 3 分钟，覆盖兴趣、学习方式、生活与性格',
    icon: '🧭',
    audience: 'student',
    duration: '约 3 分钟',
    questionIds: [
      'interest', 'strength', 'studyStyle', 'career', 'lab', 'city', 'life',
      'dormPref', 'canteen', 'social', 'workload', 'schoolType', 'cost',
      'transfer', 'distance', 'personality',
    ],
  },
  {
    id: 'parent-light',
    label: '家长轻量问卷',
    desc: '6 题 · 约 1 分钟，快速了解就业、保研、成本与城市偏好',
    icon: '👨‍👩‍👧',
    audience: 'parent',
    duration: '约 1 分钟',
    questionIds: ['pJob', 'pPostgrad', 'pCost', 'pCity', 'pTransfer', 'pTier'],
  },
  {
    id: 'parent-full',
    label: '家长全面问卷',
    desc: '12 题 · 约 2 分钟，深入评估深造、学风、成本与专业方向',
    icon: '🏛️',
    audience: 'parent',
    duration: '约 2 分钟',
    questionIds: [
      'pJob', 'pPostgrad', 'pCost', 'pCity', 'pTransfer', 'pTier',
      'pFurtherStudy', 'pDiscipline', 'pCampus', 'pLivingCost', 'pRatio', 'pMajorStrength',
    ],
  },
];

export function questionsOf(typeId: QuizTypeId): QuizQuestion[] {
  const t = QUIZ_TYPES.find((x) => x.id === typeId);
  if (!t) return [];
  return t.questionIds
    .map((id) => QUESTION_BY_ID.get(id))
    .filter((q): q is QuizQuestion => Boolean(q));
}

export interface SchoolProfile {
  id: string;
  name: string;
  type: string;
  province: string;
  city: string;
  tags: string[];
  levels: string[];
  materialCategories?: string[];
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
 * 粗略分层数据（按往年理科一批大致位次估算）。
 * 仅作为学校画像特征使用，不再向用户展示冲/稳/保分档。
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

export type QuizAnswer = Record<string, number>;

export interface PerspectiveSchool {
  profile: SchoolProfile;
  majors: string[];
  score: number;
}

export interface PerspectiveResult {
  top3: PerspectiveSchool[];
  more: PerspectiveSchool[];
}

export interface RecommendResult {
  dims: { dim: Dim; score: number }[];
  majors: string[];
  student: PerspectiveResult;
  parent: PerspectiveResult;
  order: ['student', 'parent'] | ['parent', 'student'];
}

const CHEAP_PROVINCES = ['辽宁', '吉林', '黑龙江', '甘肃', '陕西', '重庆', '湖南'];
const EXPENSIVE_PROVINCES = ['北京', '上海', '广东'];
const TOP_CITY_PROVINCES = ['北京', '上海'];
const NEW_CITY_PROVINCES = ['浙江', '江苏', '湖北', '四川', '陕西', '天津', '广东'];

function tierValue(slug: string): number {
  const t = SCHOOL_TIERS[slug]?.tier;
  return t === 'top' ? 2 : t === 'mid' ? 1 : 0;
}

interface ParentPrefs {
  postgrad: number;
  job: number;
  transfer: number;
  fame: number;
  majorOverFame: number;
  cost: 'low' | 'high' | null;
  strict: number;
  ratio: 'male' | 'female' | null;
  cityTier: 'top' | 'new' | null;
  dims: Partial<Record<Dim, number>>;
}

function emptyPrefs(): ParentPrefs {
  return {
    postgrad: 0,
    job: 0,
    transfer: 0,
    fame: 0,
    majorOverFame: 0,
    cost: null,
    strict: 0,
    ratio: null,
    cityTier: null,
    dims: {},
  };
}

export function recommend(
  answers: Record<string, number>,
  schools: SchoolProfile[],
  quizTypeId?: string,
): RecommendResult {
  const dimScore: Record<Dim, number> = { 理: 0, 工: 0, 医: 0, 农: 0, 文: 0, 经: 0, 艺: 0 };
  const cities: string[] = [];
  let typePref = '其他';
  const prefs = emptyPrefs();

  for (const [qid, optIdx] of Object.entries(answers)) {
    const q = QUESTION_BY_ID.get(qid);
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
    const p = opt.parent;
    if (p) {
      prefs.postgrad += p.postgrad ?? 0;
      prefs.job += p.job ?? 0;
      prefs.transfer += p.transfer ?? 0;
      prefs.fame += p.fame ?? 0;
      prefs.majorOverFame += p.majorOverFame ?? 0;
      prefs.strict += p.strict ?? 0;
      if (p.cost) prefs.cost = p.cost;
      if (p.ratio) prefs.ratio = p.ratio;
      if (p.cityTier) prefs.cityTier = p.cityTier;
      if (p.dims) {
        for (const [dim, v] of Object.entries(p.dims)) {
          prefs.dims[dim as Dim] = (prefs.dims[dim as Dim] ?? 0) + (v ?? 0);
        }
      }
    }
  }

  const dims = (Object.entries(dimScore) as [Dim, number][])
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  const cityMatch = (profile: SchoolProfile) =>
    cities.length > 0 &&
    (cities.includes(profile.province) ||
      cities.some((c) => profile.city.includes(c) || c.includes(profile.city)));

  const typeMatch = (profile: SchoolProfile) =>
    typePref !== '其他' && profile.type === typePref;

  const dimSchoolSlugs = (dim: Dim) => new Set((DIM_SCHOOLS[dim] ?? []).map((s) => s.slug));

  const studentRank: PerspectiveSchool[] = schools
    .map((profile) => {
      let score = 0;
      const majors: string[] = [];
      const tags = new Set(profile.tags ?? []);
      dims.slice(0, 3).forEach(([dim], idx) => {
        const weight = [4, 2, 1][idx] ?? 0;
        const hit = DIM_SCHOOLS[dim]?.find((s) => s.slug === profile.id);
        if (hit) {
          score += weight;
          majors.push(...hit.majors);
        }
      });
      if (cityMatch(profile)) score += 2;
      if (typeMatch(profile)) score += 1.5;
      const wantsDorm =
        answers.dormPref === 0 || answers.dormPref === 1 || answers.life === 0;
      if (wantsDorm && tags.has('宿舍条件好')) score += 1.5;
      if (dims.length === 0) {
        // 无兴趣维度作答（如家长问卷）时，以实力 + 城市兜底排序
        score += tierValue(profile.id) * 1.5;
      }
      return { profile, majors: [...new Set(majors)], score };
    })
    .sort((a, b) => b.score - a.score || tierValue(b.profile.id) - tierValue(a.profile.id))
    .filter((s) => s.score > 0);

  const parentRank: PerspectiveSchool[] = schools
    .map((profile) => {
      let score = 0;
      const majors: string[] = [];
      const cats = new Set(profile.materialCategories ?? []);
      const tags = new Set(profile.tags ?? []);
      const hasPostgrad = cats.has('postgrad-rec');
      const hasTransfer = cats.has('transfer-policy');
      const tier = tierValue(profile.id);
      const inCheap = CHEAP_PROVINCES.includes(profile.province);
      const inExpensive = EXPENSIVE_PROVINCES.includes(profile.province);

      score += prefs.postgrad * (hasPostgrad ? 2 : 0);
      score += prefs.postgrad * (tier >= 1 ? 1 : 0);
      score += prefs.postgrad * (tags.has('保研率高') ? 1.5 : 0);
      score += prefs.job * (tier * 1.2 + (profile.type === '理工' || profile.type === '综合' ? 0.8 : 0));
      score += prefs.job * (tags.has('计算机强校') || tags.has('金融强校') || tags.has('军工对口') ? 1 : 0);
      score += prefs.transfer * (hasTransfer ? 2 : 0);
      score += prefs.transfer * (tags.has('转专业宽松') ? 1.5 : 0);
      score += prefs.fame * tier;
      if (prefs.majorOverFame > 0) {
        const topDims = (Object.entries(prefs.dims) as [Dim, number][])
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2)
          .map(([d]) => d);
        const matched = topDims.some((d) => dimSchoolSlugs(d).has(profile.id));
        score += prefs.majorOverFame * (matched ? 2 : 0.5);
        if (matched) {
          for (const d of topDims) {
            const hit = DIM_SCHOOLS[d]?.find((s) => s.slug === profile.id);
            if (hit) majors.push(...hit.majors);
          }
        }
      }
      if (prefs.cost === 'low') score += inCheap ? 2 : 0;
      if (prefs.cost === 'low') score += tags.has('生活成本低') ? 1.5 : 0;
      if (prefs.cost === 'high') score += inExpensive ? 1 : 0;
      score += prefs.strict * ((profile.type === '理工' ? 1.5 : 0.5) + (tier >= 1 ? 0.5 : 0));
      if (prefs.ratio === 'male') score += profile.type === '理工' ? 2 : profile.type === '综合' ? 1 : 0;
      if (prefs.ratio === 'female') score += profile.type === '师范' || profile.type === '综合' ? 1.5 : 0;
      if (prefs.cityTier === 'top') score += TOP_CITY_PROVINCES.includes(profile.province) ? 1.5 : 0;
      if (prefs.cityTier === 'new') score += NEW_CITY_PROVINCES.includes(profile.province) ? 1 : 0;
      if (cityMatch(profile)) score += 2;
      if (typeMatch(profile)) score += 1.5;

      const noPrefs =
        prefs.postgrad + prefs.job + prefs.transfer + prefs.fame + prefs.majorOverFame +
        prefs.strict + (prefs.cost ? 1 : 0) + (prefs.ratio ? 1 : 0) + (prefs.cityTier ? 1 : 0) === 0;
      if (noPrefs) {
        // 未答家长题（如学生问卷场景）：默认家长更看重实力、深造平台与城市
        score += tier * 1.5 + (hasPostgrad ? 1 : 0) + (cityMatch(profile) ? 1 : 0);
      }
      return { profile, majors: [...new Set(majors)], score };
    })
    .sort((a, b) => b.score - a.score || tierValue(b.profile.id) - tierValue(a.profile.id))
    .filter((s) => s.score > 0);

  const split = (ranked: PerspectiveSchool[]): PerspectiveResult => ({
    top3: ranked.slice(0, 3),
    more: ranked.slice(3),
  });

  const order: RecommendResult['order'] =
    quizTypeId?.startsWith('parent') ? ['parent', 'student'] : ['student', 'parent'];

  const majors = [
    ...new Set(dims.slice(0, 3).flatMap(([dim]) => DIM_MAJORS[dim] ?? [])),
  ].slice(0, 12);

  return {
    dims: dims.slice(0, 3).map(([dim, score]) => ({ dim, score })),
    majors,
    student: split(studentRank),
    parent: split(parentRank),
    order,
  };
}
