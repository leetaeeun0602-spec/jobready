const fs = require('fs');
const path = require('path');

// ===== Data Directory (env override) =====
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backup');

// File paths
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const ATTENDANCE_FILE = path.join(DATA_DIR, 'attendance.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

// ===== Default Data Structures =====
const DEFAULTS = {
  users: { users: {} },
  posts: { posts: [], nextPostId: 1, nextCommentId: 1, sessions: {} },
  attendance: { users: {} },
  contacts: []
};

// ===== Ensure directories exist =====
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`[DATA] 디렉토리 생성: ${dir}`);
  }
}
ensureDir(DATA_DIR);

// ===== Atomic JSON Write (temp + rename) =====
function saveJson(filePath, data) {
  try {
    const json = JSON.stringify(data, null, 2);
    const tempFile = filePath + '.tmp';
    fs.writeFileSync(tempFile, json, 'utf-8');
    fs.renameSync(tempFile, filePath);
  } catch (e) {
    console.error(`[DATA ERROR] 저장 실패 (${path.basename(filePath)}):`, e.message);
    // Fallback: direct write
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e2) {
      console.error(`[DATA ERROR] 폴백 저장도 실패:`, e2.message);
    }
  }
}

// ===== Safe JSON Load with integrity check =====
function loadJson(filePath, defaultValue) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      if (!raw || !raw.trim()) {
        console.warn(`[DATA] 빈 파일 감지, 초기값 사용: ${path.basename(filePath)}`);
        return JSON.parse(JSON.stringify(defaultValue));
      }
      const parsed = JSON.parse(raw);
      console.log(`[DATA] 로드 성공: ${path.basename(filePath)}`);
      return parsed;
    }
  } catch (e) {
    console.error(`[DATA ERROR] 파싱 실패 (${path.basename(filePath)}):`, e.message);
    console.log(`[DATA] 깨진 파일 → 초기값으로 리셋`);
    // Save fresh default to fix corrupted file
    try {
      saveJson(filePath, defaultValue);
    } catch (e2) { /* ignore */ }
  }
  // File doesn't exist: create with defaults
  console.log(`[DATA] 새 파일 생성: ${path.basename(filePath)}`);
  const fresh = JSON.parse(JSON.stringify(defaultValue));
  saveJson(filePath, fresh);
  return fresh;
}

// ===== Load All Data =====
const usersDb = loadJson(USERS_FILE, DEFAULTS.users);
const communityDb = loadJson(POSTS_FILE, DEFAULTS.posts);
const contactsDb = loadJson(CONTACTS_FILE, DEFAULTS.contacts);

// Attendance: restore Sets from arrays
const attendanceRaw = loadJson(ATTENDANCE_FILE, DEFAULTS.attendance);
const attendanceDb = { users: {} };
for (const [sid, user] of Object.entries(attendanceRaw.users || {})) {
  attendanceDb.users[sid] = {
    nickname: user.nickname || '',
    certs: new Set(user.certs || []),
    checkins: user.checkins || {}
  };
}

// ===== Save Functions =====
function saveUsers() {
  saveJson(USERS_FILE, usersDb);
  console.log(`[SAVE] users: ${Object.keys(usersDb.users).length}명`);
}

function savePosts() {
  saveJson(POSTS_FILE, communityDb);
  console.log(`[SAVE] posts: ${communityDb.posts.length}개, nextId: ${communityDb.nextPostId}`);
}

function saveAttendance() {
  const serializable = { users: {} };
  for (const [sid, user] of Object.entries(attendanceDb.users)) {
    serializable.users[sid] = {
      nickname: user.nickname,
      certs: [...(user.certs || [])],
      checkins: user.checkins || {}
    };
  }
  saveJson(ATTENDANCE_FILE, serializable);
  console.log(`[SAVE] attendance: ${Object.keys(attendanceDb.users).length}명`);
}

function saveContacts() {
  saveJson(CONTACTS_FILE, contactsDb);
  console.log(`[SAVE] contacts: ${contactsDb.length}건`);
}

// ===== Helper Functions =====
function generateNickname() {
  const num = String(Math.floor(1000 + Math.random() * 9000));
  return `취준생#${num}`;
}

function getNickname(sessionId) {
  if (!sessionId) return generateNickname();
  if (!communityDb.sessions[sessionId]) {
    communityDb.sessions[sessionId] = generateNickname();
    savePosts();
  }
  return communityDb.sessions[sessionId];
}

function serverTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function calcStreak(checkins) {
  const allDates = new Set();
  Object.values(checkins || {}).forEach(dates => dates.forEach(d => allDates.add(d)));
  if (allDates.size === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  let check = new Date(today);

  for (let i = 0; i < 365; i++) {
    const ds = `${check.getFullYear()}-${String(check.getMonth() + 1).padStart(2, '0')}-${String(check.getDate()).padStart(2, '0')}`;
    if (allDates.has(ds)) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// ===== Backup System =====
function createBackup() {
  ensureDir(BACKUP_DIR);
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, ts);
  ensureDir(backupPath);

  const files = [
    { name: 'users.json', data: usersDb },
    { name: 'posts.json', data: communityDb },
    { name: 'contacts.json', data: contactsDb }
  ];

  // Attendance needs serialization
  const attSer = { users: {} };
  for (const [sid, user] of Object.entries(attendanceDb.users)) {
    attSer.users[sid] = {
      nickname: user.nickname,
      certs: [...(user.certs || [])],
      checkins: user.checkins || {}
    };
  }
  files.push({ name: 'attendance.json', data: attSer });

  files.forEach(f => {
    fs.writeFileSync(path.join(backupPath, f.name), JSON.stringify(f.data, null, 2), 'utf-8');
  });

  console.log(`[BACKUP] 백업 완료: ${backupPath}`);
  return backupPath;
}

// ===== Stats =====
function getStats() {
  const totalPosts = communityDb.posts.length;
  const freePosts = communityDb.posts.filter(p => p.board === 'free').length;
  const studyPosts = communityDb.posts.filter(p => p.board === 'study').length;
  const totalComments = communityDb.posts.reduce((s, p) => s + (p.comments || []).length, 0);
  return {
    users: Object.keys(usersDb.users).length,
    posts: { total: totalPosts, free: freePosts, study: studyPosts },
    comments: totalComments,
    attendance: Object.keys(attendanceDb.users).length,
    contacts: contactsDb.length,
    sessions: Object.keys(communityDb.sessions).length
  };
}

// ===== Print startup status =====
function printStartupStatus() {
  const stats = getStats();
  console.log(`  📊 데이터 현황:`);
  console.log(`     회원: ${stats.users}명 | 게시글: ${stats.posts.total}개 (자유:${stats.posts.free}, 스터디:${stats.posts.study})`);
  console.log(`     댓글: ${stats.comments}개 | 출석: ${stats.attendance}명 | 문의: ${stats.contacts}건`);
  console.log(`     데이터 경로: ${DATA_DIR}`);
}

module.exports = {
  usersDb,
  communityDb,
  attendanceDb,
  contactsDb,
  saveUsers,
  savePosts,
  saveAttendance,
  saveContacts,
  generateNickname,
  getNickname,
  serverTodayStr,
  calcStreak,
  createBackup,
  getStats,
  printStartupStatus,
  DATA_DIR,
  CONTACTS_FILE
};
