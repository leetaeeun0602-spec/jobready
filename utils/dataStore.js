const fs = require('fs');
const path = require('path');

// ===== Data Persistence =====
const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const ATTENDANCE_FILE = path.join(DATA_DIR, 'attendance.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadJson(filePath, defaultValue) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (e) {
    console.error(`데이터 로드 실패 (${filePath}):`, e.message);
  }
  return defaultValue;
}

function saveJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error(`데이터 저장 실패 (${filePath}):`, e.message);
  }
}

// ===== Load Data from Files =====
const usersDb = loadJson(USERS_FILE, { users: {} });

const communityDb = loadJson(POSTS_FILE, {
  posts: [],
  nextPostId: 1,
  nextCommentId: 1,
  sessions: {}
});

const attendanceRaw = loadJson(ATTENDANCE_FILE, { users: {} });
const attendanceDb = { users: {} };
// 배열로 저장된 certs를 Set으로 복원
for (const [sid, user] of Object.entries(attendanceRaw.users)) {
  attendanceDb.users[sid] = {
    nickname: user.nickname,
    certs: new Set(user.certs),
    checkins: user.checkins
  };
}

// ===== Save Functions =====
function saveUsers() { saveJson(USERS_FILE, usersDb); }
function savePosts() { saveJson(POSTS_FILE, communityDb); }
function saveAttendance() {
  // Set을 배열로 변환하여 저장
  const serializable = { users: {} };
  for (const [sid, user] of Object.entries(attendanceDb.users)) {
    serializable.users[sid] = {
      nickname: user.nickname,
      certs: [...user.certs],
      checkins: user.checkins
    };
  }
  saveJson(ATTENDANCE_FILE, serializable);
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
  Object.values(checkins).forEach(dates => dates.forEach(d => allDates.add(d)));
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

module.exports = {
  usersDb,
  communityDb,
  attendanceDb,
  saveUsers,
  savePosts,
  saveAttendance,
  generateNickname,
  getNickname,
  serverTodayStr,
  calcStreak
};
