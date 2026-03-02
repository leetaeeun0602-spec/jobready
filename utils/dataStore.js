const fs = require('fs');
const path = require('path');

// ===== Data Directory (env override for Railway volume) =====
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '..', 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backup');

// ===== All Data File Paths =====
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const ATTENDANCE_FILE = path.join(DATA_DIR, 'attendance.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const ROADMAPS_FILE = path.join(DATA_DIR, 'userRoadmaps.json');

// ===== Default Data Structures =====
const DEFAULTS = {
  users: { users: {} },
  posts: { posts: [], nextPostId: 1, nextCommentId: 1, sessions: {} },
  attendance: { users: {} },
  contacts: [],
  roadmaps: { users: {} }
};

// ===== Ensure directories exist =====
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`[DATA] 디렉토리 생성: ${dir}`);
  }
}
ensureDir(DATA_DIR);

// ===== Atomic JSON Write (temp file → rename) =====
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
        const fresh = JSON.parse(JSON.stringify(defaultValue));
        saveJson(filePath, fresh);
        return fresh;
      }
      const parsed = JSON.parse(raw);
      console.log(`[DATA] 로드 성공: ${path.basename(filePath)}`);
      return parsed;
    }
  } catch (e) {
    console.error(`[DATA ERROR] 파싱 실패 (${path.basename(filePath)}):`, e.message);
    console.log(`[DATA] 깨진 파일 → 초기값으로 리셋`);
    try { saveJson(filePath, defaultValue); } catch (_) {}
  }
  // File doesn't exist → create with defaults
  console.log(`[DATA] 새 파일 생성: ${path.basename(filePath)}`);
  const fresh = JSON.parse(JSON.stringify(defaultValue));
  saveJson(filePath, fresh);
  return fresh;
}

// ===== Load All Data from Files =====
const usersDb = loadJson(USERS_FILE, DEFAULTS.users);

const communityDb = loadJson(POSTS_FILE, DEFAULTS.posts);
// Ensure structure integrity
if (!Array.isArray(communityDb.posts)) communityDb.posts = [];
if (!communityDb.nextPostId) communityDb.nextPostId = 1;
if (!communityDb.nextCommentId) communityDb.nextCommentId = 1;
if (!communityDb.sessions) communityDb.sessions = {};

const contactsDb = loadJson(CONTACTS_FILE, DEFAULTS.contacts);

const roadmapsDb = loadJson(ROADMAPS_FILE, DEFAULTS.roadmaps);
if (!roadmapsDb.users) roadmapsDb.users = {};

// Attendance: restore Sets from serialized arrays
const attendanceRaw = loadJson(ATTENDANCE_FILE, DEFAULTS.attendance);
const attendanceDb = { users: {} };
for (const [sid, user] of Object.entries(attendanceRaw.users || {})) {
  attendanceDb.users[sid] = {
    nickname: user.nickname || '',
    certs: new Set(user.certs || []),
    checkins: user.checkins || {}
  };
}

// ===== Save Functions (즉시 파일 기록) =====
function saveUsers() {
  saveJson(USERS_FILE, usersDb);
}

function savePosts() {
  saveJson(POSTS_FILE, communityDb);
}

function saveAttendance() {
  // Set → Array 변환하여 직렬화
  const serializable = { users: {} };
  for (const [sid, user] of Object.entries(attendanceDb.users)) {
    serializable.users[sid] = {
      nickname: user.nickname,
      certs: [...(user.certs || [])],
      checkins: user.checkins || {}
    };
  }
  saveJson(ATTENDANCE_FILE, serializable);
}

function saveContacts() {
  saveJson(CONTACTS_FILE, contactsDb);
}

function saveRoadmaps() {
  saveJson(ROADMAPS_FILE, roadmapsDb);
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
    savePosts(); // 세션 매핑도 즉시 저장
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

  // Attendance Set → Array serialization
  const attSer = { users: {} };
  for (const [sid, user] of Object.entries(attendanceDb.users)) {
    attSer.users[sid] = {
      nickname: user.nickname,
      certs: [...(user.certs || [])],
      checkins: user.checkins || {}
    };
  }

  const files = [
    { name: 'users.json', data: usersDb },
    { name: 'posts.json', data: communityDb },
    { name: 'attendance.json', data: attSer },
    { name: 'contacts.json', data: contactsDb },
    { name: 'userRoadmaps.json', data: roadmapsDb }
  ];

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
  const totalLikes = communityDb.posts.reduce((s, p) => s + (p.likes || 0), 0);
  return {
    users: Object.keys(usersDb.users).length,
    posts: { total: totalPosts, free: freePosts, study: studyPosts },
    comments: totalComments,
    likes: totalLikes,
    attendance: Object.keys(attendanceDb.users).length,
    contacts: Array.isArray(contactsDb) ? contactsDb.length : 0,
    roadmaps: Object.keys(roadmapsDb.users).length,
    sessions: Object.keys(communityDb.sessions).length
  };
}

// ===== Startup Status =====
function printStartupStatus() {
  const stats = getStats();
  console.log(`  📊 데이터 현황:`);
  console.log(`     회원: ${stats.users}명 | 세션: ${stats.sessions}개`);
  console.log(`     게시글: ${stats.posts.total}개 (자유:${stats.posts.free} | 스터디:${stats.posts.study})`);
  console.log(`     댓글: ${stats.comments}개 | 좋아요: ${stats.likes}개`);
  console.log(`     출석: ${stats.attendance}명 | 문의: ${stats.contacts}건 | 로드맵: ${stats.roadmaps}명`);
  console.log(`  📂 데이터 경로: ${DATA_DIR}`);
}

// ===== File integrity check on startup =====
function verifyAllFiles() {
  const fileChecks = [
    { path: USERS_FILE, name: 'users.json' },
    { path: POSTS_FILE, name: 'posts.json' },
    { path: ATTENDANCE_FILE, name: 'attendance.json' },
    { path: CONTACTS_FILE, name: 'contacts.json' },
    { path: ROADMAPS_FILE, name: 'userRoadmaps.json' }
  ];
  let allOk = true;
  fileChecks.forEach(f => {
    if (!fs.existsSync(f.path)) {
      console.warn(`[VERIFY] 누락 파일 발견: ${f.name} → 이미 초기화됨`);
      allOk = false;
    }
  });
  if (allOk) {
    console.log(`  ✅ 전체 데이터 파일 무결성 확인 완료 (${fileChecks.length}개)`);
  }
}

// ===== Seed Sample Data (게시글 0개일 때만) =====
function seedSampleData() {
  if (communityDb.posts.length > 0) return;
  console.log('[SEED] 게시글 0개 → 샘플 데이터 자동 추가');

  const now = Date.now();
  function daysAgo(d) { return new Date(now - d * 86400000).toISOString(); }

  const SAMPLE_POSTS = [
    // ===== 자유게시판 (8개) =====
    { board:'free', nickname:'취준생A', title:'컴활1급 독학 3주만에 합격했습니다!',
      content:'유튜브 강의랑 기출문제 반복으로 준비했어요. 실기가 관건인데 매일 2시간씩 엑셀 연습하니까 되더라고요. 혹시 궁금한 거 있으면 댓글 남겨주세요!',
      likes:3, likedBy:['u1','u2','u3'], createdAt:daysAgo(1),
      comments:[
        { nickname:'워드마스터', content:'저도 도전중인데 실기 팁 더 알려주세요!', createdAt:daysAgo(1) },
        { nickname:'사무직희망', content:'축하드려요! 저도 다음달 시험인데 자신감 생기네요', createdAt:daysAgo(0) }
      ]},
    { board:'free', nickname:'IT취준러', title:'정보처리기사 필기 벼락치기 후기',
      content:'시험 2주 전에 시작했는데 기출문제 위주로 풀었더니 72점으로 간신히 합격... 실기는 제대로 준비해야겠어요. 다들 화이팅!',
      likes:5, likedBy:['u1','u2','u3','u4','u5'], createdAt:daysAgo(2), comments:[] },
    { board:'free', nickname:'전기쟁이', title:'전기기사 실기 불합격... 다시 도전합니다',
      content:'이번에 58점으로 떨어졌어요ㅠㅠ 계산 실수가 치명적이었네요. 다음 회차에는 꼭 붙겠습니다. 같이 준비하시는 분 계시면 응원해주세요',
      likes:7, likedBy:['u1','u2','u3','u4','u5','u6','u7'], createdAt:daysAgo(3),
      comments:[
        { nickname:'안전제일', content:'저도 한번 떨어지고 두번째에 붙었어요! 포기하지 마세요!', createdAt:daysAgo(2) },
        { nickname:'전기지망생', content:'계산문제 연습량이 중요하대요 화이팅!', createdAt:daysAgo(2) }
      ]},
    { board:'free', nickname:'데이터러', title:'SQLD랑 ADsP 어떤 거 먼저 따야하나요?',
      content:'데이터 분석 쪽으로 취업 준비중인데 두 자격증 순서가 고민됩니다. 선배님들 조언 부탁드려요!',
      likes:4, likedBy:['u1','u2','u3','u4'], createdAt:daysAgo(4),
      comments:[
        { nickname:'분석가K', content:'ADsP 먼저 추천! 범위가 좁아서 입문용으로 좋아요', createdAt:daysAgo(3) },
        { nickname:'SQL마스터', content:'SQLD가 실무에서 더 많이 쓰여서 저는 SQLD 먼저 땄어요', createdAt:daysAgo(3) },
        { nickname:'빅데이터준비', content:'둘 다 한달이면 가능해서 동시에 준비하는 것도 방법!', createdAt:daysAgo(2) }
      ]},
    { board:'free', nickname:'회계지망', title:'전산회계 1급 vs 재경관리사 난이도 비교',
      content:'회계 쪽 취업 준비중인데 전산회계1급 따고 재경관리사 도전하려고요. 재경관리사 난이도가 어느 정도인지 궁금합니다',
      likes:2, likedBy:['u1','u2'], createdAt:daysAgo(5), comments:[] },
    { board:'free', nickname:'공시생탈출', title:'공무원 준비 접고 자격증 루트로 전환합니다',
      content:'3년 공시 준비하다가 접고 IT 자격증 쪽으로 방향 틀었어요. 정보처리기사 + SQLD 조합으로 가려고 합니다. 비슷한 경험 있으신 분?',
      likes:9, likedBy:['u1','u2','u3','u4','u5','u6','u7','u8','u9'], createdAt:daysAgo(6),
      comments:[
        { nickname:'탈공선배', content:'저도 같은 루트 탔는데 지금 데이터분석가로 잘 다니고 있어요!', createdAt:daysAgo(5) }
      ]},
    { board:'free', nickname:'수원취준생', title:'경기도 자격증 응시료 지원 받으신 분?',
      content:'경기도 거주인데 자격증 응시료 지원금 받으신 분 계신가요? 신청 방법이 어떻게 되는지 궁금합니다',
      likes:3, likedBy:['u1','u2','u3'], createdAt:daysAgo(7),
      comments:[
        { nickname:'지원금헌터', content:'각 시청 홈페이지에서 신청 가능해요! 안양시는 연 30만원까지 됩니다', createdAt:daysAgo(6) }
      ]},
    { board:'free', nickname:'늦깎이취준', title:'30대 중반 취준 시작... 늦은 걸까요?',
      content:'회사 다니다 퇴사하고 새로운 분야로 취업 준비 시작했어요. 나이가 걸리는데 자격증으로 커버 가능할까요?',
      likes:12, likedBy:['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10','u11','u12'], createdAt:daysAgo(8),
      comments:[
        { nickname:'서른다섯합격', content:'저 36살에 전기기사 따고 취업했어요. 절대 안늦었습니다!', createdAt:daysAgo(7) },
        { nickname:'인사담당자', content:'실무에서는 자격증+경험이 나이보다 중요해요. 자신감 가지세요!', createdAt:daysAgo(7) }
      ]},

    // ===== 합격수기 (5개) =====
    { board:'free', nickname:'합격자1호', title:'[합격수기] 정보처리기사 실기 합격! 3개월 준비 후기',
      content:'비전공자인데 3개월 풀타임으로 준비해서 합격했어요. 필기는 기출 500문제 반복, 실기는 손코딩 연습이 핵심이었습니다. 수제비 교재 강추하고 유튜브 무료강의도 많이 활용했어요.',
      certTag:'정보처리기사', likes:15, likedBy:['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10','u11','u12','u13','u14','u15'], createdAt:daysAgo(2), comments:[] },
    { board:'free', nickname:'전기합격맨', title:'[합격수기] 전기기사 필기+실기 한번에 합격 후기',
      content:'전기공학 전공이라 필기는 수월했는데 실기 계산문제가 어려웠어요. 과년도 기출 10년치 3회독하니까 패턴이 보이더라고요. KEC 개정내용 꼭 체크하세요!',
      certTag:'전기기사', likes:11, likedBy:['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10','u11'], createdAt:daysAgo(4),
      comments:[
        { nickname:'전기도전', content:'KEC 어디서 정리된 자료 볼 수 있나요?', createdAt:daysAgo(3) }
      ]},
    { board:'free', nickname:'안전맨', title:'[합격수기] 산업안전기사 합격! 현장 경력 없이도 가능해요',
      content:'사무직인데 안전관리 쪽으로 이직하려고 준비했어요. 필기는 안전관리론 위주로, 실기는 서술형 키워드 암기가 핵심! 3개월이면 충분합니다.',
      certTag:'산업안전기사', likes:8, likedBy:['u1','u2','u3','u4','u5','u6','u7','u8'], createdAt:daysAgo(5), comments:[] },
    { board:'free', nickname:'회계퀸', title:'[합격수기] 전산회계1급 2주 벼락치기 합격',
      content:'회계 전공이라 기초는 있었는데 실무 프로그램(KcLep)을 처음 써봐서 걱정했어요. 유튜브에서 실습 영상 따라하면서 매일 3시간씩 연습하니까 합격! 비전공자도 한달이면 가능할 거예요.',
      certTag:'전산회계1급', likes:6, likedBy:['u1','u2','u3','u4','u5','u6'], createdAt:daysAgo(7), comments:[] },
    { board:'free', nickname:'토익마스터', title:'[합격수기] TOEIC 550→880 두달만에 올린 방법',
      content:'LC는 쉐도잉 매일 30분, RC는 파트5 문법 정리 + 파트7 지문 속독 연습했어요. 단어장은 해커스 보카 하루 50개씩. 시간 부족하면 파트5,6에서 점수 올리는 게 가장 효율적!',
      certTag:'TOEIC', likes:10, likedBy:['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10'], createdAt:daysAgo(3), comments:[] },

    // ===== 시험꿀팁 (5개) =====
    { board:'free', nickname:'꿀팁장인', title:'[꿀팁] CBT 상시시험 꿀팁 모음 (컴활/워드/ITQ)',
      content:'1.시험장 컴퓨터 환경이 다르니까 일찍 가서 적응하세요 2.엑셀 버전 확인 필수(2016/2019 다름) 3.실기는 저장 꼭꼭 자주 하세요 4.시간 부족하면 배점 높은 문제 먼저 5.계산기능 매크로 순서 헷갈리면 기출 패턴 외우세요',
      likes:8, likedBy:['u1','u2','u3','u4','u5','u6','u7','u8'], createdAt:daysAgo(1), comments:[] },
    { board:'free', nickname:'기출의신', title:'[꿀팁] 국가기술자격 기출문제 무료 사이트 정리',
      content:'1.큐넷 공개문제(공식) 2.CBT 체험(대한상의) 3.기출문제닷컴 4.에듀윌 무료 기출 5.유튜브 해설강의. 기출 3회독이면 필기는 거의 합격권이에요. 오답노트 필수!',
      likes:14, likedBy:['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10','u11','u12','u13','u14'], createdAt:daysAgo(3),
      comments:[
        { nickname:'기출러', content:'기출문제닷컴 진짜 좋아요 추천!', createdAt:daysAgo(2) }
      ]},
    { board:'free', nickname:'시간관리왕', title:'[꿀팁] 직장 다니면서 자격증 공부하는 법',
      content:'출퇴근 시간에 이론 강의 듣기, 점심시간 30분 기출풀기, 퇴근 후 1시간 실기연습. 이렇게 하면 하루 2시간은 확보돼요. 주말에 모의고사 풀면 3개월이면 기사급 합격 가능!',
      likes:11, likedBy:['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10','u11'], createdAt:daysAgo(5), comments:[] },
    { board:'free', nickname:'응시료절약', title:'[꿀팁] 청년 응시료 50% 할인 받는 법 (만34세 이하)',
      content:'Q-net에서 원서 접수할 때 청년할인 체크하면 끝! 기사 필기 19,400원→9,700원으로 줄어요. 연 3회까지 가능하고 별도 신청 없이 접수시 자동적용. 모르는 사람 진짜 많더라고요',
      likes:16, likedBy:['u1','u2','u3','u4','u5','u6','u7','u8','u9','u10','u11','u12','u13','u14','u15','u16'], createdAt:daysAgo(6),
      comments:[
        { nickname:'절약왕', content:'이거 진짜 꿀팁... 저 모르고 3번이나 정가 냈어요ㅠ', createdAt:daysAgo(5) },
        { nickname:'알뜰취준', content:'지자체 응시료 지원이랑 중복도 가능한 경우 있어요!', createdAt:daysAgo(5) }
      ]},
    { board:'free', nickname:'필기만점러', title:'[꿀팁] 객관식 시험 찍기의 기술 (최후의 수단)',
      content:'1.모르는 문제는 3번이 통계적으로 정답 비율 높음 2.보기 중 \'모두/항상/절대\'가 들어간건 오답 확률 높음 3.가장 긴 보기가 정답인 경우 많음 4.직전에 본 정답 번호와 같은건 피하기. 물론 공부가 최고입니다ㅋㅋ',
      likes:7, likedBy:['u1','u2','u3','u4','u5','u6','u7'], createdAt:daysAgo(8), comments:[] },

    // ===== 스터디모집 (4개) =====
    { board:'study', nickname:'스터디장모집', title:'정보처리기사 실기 스터디 모집 (서울 강남)',
      content:'4월 실기 시험 대비 스터디 모집합니다. 주 2회 토/일 오후 2시 강남역 스터디카페. 현재 2명이고 3~4명 더 모집해요. 비전공자 환영!',
      method:'오프라인', region:'서울', regionCity:'강남구', certTag:'정보처리기사',
      maxMembers:5, joinedMembers:[{sessionId:'seed1',nickname:'스터디장모집'},{sessionId:'seed2',nickname:'코딩러'}],
      likes:3, likedBy:['u1','u2','u3'], createdAt:daysAgo(2), comments:[] },
    { board:'study', nickname:'온라인스터디', title:'SQLD 온라인 스터디 (디스코드)',
      content:'디스코드로 매주 화/목 밤 9시에 모여서 기출문제 풀고 토론해요. 현재 4명이고 2명 더 모집! SQL 기초는 알고 계셔야 합니다.',
      method:'온라인', certTag:'SQLD',
      maxMembers:6, joinedMembers:[{sessionId:'seed3',nickname:'온라인스터디'},{sessionId:'seed4',nickname:'DB러버'},{sessionId:'seed5',nickname:'쿼리왕'},{sessionId:'seed6',nickname:'데이터맨'}],
      likes:5, likedBy:['u1','u2','u3','u4','u5'], createdAt:daysAgo(4), comments:[] },
    { board:'study', nickname:'전기스터디', title:'전기기사 필기 같이 준비하실 분 (수원)',
      content:'수원역 근처에서 주말마다 모여서 공부하는 스터디입니다. 서로 모르는 거 질문하고 기출 같이 풀어요. 현재 3명!',
      method:'오프라인', region:'경기', regionCity:'수원시', certTag:'전기기사',
      maxMembers:5, joinedMembers:[{sessionId:'seed7',nickname:'전기스터디'},{sessionId:'seed8',nickname:'볼트맨'},{sessionId:'seed9',nickname:'전기도전'}],
      likes:4, likedBy:['u1','u2','u3','u4'], createdAt:daysAgo(5), comments:[] },
    { board:'study', nickname:'회계스터디', title:'전산회계1급 + 재경관리사 연속 스터디',
      content:'전산회계1급 먼저 따고 바로 재경관리사 도전하는 3개월 플랜 스터디! 온라인으로 주 3회 줌미팅. 회계 비전공자도 환영합니다.',
      method:'온라인', certTag:'전산회계1급',
      maxMembers:4, joinedMembers:[{sessionId:'seed10',nickname:'회계스터디'}],
      likes:2, likedBy:['u1','u2'], createdAt:daysAgo(7), comments:[] }
  ];

  let commentId = 1;
  SAMPLE_POSTS.forEach((p, i) => {
    const post = {
      id: i + 1,
      board: p.board,
      nickname: p.nickname,
      sessionId: 'seed_' + (i + 1),
      title: p.title,
      content: p.content,
      company: p.company || '',
      position: p.position || '',
      certTag: p.certTag || '',
      likes: p.likes || 0,
      likedBy: p.likedBy || [],
      comments: (p.comments || []).map(c => ({
        id: commentId++,
        nickname: c.nickname,
        content: c.content,
        createdAt: c.createdAt
      })),
      createdAt: p.createdAt,
      maxMembers: p.maxMembers || 0,
      method: p.method || '',
      region: p.region || '',
      regionCity: p.regionCity || '',
      joinedMembers: p.joinedMembers || []
    };
    communityDb.posts.push(post);
  });

  communityDb.nextPostId = SAMPLE_POSTS.length + 1;
  communityDb.nextCommentId = commentId;
  savePosts();
  console.log(`[SEED] 샘플 데이터 추가 완료: 게시글 ${SAMPLE_POSTS.length}개`);
}

module.exports = {
  // Data objects
  usersDb,
  communityDb,
  attendanceDb,
  contactsDb,
  roadmapsDb,
  // Save functions
  saveUsers,
  savePosts,
  saveAttendance,
  saveContacts,
  saveRoadmaps,
  // Helpers
  generateNickname,
  getNickname,
  serverTodayStr,
  calcStreak,
  // Admin
  createBackup,
  getStats,
  printStartupStatus,
  verifyAllFiles,
  seedSampleData,
  // Constants
  DATA_DIR
};
