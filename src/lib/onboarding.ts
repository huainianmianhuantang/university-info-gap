export type OnboardIdentity = 'gaokao' | 'junior' | 'parent';
export type OnboardLevel = 'newbie' | 'starter' | 'advanced' | 'expert';

export interface OnboardOption {
  label: string;
  score: number;
}

export interface OnboardQuestion {
  id: string;
  title: string;
  note?: string;
  options: OnboardOption[];
}

export interface OnboardGrade {
  id: string;
  label: string;
  emoji: string;
  age: string;
}

export interface OnboardRecommendation {
  emoji: string;
  title: string;
  desc: string;
  href: string;
}

export interface OnboardIdentityDef {
  id: OnboardIdentity;
  emoji: string;
  label: string;
  short: string;
  gradeQuestion: string;
  grades: OnboardGrade[];
  questions: OnboardQuestion[];
}

export const IDENTITIES: OnboardIdentityDef[] = [
  {
    id: 'gaokao',
    emoji: '🎓',
    label: '高三应届生',
    short: '高考冲刺中，就要填志愿了',
    gradeQuestion: '高三冲刺中，确认一下身份～',
    grades: [{ id: 'g3', label: '高三应届', emoji: '🎓', age: '约 18 岁' }],
    questions: [
      {
        id: 'good',
        title: '爸妈说「考个好大学」，你觉得最靠谱的「好大学」标准是？',
        note: '送分题，就看你信谁',
        options: [
          { label: '专业实力 + 学科评估 + 往年录取位次', score: 3 },
          { label: '名字里带「中国」「中央」', score: 1 },
          { label: '校徽好看、校区大', score: 0 },
          { label: '楼下王大爷说的准没错', score: 1 },
        ],
      },
      {
        id: 'tags',
        title: '985、211、双一流，在你眼里是？',
        note: '这三个词每年都要上新闻',
        options: [
          { label: '层层递进的重点大学标签，双一流是现在的说法', score: 3 },
          { label: '三个不同等级的「门派」，985 ＞ 211 ＞ 双一流', score: 2 },
          { label: '同一个东西的三种叫法', score: 1 },
          { label: '一种神秘的录取分数线', score: 0 },
        ],
      },
      {
        id: 'bigclass',
        title: '「大类招生」是什么？',
        note: '报志愿时经常出现的词',
        options: [
          { label: '大一先学大类基础，再按成绩和意愿分流到具体专业', score: 3 },
          { label: '招生人数很多，一收收一打', score: 1 },
          { label: '按身高体重分班', score: 0 },
          { label: '没听说过', score: 0 },
        ],
      },
      {
        id: 'transfer',
        title: '「转专业」一般什么时候有机会？',
        note: '选错专业时的后悔药',
        options: [
          { label: '大一结束前后，多数学校有考试或绩点门槛', score: 3 },
          { label: '随时想转就转', score: 1 },
          { label: '毕业答辩的时候', score: 0 },
          { label: '学校不让转', score: 0 },
        ],
      },
      {
        id: 'source',
        title: '想了解一所大学的真实情况，最靠谱的是？',
        note: '考验你的信息渠道',
        options: [
          { label: '官网招生章程 + 在校生真实反馈（比如本网站）', score: 3 },
          { label: '招生宣传片', score: 1 },
          { label: '短视频标题党', score: 0 },
          { label: '亲戚朋友「听说」', score: 1 },
        ],
      },
      {
        id: 'plans',
        title: '「强基计划」「拔尖班」「二次选拔」你熟悉吗？',
        note: '这些是进校后的隐藏入口',
        options: [
          { label: '都听过，知道大概意思', score: 3 },
          { label: '听过其中一两个', score: 2 },
          { label: '名字耳熟，内容不知', score: 1 },
          { label: '第一次听说，感觉像暗号', score: 0 },
        ],
      },
    ],
  },
  {
    id: 'junior',
    emoji: '📚',
    label: '高一高二及以下',
    short: '离高考还有几年，先囤情报',
    gradeQuestion: '你现在读到哪啦？',
    grades: [
      { id: 'j-m3', label: '初三及以下', emoji: '🧒', age: '约 15 岁及以下' },
      { id: 'j-h1', label: '高一', emoji: '📗', age: '约 16 岁' },
      { id: 'j-h2', label: '高二', emoji: '📘', age: '约 17 岁' },
    ],
    questions: [
      {
        id: 'tag985',
        title: '「985」在你印象里是？',
        note: '大胆说，没人笑你',
        options: [
          { label: '全国重点大学的一个圈子称呼', score: 3 },
          { label: '一种录取分数线', score: 1 },
          { label: '神秘的考试代号', score: 0 },
          { label: '爸妈口中「别人家孩子」的学校', score: 1 },
        ],
      },
      {
        id: 'info',
        title: '你现在了解大学，主要靠？',
        note: '诚实回答，方便我给你指路',
        options: [
          { label: '自己刷攻略、看视频、问学长学姐', score: 3 },
          { label: '听爸妈和老师讲', score: 2 },
          { label: '刷短视频刷到什么信什么', score: 1 },
          { label: '完全没想过这事', score: 0 },
        ],
      },
      {
        id: 'subject',
        title: '你知道高中选科会关系到将来能报什么专业吗？',
        note: '新高考的隐藏规则',
        options: [
          { label: '知道，选科直接影响专业选择', score: 3 },
          { label: '大概知道，但说不清', score: 2 },
          { label: '选科不是随便选的吗？', score: 0 },
          { label: '我是来看热闹的', score: 0 },
        ],
      },
      {
        id: 'interest',
        title: '如果有个网站把大学的宿舍、食堂、上课、转专业都摊开给你看，你会？',
        note: '比如你现在待的这个',
        options: [
          { label: '立刻收藏，慢慢研究', score: 3 },
          { label: '先看看热闹', score: 2 },
          { label: '等上了高三再看', score: 1 },
          { label: '你先证明你不是骗子', score: 0 },
        ],
      },
      {
        id: 'priority',
        title: '「专业」和「学校」如果只能先选一个，你觉得？',
        note: '经典送命题',
        options: [
          { label: '先想清楚兴趣方向，再选学校', score: 3 },
          { label: '学校名气优先，专业再说', score: 2 },
          { label: '我爸妈说了算', score: 1 },
          { label: '随便，考得上哪个是哪个', score: 0 },
        ],
      },
      {
        id: 'style',
        title: '你更喜欢用什么方式了解大学？',
        note: '这题没有对错，看口味',
        options: [
          { label: '学长学姐实拍视频', score: 3 },
          { label: '图文攻略和榜单', score: 2 },
          { label: '互动测评问卷', score: 2 },
          { label: '都行，有趣就行', score: 3 },
        ],
      },
    ],
  },
  {
    id: 'parent',
    emoji: '👨‍👩‍👧',
    label: '家长',
    short: '帮孩子把关，稳住别慌',
    gradeQuestion: '孩子现在读到哪啦？',
    grades: [
      { id: 'p-m3', label: '孩子初三及以下', emoji: '🧒', age: '先了解起来' },
      { id: 'p-h1', label: '孩子高一', emoji: '📗', age: '还来得及' },
      { id: 'p-h2', label: '孩子高二', emoji: '📘', age: '开始规划' },
      { id: 'p-h3', label: '孩子高三', emoji: '🎓', age: '冲刺阶段' },
    ],
    questions: [
      {
        id: 'channel',
        title: '您了解孩子心仪的大学，主要靠？',
        note: '信息渠道决定信息质量',
        options: [
          { label: '官网、招办、官方政策', score: 3 },
          { label: '亲戚朋友打听', score: 2 },
          { label: '电视广告、短视频', score: 1 },
          { label: '孩子说啥信啥', score: 1 },
        ],
      },
      {
        id: 'transfer',
        title: '「转专业」您了解吗？',
        note: '很多家长都是第一次听说',
        options: [
          { label: '了解，知道大致规则和重要性', score: 3 },
          { label: '知道有机会，但说不清流程', score: 2 },
          { label: '第一次听说', score: 0 },
          { label: '能上好大学就行，这些不重要', score: 1 },
        ],
      },
      {
        id: 'criteria',
        title: '选学校，您觉得最重要的是？',
        note: '会影响孩子好几年',
        options: [
          { label: '专业实力 + 就业 + 孩子兴趣', score: 3 },
          { label: '名气越大越好', score: 2 },
          { label: '离家近', score: 1 },
          { label: '分数线越高越好', score: 1 },
        ],
      },
      {
        id: 'depth',
        title: '「培养计划」「保研率」这类信息，您会关注吗？',
        note: '细节决定体验',
        options: [
          { label: '会，这些是很实在的参考', score: 3 },
          { label: '听说过，但不太会看', score: 2 },
          { label: '第一次听说', score: 0 },
          { label: '成绩好自然就有', score: 1 },
        ],
      },
      {
        id: 'worry',
        title: '您最担心孩子上大学遇到什么？',
        note: '说出来，我们一起想办法',
        options: [
          { label: '专业不喜欢，进去难转', score: 3 },
          { label: '宿舍伙食太差', score: 2 },
          { label: '离家远、不安全', score: 2 },
          { label: '还没想过，走一步看一步', score: 1 },
        ],
      },
      {
        id: 'help',
        title: '您更愿意用哪种方式帮孩子了解大学？',
        note: '选您觉得省心的',
        options: [
          { label: '陪孩子看实拍视频和资料', score: 3 },
          { label: '看政策解读文章', score: 2 },
          { label: '花钱找人咨询', score: 2 },
          { label: '孩子自己搞定就行', score: 0 },
        ],
      },
    ],
  },
];

export interface OnboardLevelMeta {
  emoji: string;
  title: string;
  line: string;
}

export const LEVEL_META: Record<OnboardLevel, OnboardLevelMeta> = {
  newbie: {
    emoji: '🐣',
    title: '萌新小白',
    line: '大学的水比想象中深——好在从零开始，最不容易被带偏。',
  },
  starter: {
    emoji: '🚶',
    title: '入门选手',
    line: '有点感觉了，但还容易被「名气」和「宣传片」带节奏。',
  },
  advanced: {
    emoji: '🧭',
    title: '进阶玩家',
    line: '懂的不少，可以开始研究政策细节和真实体验了。',
  },
  expert: {
    emoji: '🏎️',
    title: '志愿老司机',
    line: '你都能给别人当参谋了，接下来就是精挑细选。',
  },
};

export function scoreLevel(score: number): OnboardLevel {
  if (score <= 5) return 'newbie';
  if (score <= 10) return 'starter';
  if (score <= 14) return 'advanced';
  return 'expert';
}

const R: Record<OnboardIdentity, Record<OnboardLevel, OnboardRecommendation[]>> = {
  gaokao: {
    newbie: [
      { emoji: '🏫', title: '先逛逛大学库', desc: '39 所 985 的概况、校徽、视频一次看够', href: '/universities/' },
      { emoji: '📅', title: '读《高考时间轴》', desc: '从查分到志愿填报，每一步该干什么', href: '/articles/gaokao-timeline/' },
      { emoji: '🧩', title: '做个选校测评', desc: '12 道题，看看自己适合什么方向', href: '/quiz/' },
    ],
    starter: [
      { emoji: '🏫', title: '大学库逐个看', desc: '按省份、类型筛选，标记感兴趣的学校', href: '/universities/' },
      { emoji: '🎬', title: '看校园实拍视频', desc: '宿舍、上课、食堂，眼见为实', href: '/resources/' },
      { emoji: '⚖️', title: '用对比工具', desc: '把 2-3 所学校并排比一比', href: '/compare/' },
    ],
    advanced: [
      { emoji: '🔄', title: '研究转专业政策', desc: '哪些学校好转、哪些是坑，先看清', href: '/articles/transfer-policy-guide/' },
      { emoji: '📁', title: '翻翻资料库', desc: '培养方案、保研细则、新生指南', href: '/resources/' },
      { emoji: '⚖️', title: '精打细算对比', desc: '政策、数据、视频放一起比', href: '/compare/' },
    ],
    expert: [
      { emoji: '⚖️', title: '直接用对比工具', desc: '老司机就该快速横评', href: '/compare/' },
      { emoji: '🧩', title: '再测一次测评', desc: '用结果验证你的判断', href: '/quiz/' },
      { emoji: '✍️', title: '把你知道的分享出去', desc: '帮学弟学妹填坑，还能拿信息差优势', href: '/submit/' },
    ],
  },
  junior: {
    newbie: [
      { emoji: '🗺️', title: '看《985 城市地图》', desc: '先认识这些学校都分布在哪儿', href: '/articles/985-city-map/' },
      { emoji: '🏫', title: '大学库随便逛逛', desc: '当开眼界，看校徽和概况就好', href: '/universities/' },
      { emoji: '🎬', title: '看校园生活视频', desc: '提前感受大学长什么样', href: '/articles/college-life-video-guide/' },
    ],
    starter: [
      { emoji: '🏫', title: '大学库挑感兴趣的', desc: '标记几所喜欢的学校，先存着', href: '/universities/' },
      { emoji: '🎬', title: '刷校园实拍', desc: '宿舍和上课情况，越看越有数', href: '/resources/' },
      { emoji: '🧩', title: '测一测兴趣方向', desc: '早点知道自己适合什么', href: '/quiz/' },
    ],
    advanced: [
      { emoji: '🧩', title: '认真做选校测评', desc: '用结果反向选学校', href: '/quiz/' },
      { emoji: '🧭', title: '读兴趣测评指南', desc: '测评结果怎么用，一文看懂', href: '/articles/interest-quiz-helper/' },
      { emoji: '🔄', title: '提前看转专业科普', desc: '别等选错专业才后悔', href: '/articles/transfer-policy-overview/' },
    ],
    expert: [
      { emoji: '📁', title: '翻资料库宝藏', desc: '培养方案、竞赛、保研，越早看越香', href: '/resources/' },
      { emoji: '⚖️', title: '练习对比工具', desc: '提前学会怎么横向比较学校', href: '/compare/' },
      { emoji: '✍️', title: '收藏 + 投稿', desc: '看到好内容收藏，有情报就投稿', href: '/submit/' },
    ],
  },
  parent: {
    newbie: [
      { emoji: '🔄', title: '先读转专业速览', desc: '这是孩子最容易用到的「后悔药」', href: '/articles/transfer-policy-guide/' },
      { emoji: '🏫', title: '逛逛大学库', desc: '对学校有个整体概念，不慌', href: '/universities/' },
      { emoji: '📅', title: '看高考时间轴', desc: '帮孩子把关键节点记牢', href: '/articles/gaokao-timeline/' },
    ],
    starter: [
      { emoji: '🏫', title: '大学库筛选比对', desc: '按省份、类型帮孩子圈定范围', href: '/universities/' },
      { emoji: '📁', title: '翻资料库', desc: '培养方案、保研细则，眼见为实', href: '/resources/' },
      { emoji: '🎬', title: '陪孩子看实拍', desc: '宿舍上课什么样，一起看', href: '/resources/' },
    ],
    advanced: [
      { emoji: '⚖️', title: '用对比工具', desc: '几所学校摆一起，差异一目了然', href: '/compare/' },
      { emoji: '🎓', title: '读保研奖学金指南', desc: '深造和评优也是重要筹码', href: '/articles/postgrad-scholarship-guide/' },
      { emoji: '📁', title: '深挖资料库', desc: '政策原文都在里面', href: '/resources/' },
    ],
    expert: [
      { emoji: '⚖️', title: '快速横评学校', desc: '老练家长直接用对比工具', href: '/compare/' },
      { emoji: '✍️', title: '分享您的经验', desc: '帮更多家长少走弯路', href: '/submit/' },
      { emoji: '📁', title: '收藏关键资料', desc: '政策原文备好，填报时随手查', href: '/resources/' },
    ],
  },
};

export function recommendationsFor(
  identity: OnboardIdentity,
  level: OnboardLevel,
): OnboardRecommendation[] {
  return R[identity][level];
}
