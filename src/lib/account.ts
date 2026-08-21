export interface UserProfile {
  uid: string;
  nickname: string;
  phone?: string;
  qq?: string;
  wechat?: string;
  createdAt: number;
  lastLogin: number;
}

interface StoredAccount {
  profile: UserProfile;
  pass?: { salt: string; hash: string };
}

const KEY = 'account-v1';
const EVENT = 'account:change';

function read(): StoredAccount | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredAccount) : null;
  } catch {
    return null;
  }
}

function write(acc: StoredAccount) {
  try {
    localStorage.setItem(KEY, JSON.stringify(acc));
  } catch {
    /* ignore */
  }
}

function uid() {
  return 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function derivePbkdf2(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode(salt),
      iterations: 100_000,
      hash: 'SHA-256',
    },
    key,
    256,
  );
  return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function salt() {
  return Math.random().toString(36).slice(2, 12);
}

export function notifyChange() {
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function isLoggedIn(): boolean {
  return read() !== null;
}

export function getProfile(): UserProfile | null {
  return read()?.profile ?? null;
}

/** 按账号隔离的存储键：登录后数据跟随账号，未登录则用公共键 */
export function scopedKey(base: string): string {
  const p = getProfile();
  return p ? `${base}-${p.uid}` : base;
}

export function maskPhone(p: string): string {
  return p.length >= 7 ? p.slice(0, 3) + '****' + p.slice(-4) : p;
}

/** 开发模式：生成演示验证码（真实短信需接入服务商） */
export function devCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function register(
  phone: string,
  code: string,
  expectedCode: string,
  nickname: string,
  password?: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!/^1\d{10}$/.test(phone)) return { ok: false, error: '手机号格式不对哦，11 位数字' };
  if (code !== expectedCode) return { ok: false, error: '验证码不对，再看看～' };
  if (!nickname.trim()) return { ok: false, error: '给自己起个昵称吧' };
  if (read()) return { ok: false, error: '当前已登录，请先退出再注册新账号' };

  const profile: UserProfile = {
    uid: uid(),
    nickname: nickname.trim().slice(0, 20),
    phone,
    createdAt: Date.now(),
    lastLogin: Date.now(),
  };
  const acc: StoredAccount = { profile };
  if (password && password.length >= 6) {
    const s = salt();
    acc.pass = { salt: s, hash: await derivePbkdf2(password, s) };
  }
  write(acc);
  notifyChange();
  return { ok: true };
}

export async function loginWithPassword(
  identifier: string,
  password: string,
): Promise<{ ok: boolean; error?: string }> {
  const locked = checkLocked(identifier);
  if (locked) return { ok: false, error: '尝试太多次啦，请 1 分钟后再试' };
  const acc = read();
  if (!acc?.pass) return { ok: false, error: '该账号未设置密码，请用手机验证码登录' };
  if (acc.profile.phone !== identifier && acc.profile.nickname !== identifier) {
    return { ok: false, error: '账号不存在' };
  }
  const hash = await derivePbkdf2(password, acc.pass.salt);
  if (hash !== acc.pass.hash) {
    recordFail(identifier);
    return { ok: false, error: '密码不对，再想想～' };
  }
  clearFails(identifier);
  acc.profile.lastLogin = Date.now();
  write(acc);
  notifyChange();
  return { ok: true };
}

export function loginWithCode(phone: string, code: string, expectedCode: string) {
  const acc = read();
  if (!acc || acc.profile.phone !== phone) return { ok: false, error: '该手机号还没有注册哦' };
  if (code !== expectedCode) return { ok: false, error: '验证码不对，再看看～' };
  clearFails(phone);
  acc.profile.lastLogin = Date.now();
  write(acc);
  notifyChange();
  return { ok: true };
}

export function logout() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  notifyChange();
}

export async function setPassword(newPassword: string): Promise<{ ok: boolean; error?: string }> {
  const acc = read();
  if (!acc) return { ok: false, error: '请先登录' };
  if (newPassword.length < 6) return { ok: false, error: '密码至少 6 位哦' };
  const s = salt();
  acc.pass = { salt: s, hash: await derivePbkdf2(newPassword, s) };
  write(acc);
  notifyChange();
  return { ok: true };
}

export function clearAccountData() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  notifyChange();
}

const FAIL_KEY = 'account-fail';

function readFails(): Record<string, { n: number; t: number }> {
  try {
    return JSON.parse(localStorage.getItem(FAIL_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeFails(f: Record<string, { n: number; t: number }>) {
  try {
    localStorage.setItem(FAIL_KEY, JSON.stringify(f));
  } catch {
    /* ignore */
  }
}

function checkLocked(id: string): boolean {
  const f = readFails()[id];
  return !!f && f.n >= 5 && Date.now() - f.t < 60_000;
}

function recordFail(id: string) {
  const f = readFails();
  const cur = f[id];
  f[id] = { n: (cur?.n ?? 0) + 1, t: Date.now() };
  writeFails(f);
}

function clearFails(id: string) {
  const f = readFails();
  if (f[id]) {
    delete f[id];
    writeFails(f);
  }
}

/** 第三方绑定占位：真实接入需 OAuth AppID（QQ 互联 / 微信开放平台） */
export function bindThirdParty(type: 'qq' | 'wechat', openId: string) {
  const acc = read();
  if (!acc) return { ok: false, error: '请先登录' };
  if (type === 'qq') acc.profile.qq = openId;
  else acc.profile.wechat = openId;
  write(acc);
  notifyChange();
  return { ok: true };
}

export function unbindThirdParty(type: 'qq' | 'wechat') {
  const acc = read();
  if (!acc) return;
  if (type === 'qq') delete acc.profile.qq;
  else delete acc.profile.wechat;
  write(acc);
  notifyChange();
}

/** 修改昵称 */
export function setNickname(name: string) {
  const acc = read();
  if (!acc) return;
  acc.profile.nickname = name.trim().slice(0, 20);
  write(acc);
  notifyChange();
}
