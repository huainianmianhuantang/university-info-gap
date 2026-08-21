export interface SocialChannel {
  platform: 'official' | 'bilibili' | 'xhs' | 'douyin' | 'weibo';
  label: string;
  emoji: string;
  url: string;
  note: string;
  followers?: string;
}

type ChannelPlatform = SocialChannel['platform'];

interface VerifiedAccount {
  url?: string;
  followers?: string;
}

/**
 * 已核实账号：按粉丝量选取各校影响力最大的官方账号。
 * 数据来自公开报道，粉丝数均为「约」值并标注截至时间；URL 为可核实的直达链接。
 */
const VERIFIED: Record<string, Partial<Record<ChannelPlatform, VerifiedAccount>>> = {
  'peking-university': {
    xhs: { followers: '粉丝约 154.8 万（2025-09）' },
    douyin: { followers: '粉丝 1000 万+（2026-05）' },
  },
  'tsinghua-university': {
    xhs: { followers: '粉丝约 143.1 万（2025-09）' },
    douyin: { followers: '粉丝约 862 万（2025-04）' },
    weibo: { url: 'https://weibo.com/u/1676317545', followers: '粉丝约 560 万（2026-08）' },
  },
  fudan: {
    xhs: { followers: '粉丝约 30.8 万（2025-09）' },
    douyin: { followers: '粉丝百万级（2025-04）' },
  },
  'zhejiang-university': {
    xhs: { followers: '粉丝约 18 万（2025-09）' },
    douyin: { followers: '粉丝百万级（2025-04）' },
  },
  sjtu: {
    douyin: { followers: '粉丝 100 万+（2021-11）' },
    weibo: { followers: '粉丝 100 万+（2021）' },
  },
  'wuhan-university': {
    douyin: { followers: '粉丝约 120 万（2021-04）' },
  },
  scu: {
    douyin: { followers: '粉丝 48 万+（2023-09）' },
  },
  ustc: {
    weibo: { followers: '粉丝约 82 万（新浪数据）' },
  },
  bnu: {
    douyin: { followers: '粉丝约 85 万（2021-09）' },
    weibo: { followers: '粉丝约 130 万（2021-09）' },
  },
  hit: {
    xhs: { followers: '粉丝约 32.4 万（2025-09）' },
  },
  nudt: {
    douyin: { followers: '粉丝百万级（2025-04）' },
  },
};

/**
 * 各平台信息渠道入口。
 * 官网用官方域名；其他平台用「站内搜索」入口（避免编造账号 ID），
 * 已核实的官方账号替换为直达链接并标注粉丝量（按粉丝量选取最大账号）。
 */
export function channelsFor(
  name: string,
  officialUrl?: string,
  slug = '',
): SocialChannel[] {
  const enc = encodeURIComponent(name);
  const verified = VERIFIED[slug] ?? {};
  const list: SocialChannel[] = [];
  if (officialUrl) {
    list.push({
      platform: 'official',
      label: '官网',
      emoji: '🏛️',
      url: officialUrl,
      note: '招生章程 · 官方通知',
    });
  }
  const defaults: Record<Exclude<ChannelPlatform, 'official'>, { label: string; emoji: string; url: string; note: string }> = {
    bilibili: {
      label: 'B站',
      emoji: '📺',
      url: `https://search.bilibili.com/all?keyword=${enc}`,
      note: '官方账号与在校生实拍',
    },
    xhs: {
      label: '小红书',
      emoji: '📕',
      url: `https://www.xiaohongshu.com/search_result?keyword=${enc}`,
      note: '校园生活笔记与攻略',
    },
    douyin: {
      label: '抖音',
      emoji: '🎵',
      url: `https://www.douyin.com/search/${enc}`,
      note: '官方号与短视频实拍',
    },
    weibo: {
      label: '微博',
      emoji: '🌐',
      url: `https://s.weibo.com/weibo?q=${enc}`,
      note: '学校官微动态',
    },
  };
  (Object.keys(defaults) as Exclude<ChannelPlatform, 'official'>[]).forEach((p) => {
    const d = defaults[p];
    const v = verified[p];
    list.push({
      platform: p,
      label: d.label,
      emoji: d.emoji,
      url: v?.url ?? d.url,
      note: v?.url || v?.followers ? '官方账号' : d.note,
      followers: v?.followers,
    });
  });
  return list;
}
