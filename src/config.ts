/**
 * 站点全局配置：改这里即可更新全站名称、联系方式等。
 */
export const SITE = {
  title: '大学信息差',
  description:
    '收集 985 高校的转专业政策、二次选拔、培养计划、寝室上课实况与学习资料，帮助高考生和家长看清每所大学的真实情况。',
  url: import.meta.env.PUBLIC_SITE_URL ?? 'http://localhost:4321',
};

/**
 * 投稿联系方式：把 email / wechat 换成你自己的真实联系方式。
 */
export const CONTACT = {
  email: 'your-email@example.com',
  wechat: 'your-wechat-id',
  submitNotice:
    '投稿内容需注明来源；资料类请确保你有权分享；我们审核通过后才会发布。',
};

/** 全站栏目定义（未来扩充栏目时在这里加） */
export const SECTIONS = [
  { id: 'transfer', label: '转专业政策', description: '申请条件、考核方式、转出转入限制与名额' },
  { id: 'secondary', label: '二次选拔', description: '实验班、基地班、拔尖计划等入校后选拔' },
  { id: 'training', label: '培养计划', description: '学分要求、课程结构、大类招生与专业分流' },
  { id: 'dorm', label: '寝室情况', description: '几人间、独卫空调、费用与真实体验' },
  { id: 'classes', label: '上课情况', description: '大班小班、考勤方式、课程压力与日常' },
  { id: 'materials', label: '学习资料', description: '网盘资料、内部笔记、复习资料' },
  { id: 'videos', label: '视频', description: '校园实拍、政策解读与在校生分享' },
] as const;

/** 未来可扩充的学校层次（当前只收录 985） */
export const LEVELS = ['985', '211', '双一流', '普通'] as const;

/**
 * 资料库类别：所有学校的资料都归入这些类别，
 * 新学校只需往对应类别中添加条目即可。
 */
export const RESOURCE_CATEGORIES = [
  { id: 'training-plan', label: '培养方案', description: '各学院本科生专业培养方案与专业简介' },
  { id: 'postgrad-rec', label: '保研政策', description: '推荐免试攻读研究生实施细则与通知' },
  { id: 'scholarship', label: '奖学金与评优', description: '综合素质评价与奖学金评定办法' },
  { id: 'courses', label: '选课与教学', description: '课程分级办法、选课手册、选修课榜单与教材' },
  { id: 'freshman', label: '新生指南', description: '新生入学指南与入学教育材料' },
  { id: 'campus-life', label: '校园生活', description: '宿舍、食堂与本地生活攻略' },
  { id: 'competition', label: '竞赛', description: '学科竞赛分类与参赛指南' },
] as const;

export type ResourceCategoryId = (typeof RESOURCE_CATEGORIES)[number]['id'];
