export interface SocialChannel {
  platform: 'official' | 'bilibili' | 'xhs' | 'douyin' | 'weibo';
  label: string;
  emoji: string;
  url: string;
  note: string;
}

/**
 * 各平台信息渠道入口。
 * 官网用官方域名；其他平台用「站内搜索」入口（避免编造账号 ID），
 * 后续拿到各校官方账号 ID 后可替换为直达链接。
 */
export function channelsFor(
  name: string,
  officialUrl?: string,
): SocialChannel[] {
  const enc = encodeURIComponent(name);
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
  list.push(
    {
      platform: 'bilibili',
      label: 'B站',
      emoji: '📺',
      url: `https://search.bilibili.com/all?keyword=${enc}`,
      note: '官方账号与在校生实拍',
    },
    {
      platform: 'xhs',
      label: '小红书',
      emoji: '📕',
      url: `https://www.xiaohongshu.com/search_result?keyword=${enc}`,
      note: '校园生活笔记与攻略',
    },
    {
      platform: 'douyin',
      label: '抖音',
      emoji: '🎵',
      url: `https://www.douyin.com/search/${enc}`,
      note: '官方号与短视频实拍',
    },
    {
      platform: 'weibo',
      label: '微博',
      emoji: '🌐',
      url: `https://s.weibo.com/weibo?q=${enc}`,
      note: '学校官微动态',
    },
  );
  return list;
}
