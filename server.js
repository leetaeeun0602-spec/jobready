const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// ===== Data Persistence =====
const DATA_DIR = path.join(__dirname, 'data');
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

// ===== Auth API =====
app.post('/api/auth/register', (req, res) => {
  const { name, phone, birthDate } = req.body;
  if (!name || !phone || !birthDate) {
    return res.status(400).json({ error: '모든 필드를 입력해주세요' });
  }
  const phoneTrimmed = phone.trim();
  if (!/^010-\d{4}-\d{4}$/.test(phoneTrimmed)) {
    return res.status(400).json({ error: '전화번호 형식이 올바르지 않습니다 (010-XXXX-XXXX)' });
  }
  if (usersDb.users[phoneTrimmed]) {
    return res.status(409).json({ error: '이미 가입된 전화번호입니다' });
  }
  const user = {
    name: name.trim(),
    phone: phoneTrimmed,
    birthDate: birthDate.trim(),
    createdAt: new Date().toISOString()
  };
  usersDb.users[phoneTrimmed] = user;
  saveUsers();
  res.json({ success: true, user: { name: user.name, phone: user.phone, createdAt: user.createdAt } });
});

app.post('/api/auth/login', (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: '이름과 전화번호를 입력해주세요' });
  }
  const phoneTrimmed = phone.trim();
  const user = usersDb.users[phoneTrimmed];
  if (!user || user.name !== name.trim()) {
    return res.status(401).json({ error: '이름 또는 전화번호가 일치하지 않습니다' });
  }
  res.json({ success: true, user: { name: user.name, phone: user.phone, createdAt: user.createdAt } });
});

// ===== Posts API =====

app.get('/api/posts', (req, res) => {
  const { board, certTag, region } = req.query;
  let posts = communityDb.posts;
  if (board) posts = posts.filter(p => p.board === board);
  if (certTag) posts = posts.filter(p => p.certTag === certTag);
  if (region) {
    posts = posts.filter(p => {
      const full = p.regionCity ? `${p.region} ${p.regionCity}` : p.region;
      return full === region || p.region === region;
    });
  }

  const result = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(p => ({
      id: p.id, board: p.board, nickname: p.nickname,
      title: p.title,
      content: p.content.length > 200 ? p.content.substring(0, 200) + '...' : p.content,
      company: p.company, position: p.position, certTag: p.certTag,
      likes: p.likes, commentCount: p.comments.length, createdAt: p.createdAt,
      maxMembers: p.maxMembers || 0,
      currentMembers: (p.joinedMembers || []).length,
      method: p.method || '', region: p.region || '', regionCity: p.regionCity || ''
    }));
  res.json(result);
});

app.get('/api/posts/:id', (req, res) => {
  const post = communityDb.posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다' });
  res.json({
    ...post,
    currentMembers: (post.joinedMembers || []).length,
    likedBy: post.likedBy
  });
});

app.post('/api/posts', (req, res) => {
  const { board, title, content, company, position, certTag, sessionId,
          maxMembers, method, region, regionCity } = req.body;
  if (!board || !title || !content) {
    return res.status(400).json({ error: '필수 정보가 누락되었습니다' });
  }

  const nickname = getNickname(sessionId);
  const post = {
    id: communityDb.nextPostId++,
    board, nickname, sessionId: sessionId || '',
    title: title.trim(), content: content.trim(),
    company: (company || '').trim(), position: (position || '').trim(),
    certTag: (certTag || '').trim(),
    likes: 0, likedBy: [], comments: [],
    createdAt: new Date().toISOString(),
    maxMembers: parseInt(maxMembers) || 0,
    method: method || '', region: region || '', regionCity: regionCity || '',
    joinedMembers: board === 'study' ? [{ sessionId, nickname }] : []
  };
  communityDb.posts.push(post);
  savePosts();
  res.json({ id: post.id, nickname: post.nickname });
});

app.post('/api/posts/:id/like', (req, res) => {
  const post = communityDb.posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다' });
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId가 필요합니다' });

  if (post.likedBy.includes(sessionId)) {
    post.likedBy = post.likedBy.filter(id => id !== sessionId);
    post.likes = Math.max(0, post.likes - 1);
  } else {
    post.likedBy.push(sessionId);
    post.likes++;
  }
  savePosts();
  res.json({ likes: post.likes, liked: post.likedBy.includes(sessionId) });
});

app.post('/api/posts/:id/comments', (req, res) => {
  const post = communityDb.posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다' });
  const { content, sessionId } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: '댓글 내용을 입력해주세요' });
  }
  const nickname = getNickname(sessionId);
  const comment = {
    id: communityDb.nextCommentId++, nickname,
    content: content.trim(), createdAt: new Date().toISOString()
  };
  post.comments.push(comment);
  savePosts();
  res.json(comment);
});

// ===== Study Join API =====
app.post('/api/posts/:id/join', (req, res) => {
  const post = communityDb.posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다' });
  if (post.board !== 'study') return res.status(400).json({ error: '스터디 모집 게시글이 아닙니다' });
  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId가 필요합니다' });

  if (!post.joinedMembers) post.joinedMembers = [];
  const already = post.joinedMembers.some(m => m.sessionId === sessionId);
  if (already) {
    post.joinedMembers = post.joinedMembers.filter(m => m.sessionId !== sessionId);
    savePosts();
    return res.json({ joined: false, currentMembers: post.joinedMembers.length });
  }
  if (post.maxMembers && post.joinedMembers.length >= post.maxMembers) {
    return res.status(400).json({ error: '모집 인원이 가득 찼습니다' });
  }
  const nickname = getNickname(sessionId);
  post.joinedMembers.push({ sessionId, nickname });
  savePosts();
  res.json({ joined: true, currentMembers: post.joinedMembers.length });
});

// ===== Attendance API =====
app.post('/api/attendance/checkin', (req, res) => {
  const { sessionId, certName, date } = req.body;
  if (!sessionId || !certName || !date) {
    return res.status(400).json({ error: '필수 정보가 누락되었습니다' });
  }
  const nickname = getNickname(sessionId);
  if (!attendanceDb.users[sessionId]) {
    attendanceDb.users[sessionId] = { nickname, certs: new Set(), checkins: {} };
  }
  const user = attendanceDb.users[sessionId];
  user.nickname = nickname;
  user.certs.add(certName);
  if (!user.checkins[certName]) user.checkins[certName] = [];
  if (!user.checkins[certName].includes(date)) {
    user.checkins[certName].push(date);
  }
  saveAttendance();
  res.json({ success: true });
});

app.get('/api/attendance/rankings', (req, res) => {
  const today = serverTodayStr();
  const rankings = Object.entries(attendanceDb.users).map(([sid, user]) => {
    const allDates = new Set();
    Object.values(user.checkins).forEach(dates => dates.forEach(d => allDates.add(d)));
    return {
      sessionId: sid, nickname: user.nickname,
      certs: [...user.certs], totalDays: allDates.size,
      streak: calcStreak(user.checkins), isActiveToday: allDates.has(today)
    };
  });
  rankings.sort((a, b) => b.totalDays !== a.totalDays ? b.totalDays - a.totalDays : b.streak - a.streak);
  res.json(rankings.slice(0, 20));
});

app.listen(PORT, () => {
  console.log(`==========================================`);
  console.log(`  🚀 JobReady 서버 실행 중`);
  console.log(`  📍 http://localhost:${PORT}`);
  console.log(`==========================================`);
});
