// =============================================
//  JobReady - 리뉴얼 v2 (main.js)
// =============================================

// ===== 섹터 데이터 =====
const SECTORS = [
  {
    name: '사무기본역량', icon: '🧾', color: '#2563eb',
    certs: ['컴활1급', '컴활2급', 'MOS Excel Expert', '워드프로세서', 'ITQ', '한국사능력검정']
  },
  {
    name: 'IT·데이터·디지털', icon: '💻', color: '#7c3aed',
    certs: ['정보처리기사', 'SQLD', 'ADsP', '빅데이터분석기사', 'AWS Cloud Practitioner', '네트워크관리사', '리눅스마스터']
  },
  {
    name: '기술·안전·기사', icon: '🏗', color: '#059669',
    certs: ['산업안전기사', '전기기사', '전기산업기사', '기계기사', '소방설비기사', '에너지관리기사', '환경기사', '건설안전기사']
  },
  {
    name: '경영·금융', icon: '📈', color: '#d97706',
    certs: ['재경관리사', '전산회계1급', '세무회계', 'ERP정보관리사', '투자자산운용사', 'AFPK']
  },
  {
    name: '어학·글로벌', icon: '🌍', color: '#dc2626',
    certs: ['TOEIC', 'OPIc', 'TOEIC Speaking', 'IELTS', 'TOEFL']
  }
];

// ===== 자격증 상세 데이터 =====
const CERT_DETAILS = {
  '컴활1급': {
    fullName: '컴퓨터활용능력 1급', org: '대한상공회의소',
    examType: 'CBT 상시시험 (필기+실기)', fee: '필기 19,400원 / 실기 22,500원',
    passCriteria: '과목당 40점 이상, 전과목 평균 60점 이상', prepPeriod: '2~3개월', difficulty: '중상',
    dailyStudy: '이론 1시간 + 실기연습 1.5시간 (일 2.5시간)',
    studyTips: '스프레드시트(함수, 매크로)와 데이터베이스(Access) 실기에 집중하세요. 기출문제를 최소 10회분 이상 반복 풀이하는 것이 핵심입니다. 필기는 기출 위주로 빠르게 정리하고 실기 연습에 더 많은 시간을 투자하세요.',
    schedule: '매주 토요일 상시시험 (CBT)', nextExam: '매주 토요일 응시 가능'
  },
  '컴활2급': {
    fullName: '컴퓨터활용능력 2급', org: '대한상공회의소',
    examType: 'CBT 상시시험 (필기+실기)', fee: '필기 11,500원 / 실기 13,000원',
    passCriteria: '과목당 40점 이상, 전과목 평균 60점 이상', prepPeriod: '1~2개월', difficulty: '중',
    dailyStudy: '이론 1시간 + 실기연습 1시간 (일 2시간)',
    studyTips: '엑셀 함수(VLOOKUP, IF, SUMIF 등)와 차트 작성이 핵심입니다. 실기는 반복 연습이 중요하며, 시간 관리에 유의하세요. 1급에 비해 범위가 좁으므로 단기 집중 학습이 효과적입니다.',
    schedule: '매주 토요일 상시시험 (CBT)', nextExam: '매주 토요일 응시 가능'
  },
  '워드프로세서': {
    fullName: '워드프로세서', org: '대한상공회의소',
    examType: 'CBT 상시시험 (필기+실기)', fee: '필기 11,500원 / 실기 13,000원',
    passCriteria: '과목당 40점 이상, 전과목 평균 60점 이상', prepPeriod: '1개월', difficulty: '하',
    dailyStudy: '이론 30분 + 실기연습 1시간 (일 1.5시간)',
    studyTips: '필기는 기출문제 반복으로 충분합니다. 실기는 한글(HWP) 문서 편집 능력이 핵심이며, 표 작성, 수식 입력, 스타일 지정 등을 집중 연습하세요.',
    schedule: '매주 토요일 상시시험 (CBT)', nextExam: '매주 토요일 응시 가능'
  },
  '한국사능력검정': {
    fullName: '한국사능력검정시험', org: '국사편찬위원회',
    examType: '정기시험 (PBT, 연 6회)', fee: '심화 32,000원',
    passCriteria: '1급 80점 이상 / 2급 70점 이상 / 3급 60점 이상', prepPeriod: '1~2개월', difficulty: '중',
    dailyStudy: '개념정리 1시간 + 기출풀이 1시간 (일 2시간)',
    studyTips: '시대별 흐름을 먼저 잡고, 기출문제를 회차별로 풀어보세요. 근현대사 비중이 높으므로 집중 학습이 필요합니다. EBS 강의와 기출앱을 병행하면 효과적입니다.',
    schedule: '연 6회 정기시험', nextExam: '국사편찬위원회 홈페이지 참고'
  },
  '정보처리기사': {
    fullName: '정보처리기사', org: '한국산업인력공단',
    examType: '정기시험 (연 3회, 필기+실기)', fee: '필기 19,400원 / 실기 22,600원',
    passCriteria: '과목당 40점 이상, 전과목 평균 60점 이상', prepPeriod: '3~4개월', difficulty: '중상',
    dailyStudy: '이론 1.5시간 + 기출 1시간 + 실기코딩 0.5시간 (일 3시간)',
    studyTips: '필기는 수제비 또는 시나공 교재로 이론을 정리하고 기출 반복이 핵심입니다. 실기는 SQL, 프로그래밍 언어(C/Java/Python), UML 다이어그램에 집중하세요. 최근 실기 난이도가 상승했으므로 코딩 연습을 충분히 하세요.',
    schedule: '연 3회 (기사시험 일정 참고)', nextExam: '캘린더에서 기사시험 일정 확인'
  },
  'SQLD': {
    fullName: 'SQL 개발자 (SQLD)', org: '한국데이터산업진흥원',
    examType: '정기시험 (연 4회, CBT)', fee: '50,000원',
    passCriteria: '총점 60점 이상, 과목당 40점 이상', prepPeriod: '1~2개월', difficulty: '중',
    dailyStudy: 'SQL문법 1시간 + 기출풀이 0.5시간 (일 1.5시간)',
    studyTips: 'SQL 기본 문법(SELECT, JOIN, 서브쿼리)을 완벽히 익히고, 데이터 모델링 기초를 학습하세요. 기출문제 반복이 합격의 지름길입니다. 노랭이 책(SQL 자격검정 실전문제)을 꼭 풀어보세요.',
    schedule: '연 4회 정기시험', nextExam: '한국데이터산업진흥원 홈페이지 참고'
  },
  'ADsP': {
    fullName: '데이터분석 준전문가 (ADsP)', org: '한국데이터산업진흥원',
    examType: '정기시험 (연 4회)', fee: '30,000원',
    passCriteria: '총점 60점 이상, 과목당 40점 이상', prepPeriod: '3~4주', difficulty: '중하',
    dailyStudy: '이론 1시간 + 기출풀이 0.5시간 (일 1.5시간)',
    studyTips: '데이터 분석 기획, 데이터 분석, 데이터 시각화 3개 과목을 골고루 학습하세요. 통계 기초 개념이 중요하며, 기출문제 패턴이 반복되므로 기출 위주로 학습하면 효율적입니다.',
    schedule: '연 4회 정기시험', nextExam: '한국데이터산업진흥원 홈페이지 참고'
  },
  '빅데이터분석기사': {
    fullName: '빅데이터분석기사', org: '한국데이터산업진흥원',
    examType: '정기시험 (연 2회, 필기+실기)', fee: '필기 24,800원 / 실기 25,400원',
    passCriteria: '과목당 40점 이상, 전과목 평균 60점 이상', prepPeriod: '3개월', difficulty: '상',
    dailyStudy: '이론 1.5시간 + Python/R 실습 1시간 (일 2.5시간)',
    studyTips: '필기는 빅데이터 분석 기획, 수집·저장·처리, 분석·시각화를 체계적으로 학습하세요. 실기는 Python 또는 R로 데이터 분석 실습이 필수입니다. Kaggle 데이터셋으로 연습하면 도움이 됩니다.',
    schedule: '연 2회 정기시험', nextExam: '한국데이터산업진흥원 홈페이지 참고'
  },
  '전기기사': {
    fullName: '전기기사', org: '한국산업인력공단',
    examType: '정기시험 (연 3회, 필기+실기)', fee: '필기 19,400원 / 실기 22,600원',
    passCriteria: '과목당 40점 이상, 전과목 평균 60점 이상', prepPeriod: '4~6개월', difficulty: '상',
    dailyStudy: '이론 2시간 + 기출풀이 1시간 (일 3시간)',
    studyTips: '회로이론, 전력공학, 전기기기가 핵심 과목입니다. 공식 암기보다 원리 이해에 집중하고, 실기는 계산 문제와 시퀀스 제어를 반복 연습하세요. 전기 관련 기사 중 가장 범용적인 자격증입니다.',
    schedule: '연 3회 (기사시험 일정 참고)', nextExam: '캘린더에서 기사시험 일정 확인'
  },
  '산업안전기사': {
    fullName: '산업안전기사', org: '한국산업인력공단',
    examType: '정기시험 (연 3회, 필기+실기)', fee: '필기 19,400원 / 실기 22,600원',
    passCriteria: '과목당 40점 이상, 전과목 평균 60점 이상', prepPeriod: '3~4개월', difficulty: '중상',
    dailyStudy: '이론 1.5시간 + 기출풀이 1시간 (일 2.5시간)',
    studyTips: '산업안전관리론, 인간공학, 기계·전기·화학 위험방지기술을 균형있게 학습하세요. 법규 과목은 최신 개정 내용을 반드시 확인하고, 실기는 작업형 문제 유형을 숙지하세요.',
    schedule: '연 3회 (기사시험 일정 참고)', nextExam: '캘린더에서 기사시험 일정 확인'
  },
  'TOEIC': {
    fullName: 'TOEIC (Test of English for International Communication)', org: 'YBM',
    examType: '정기시험 (매월 2~3회, 일요일)', fee: '52,000원',
    passCriteria: '만점 990점 (LC 495 + RC 495)', prepPeriod: '2~3개월', difficulty: '중 (목표 점수에 따라 상이)',
    dailyStudy: 'LC 1시간 + RC 1시간 (일 2시간)',
    studyTips: 'LC는 Part 3, 4의 패러프레이징에 집중하고, RC는 Part 5 문법을 빠르게 풀어 Part 7에 시간을 확보하세요. ETS 공식 교재와 실전 모의고사를 최소 5회분 이상 풀어보세요. 매일 꾸준한 영어 듣기가 중요합니다.',
    schedule: '매월 2~3회 일요일', nextExam: 'YBM 홈페이지에서 일정 확인'
  },
  'OPIc': {
    fullName: 'OPIc (Oral Proficiency Interview - Computer)', org: 'YBM',
    examType: '상시시험 (평일/토요일)', fee: '84,000원',
    passCriteria: '등급제: NH(Novice High) ~ AL(Advanced Low)', prepPeriod: '1~2개월', difficulty: '중 (목표 등급에 따라 상이)',
    dailyStudy: '스크립트 연습 30분 + 실전연습 30분 (일 1시간)',
    studyTips: '자기소개, 취미, 여행, 기술 등 빈출 주제별 스크립트를 준비하세요. 답변은 과거-현재-미래 구조로 구성하면 좋습니다. 매일 영어로 말하는 습관을 들이고, 녹음하여 피드백하세요. IH 이상을 목표로 한다면 롤플레이와 돌발 질문 대비가 필수입니다.',
    schedule: '평일/토요일 상시시험', nextExam: '상시 응시 가능'
  },
  'TOEIC Speaking': {
    fullName: 'TOEIC Speaking', org: 'YBM',
    examType: '정기시험 (매주 토·일)', fee: '84,000원',
    passCriteria: '만점 200점 (Lv.1~Lv.8)', prepPeriod: '1~2개월', difficulty: '중',
    dailyStudy: '유형별 연습 30분 + 모의테스트 30분 (일 1시간)',
    studyTips: 'Q3(사진 묘사), Q7-9(의견 제시)가 고배점 문항입니다. 템플릿을 만들어 연습하고, 시간 관리에 유의하세요. 발음보다 유창성과 내용의 논리성이 더 중요합니다.',
    schedule: '매주 토·일', nextExam: 'YBM 홈페이지에서 일정 확인'
  },
  '재경관리사': {
    fullName: '재경관리사', org: '삼일회계법인',
    examType: '정기시험 (연 4회)', fee: '70,000원',
    passCriteria: '과목당 40점 이상, 전과목 평균 70점 이상', prepPeriod: '2~3개월', difficulty: '중상',
    dailyStudy: '이론 1.5시간 + 기출풀이 1시간 (일 2.5시간)',
    studyTips: '재무회계, 세무회계, 원가관리회계 3과목을 균형있게 학습하세요. 회계원리를 탄탄히 다진 후 세무와 원가로 확장하는 것이 효율적입니다. 기출문제 패턴이 일정하므로 최근 5회분을 꼭 풀어보세요.',
    schedule: '연 4회 정기시험', nextExam: '삼일회계법인 홈페이지 참고'
  },
  '전산회계1급': {
    fullName: '전산회계 1급', org: '한국세무사회',
    examType: '정기시험 (연 5회)', fee: '20,000원',
    passCriteria: '70점 이상', prepPeriod: '1~2개월', difficulty: '중하',
    dailyStudy: '이론 1시간 + 실습(KcLep) 1시간 (일 2시간)',
    studyTips: '회계원리 기초를 먼저 학습하고, KcLep 프로그램 실습에 집중하세요. 전표 입력, 결산 처리, 부가세 신고가 실기의 핵심입니다. 유튜브 무료 강의와 기출문제를 병행하면 단기 합격이 가능합니다.',
    schedule: '연 5회 정기시험', nextExam: '한국세무사회 홈페이지 참고'
  }
};

const PLACEHOLDER_CERTS = [
  'MOS Excel Expert', 'ITQ', 'AWS Cloud Practitioner', '네트워크관리사', '리눅스마스터',
  '전기산업기사', '기계기사', '소방설비기사', '에너지관리기사', '환경기사', '건설안전기사',
  '세무회계', 'ERP정보관리사', '투자자산운용사', 'AFPK', 'IELTS', 'TOEFL'
];

// ===== 상시시험 안내 데이터 =====
const ALWAYS_EXAMS = [
  { name: '컴활 1급/2급', desc: '매주 토요일 상시시험 (CBT)' },
  { name: '워드프로세서', desc: '매주 토요일 상시시험 (CBT)' },
  { name: 'MOS', desc: '상시시험 (CBT)' },
  { name: 'ITQ', desc: '상시시험 (CBT)' },
  { name: 'OPIc', desc: '평일/토요일 상시시험' },
  { name: 'TOEIC', desc: '매월 2~3회 일요일' },
  { name: 'TOEIC Speaking', desc: '매주 토·일' },
  { name: 'AWS', desc: '온라인 상시시험' },
  { name: 'IELTS', desc: '매주 토요일' },
  { name: 'TOEFL', desc: '매주 토·일' }
];

// ===== 시험일정 데이터 =====
const YEAR = 2026;

const GISA_EXAM_EVENTS = [
  { type: 'register',  label: '1회 필기접수', startMonth: 1, startDay: 13, endMonth: 1, endDay: 16 },
  { type: 'written',   label: '1회 필기시험', startMonth: 2, startDay: 7,  endMonth: 3, endDay: 4 },
  { type: 'result',    label: '1회 필기발표', startMonth: 3, startDay: 12, endMonth: 3, endDay: 12 },
  { type: 'register',  label: '1회 실기접수', startMonth: 3, startDay: 24, endMonth: 4, endDay: 14 },
  { type: 'practical', label: '1회 실기시험', startMonth: 4, startDay: 19, endMonth: 5, endDay: 9 },
  { type: 'result',    label: '1회 실기발표', startMonth: 6, startDay: 5,  endMonth: 6, endDay: 5 },
  { type: 'register',  label: '2회 필기접수', startMonth: 4, startDay: 14, endMonth: 4, endDay: 17 },
  { type: 'written',   label: '2회 필기시험', startMonth: 5, startDay: 10, endMonth: 5, endDay: 30 },
  { type: 'result',    label: '2회 필기발표', startMonth: 6, startDay: 11, endMonth: 6, endDay: 11 },
  { type: 'register',  label: '2회 실기접수', startMonth: 6, startDay: 23, endMonth: 7, endDay: 14 },
  { type: 'practical', label: '2회 실기시험', startMonth: 7, startDay: 19, endMonth: 8, endDay: 6 },
  { type: 'result',    label: '2회 실기발표', startMonth: 9, startDay: 5,  endMonth: 9, endDay: 5 },
  { type: 'register',  label: '3회 필기접수', startMonth: 7, startDay: 21, endMonth: 7, endDay: 24 },
  { type: 'written',   label: '3회 필기시험', startMonth: 8, startDay: 9,  endMonth: 9, endDay: 1 },
  { type: 'result',    label: '3회 필기발표', startMonth: 9, startDay: 10, endMonth: 9, endDay: 10 },
  { type: 'register',  label: '3회 실기접수', startMonth: 9, startDay: 22, endMonth: 9, endDay: 25 },
  { type: 'practical', label: '3회 실기시험', startMonth: 11, startDay: 1, endMonth: 11, endDay: 21 },
  { type: 'result',    label: '3회 실기발표', startMonth: 12, startDay: 5, endMonth: 12, endDay: 5 }
];

const CALENDAR_CERTS = ['기사시험'];

const EVENT_COLORS = { register: '#eab308', written: '#3b82f6', practical: '#22c55e', result: '#ef4444' };
const EVENT_TYPE_LABELS = { register: '접수', written: '필기', practical: '실기', result: '발표' };
const EVENT_TYPE_BG = {
  register: 'rgba(234, 179, 8, 0.15)', written: 'rgba(59, 130, 246, 0.15)',
  practical: 'rgba(34, 197, 94, 0.15)', result: 'rgba(239, 68, 68, 0.15)'
};

// ===== 오늘의 명언 =====
const DAILY_QUOTES = [
  { text: '꿈을 이루고자 하는 용기만 있다면, 모든 꿈은 이루어질 수 있다.', author: '월트 디즈니' },
  { text: '성공은 매일 반복한 작은 노력들의 합이다.', author: '로버트 콜리어' },
  { text: '오늘 할 수 있는 일에 전력을 다하라. 그러면 내일에는 한 걸음 더 진보한다.', author: '뉴턴' },
  { text: '실패는 성공의 어머니다. 포기하지 않는 한 실패는 없다.', author: '에디슨' },
  { text: '당신이 할 수 있다고 믿든 할 수 없다고 믿든, 믿는 대로 될 것이다.', author: '헨리 포드' },
  { text: '준비된 자에게 기회가 온다. 오늘의 노력이 내일의 합격이다.', author: 'JobReady' },
  { text: '천 리 길도 한 걸음부터 시작된다. 오늘도 한 걸음 더 나아가자.', author: '노자' },
  { text: '노력은 배신하지 않는다. 꾸준함이 천재를 이긴다.', author: '작자미상' },
  { text: '지금 포기하면 앞으로도 포기하게 된다. 끝까지 해보자.', author: 'JobReady' },
  { text: '남들이 쉬는 시간에 공부하는 자가 결국 합격한다.', author: 'JobReady' }
];

// ===== 지역 데이터 (수도권) =====
const REGIONS = {
  '서울': [
    '강남구','강동구','강북구','강서구','관악구','광진구','구로구','금천구',
    '노원구','도봉구','동대문구','동작구','마포구','서대문구','서초구','성동구',
    '성북구','송파구','양천구','영등포구','용산구','은평구','종로구','중구','중랑구'
  ],
  '경기': [
    '고양시','과천시','광명시','광주시','구리시','군포시','김포시','남양주시',
    '동두천시','부천시','성남시','수원시','시흥시','안산시','안성시','안양시',
    '양주시','양평군','여주시','오산시','용인시','의왕시','의정부시','이천시',
    '파주시','평택시','포천시','하남시','화성시'
  ],
  '인천': [
    '계양구','남동구','동구','미추홀구','부평구','서구','연수구','옹진군','중구','강화군'
  ]
};

// ===== 전체 자격증 목록 =====
const ALL_CERTS = SECTORS.flatMap(s => s.certs);

// ===== 상태 =====
let openSectorIndex = null;
let calendarYear = YEAR;
let calendarMonth = new Date().getMonth();
let activeCalFilters = new Set(CALENDAR_CERTS);
let currentBoard = 'free';
let currentCertFilter = '';
let currentStudyRegionFilter = '';
let currentPostId = null;
let certDetailMiniCalMonth = new Date().getMonth();
let certDetailMiniCalYear = new Date().getFullYear();
let currentCertDetailName = '';

// ===== 유틸리티 =====
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return date.toLocaleDateString('ko-KR');
}

function getSessionId() {
  let id = localStorage.getItem('jobready_session_id');
  if (!id) {
    id = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
    localStorage.setItem('jobready_session_id', id);
  }
  return id;
}

async function api(method, path, body) {
  try {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(path, opts);
    return await res.json();
  } catch (e) {
    console.error(`API ${method} ${path} failed:`, e);
    return { error: '네트워크 오류' };
  }
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function formatDateRange(ev) {
  if (ev.startMonth === ev.endMonth && ev.startDay === ev.endDay) {
    return `${ev.startMonth}/${ev.startDay}`;
  }
  return `${ev.startMonth}/${ev.startDay} ~ ${ev.endMonth}/${ev.endDay}`;
}

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ===== 파티클 시스템 =====
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -1000, y: -1000 };
    this.animId = null;
    this.resize();
    this.init();
    window.addEventListener('resize', () => this.resize());
    this.canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
    this.canvas.parentElement.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  resize() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.offsetWidth;
    this.canvas.height = parent.offsetHeight;
    this.init();
  }

  init() {
    const count = Math.min(Math.floor((this.canvas.width * this.canvas.height) / 12000), 80);
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  update() {
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        p.vx += dx * 0.00008;
        p.vy += dy * 0.00008;
      }

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 0.8) {
        p.vx *= 0.98;
        p.vy *= 0.98;
      }
    });
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw connections
    const maxDist = 120;
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(100, 150, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Mouse connections
    this.particles.forEach(p => {
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) {
        const alpha = (1 - dist / 180) * 0.25;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(this.mouse.x, this.mouse.y);
        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    });

    // Draw particles
    this.particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha})`;
      ctx.fill();
    });
  }

  animate() {
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (!this.animId) this.animate();
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }
}

// ===== 타이핑 효과 =====
function startTypingEffect() {
  const line1El = document.getElementById('typing-line1');
  const line2El = document.getElementById('typing-line2');
  const cursorEl = document.getElementById('typing-cursor');
  const descEl = document.getElementById('hero-desc');
  const actionsEl = document.getElementById('hero-actions');
  const statsEl = document.getElementById('hero-stats');

  const line1Text = '취업 준비의 ';
  const line1Accent = '모든 것,';
  const line2Text = '한 곳에서.';

  let i = 0;
  const fullLine1 = line1Text + line1Accent;

  function typeLine1() {
    if (i < fullLine1.length) {
      if (i < line1Text.length) {
        line1El.innerHTML = escapeHtml(fullLine1.substring(0, i + 1));
      } else {
        line1El.innerHTML = escapeHtml(line1Text) +
          '<span class="hero-accent">' + escapeHtml(fullLine1.substring(line1Text.length, i + 1)) + '</span>';
      }
      i++;
      setTimeout(typeLine1, 60 + Math.random() * 40);
    } else {
      setTimeout(typeLine2Start, 300);
    }
  }

  function typeLine2Start() {
    line2El.style.opacity = '1';
    let j = 0;
    function typeLine2() {
      if (j < line2Text.length) {
        line2El.textContent = line2Text.substring(0, j + 1);
        j++;
        setTimeout(typeLine2, 60 + Math.random() * 40);
      } else {
        cursorEl.style.display = 'none';
        setTimeout(showRest, 200);
      }
    }
    typeLine2();
  }

  function showRest() {
    descEl.style.opacity = '1';
    setTimeout(() => { actionsEl.style.opacity = '1'; }, 300);
    setTimeout(() => { statsEl.style.opacity = '1'; }, 600);
  }

  setTimeout(typeLine1, 500);
}

// ===== 스크롤 패럴랙스 =====
function initScrollParallax() {
  const overlay = document.getElementById('hero-scroll-overlay');
  const heroContent = document.getElementById('hero-content');
  const hero = document.getElementById('hero-section');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroH = hero.offsetHeight;
    if (scrollY < heroH) {
      const ratio = scrollY / heroH;
      overlay.style.opacity = ratio * 0.7;
      heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
      heroContent.style.opacity = 1 - ratio * 0.8;
    }
  });
}

// ===== 네비게이션 =====
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
});

// ===== 오늘의 명언 렌더 =====
function renderDailyQuote() {
  const container = document.getElementById('daily-quote-inner');
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const quote = DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
  container.innerHTML = `
    <div class="daily-quote-text">"${escapeHtml(quote.text)}"</div>
    <div class="daily-quote-author">- ${escapeHtml(quote.author)}</div>
  `;
}

// ===== 상시시험 안내 박스 =====
function renderAlwaysExamBox() {
  const container = document.getElementById('always-exam-grid');
  container.innerHTML = ALWAYS_EXAMS.map(item => `
    <div class="always-exam-item">
      <span class="always-exam-name">${item.name}</span>
      <span class="always-exam-desc">${item.desc}</span>
    </div>
  `).join('');
}

// ===== 섹터 렌더링 =====
function renderSectors() {
  const container = document.getElementById('sectors-list');
  container.innerHTML = SECTORS.map((sector, i) => {
    const isOpen = openSectorIndex === i;
    const bgStyle = `background: linear-gradient(135deg, ${sector.color}20, ${sector.color}08);`;
    return `
      <div class="sector-card ${isOpen ? 'open' : ''} animate-in"
           style="--sector-color: ${sector.color}; animation-delay: ${i * 0.08}s"
           onclick="toggleSector(${i})">
        <div class="sector-header">
          <div class="sector-icon-box" style="${bgStyle} box-shadow: 0 4px 20px ${sector.color}20;">
            ${sector.icon}
          </div>
          <div class="sector-info">
            <div class="sector-name">${sector.name}</div>
            <div class="sector-count">${sector.certs.length}개 자격증</div>
          </div>
          <div class="sector-toggle">▼</div>
        </div>
        <div class="sector-body">
          <div class="sector-tags">
            ${sector.certs.map(cert => `
              <span class="cert-tag" style="background: ${sector.color}12; color: ${sector.color}; border-color: ${sector.color}30;"
                    onclick="event.stopPropagation(); openCertDetail('${cert}')">
                ${cert}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function toggleSector(index) {
  openSectorIndex = openSectorIndex === index ? null : index;
  renderSectors();
}

// ===== 캘린더 =====
function getEventsForDate(year, month, day) {
  const events = [];
  if (!activeCalFilters.has('기사시험')) return events;
  const date = new Date(year, month, day);
  GISA_EXAM_EVENTS.forEach(ev => {
    const start = new Date(year, ev.startMonth - 1, ev.startDay);
    const end = new Date(year, ev.endMonth - 1, ev.endDay, 23, 59, 59);
    if (date >= start && date <= end) {
      events.push({
        cert: '기사시험', label: ev.label, type: ev.type,
        color: EVENT_COLORS[ev.type], dateRange: formatDateRange(ev)
      });
    }
  });
  return events;
}

function renderCalendar() {
  const titleEl = document.getElementById('cal-month-title');
  titleEl.textContent = `${calendarYear}년 ${calendarMonth + 1}월`;
  const grid = document.getElementById('calendar-grid');
  const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
  const lastDate = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === calendarYear && today.getMonth() === calendarMonth;
  const todayDate = today.getDate();

  let html = '';
  for (let i = 0; i < firstDay; i++) html += '<div class="cal-cell"></div>';
  for (let d = 1; d <= lastDate; d++) {
    const events = getEventsForDate(calendarYear, calendarMonth, d);
    const isToday = isCurrentMonth && d === todayDate;
    const hasEvents = events.length > 0;
    const uniqueColors = [...new Set(events.map(e => e.color))];
    const dotsHtml = uniqueColors.slice(0, 4).map(c =>
      `<span class="cal-dot" style="background:${c}"></span>`
    ).join('');
    html += `
      <div class="cal-cell ${isToday ? 'today' : ''} ${hasEvents ? 'has-events' : ''}"
           ${hasEvents ? `onclick="openCalDayModal(${calendarYear}, ${calendarMonth}, ${d})" onmouseenter="showCalTooltip(event, ${calendarYear}, ${calendarMonth}, ${d})" onmouseleave="hideCalTooltip()"` : ''}>
        <span class="cal-day-num">${d}</span>
        ${dotsHtml ? `<div class="cal-dots">${dotsHtml}</div>` : ''}
      </div>
    `;
  }
  grid.innerHTML = html;
}

function renderCalendarFilters() {
  const container = document.getElementById('calendar-filters');
  container.innerHTML = CALENDAR_CERTS.map(cert => {
    const isActive = activeCalFilters.has(cert);
    return `<button class="cal-filter-btn ${isActive ? 'active' : ''}" onclick="toggleCalFilter('${cert}')">${cert}</button>`;
  }).join('');
}

function toggleCalFilter(cert) {
  if (activeCalFilters.has(cert)) activeCalFilters.delete(cert);
  else activeCalFilters.add(cert);
  renderCalendarFilters();
  renderCalendar();
}

function changeMonth(delta) {
  calendarMonth += delta;
  if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
  else if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
  renderCalendar();
}

function showCalTooltip(e, year, month, day) {
  const events = getEventsForDate(year, month, day);
  if (events.length === 0) return;
  const tooltip = document.getElementById('cal-tooltip');
  tooltip.innerHTML = events.map(ev =>
    `<div class="tooltip-event">
      <span class="tooltip-dot" style="background:${ev.color}"></span>
      <span class="tooltip-cert">${ev.cert}</span>
      <span>${ev.label}</span>
      <span class="tooltip-date">${ev.dateRange}</span>
    </div>`
  ).join('');
  tooltip.style.display = 'block';
  const rect = e.currentTarget.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
  let top = rect.bottom + 8;
  if (left < 8) left = 8;
  if (left + tooltipRect.width > window.innerWidth - 8) left = window.innerWidth - tooltipRect.width - 8;
  if (top + tooltipRect.height > window.innerHeight - 8) top = rect.top - tooltipRect.height - 8;
  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
}

function hideCalTooltip() {
  document.getElementById('cal-tooltip').style.display = 'none';
}

function openCalDayModal(year, month, day) {
  hideCalTooltip();
  const events = getEventsForDate(year, month, day);
  if (events.length === 0) return;
  document.getElementById('cal-day-title').textContent = `${year}년 ${month + 1}월 ${day}일`;
  document.getElementById('cal-day-events').innerHTML = events.map(ev => `
    <div class="cal-day-event-item" style="border-left-color: ${ev.color}">
      <div>
        <div class="cal-day-event-label">${ev.label}</div>
        <div class="cal-day-event-date">${ev.dateRange}</div>
      </div>
      <span class="cal-day-event-type" style="background: ${EVENT_TYPE_BG[ev.type]}; color: ${ev.color}">
        ${EVENT_TYPE_LABELS[ev.type]}
      </span>
    </div>
  `).join('');
  document.getElementById('cal-day-modal').classList.add('active');
}

function closeCalDayModal() {
  document.getElementById('cal-day-modal').classList.remove('active');
}

// ===== 다가오는 일정 =====
function renderUpcomingEvents() {
  const container = document.getElementById('upcoming-list');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = [];
  GISA_EXAM_EVENTS.forEach(ev => {
    const start = new Date(YEAR, ev.startMonth - 1, ev.startDay);
    const end = new Date(YEAR, ev.endMonth - 1, ev.endDay);
    if (end >= today) {
      const diffDays = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
      upcoming.push({ label: ev.label, type: ev.type, color: EVENT_COLORS[ev.type],
        dateRange: formatDateRange(ev), startDate: start, daysUntil: diffDays });
    }
  });
  upcoming.sort((a, b) => a.startDate - b.startDate);
  const top5 = upcoming.slice(0, 5);
  if (top5.length === 0) {
    container.innerHTML = '<div class="upcoming-empty">예정된 일정이 없습니다.</div>';
    return;
  }
  container.innerHTML = top5.map(ev => {
    const ddayText = ev.daysUntil <= 0 ? '진행중' : `D-${ev.daysUntil}`;
    const ddayClass = ev.daysUntil <= 7 ? 'soon' : 'normal';
    return `
      <div class="upcoming-item">
        <span class="upcoming-dot" style="background:${ev.color}"></span>
        <span class="upcoming-label">${ev.label}</span>
        <span class="upcoming-date">${ev.dateRange}</span>
        <span class="upcoming-dday ${ddayClass}">${ddayText}</span>
      </div>
    `;
  }).join('');
}

// ===== 자격증 상세 모달 =====
function openCertDetail(certName) {
  currentCertDetailName = certName;
  certDetailMiniCalMonth = new Date().getMonth();
  certDetailMiniCalYear = new Date().getFullYear();
  document.getElementById('cert-detail-name').textContent = certName;
  const detail = CERT_DETAILS[certName];
  const container = document.getElementById('cert-detail-content');

  if (!detail) {
    container.innerHTML = `
      <div class="cert-placeholder">
        <div class="cert-placeholder-icon">📋</div>
        <p><strong>${escapeHtml(certName)}</strong></p>
        <p style="margin-top:8px;">상세 정보 준비 중입니다.<br>곧 업데이트될 예정이에요!</p>
      </div>
      <div class="cert-detail-section">
        <div class="cert-section-title">✅ 일일 출석체크</div>
        <div class="checkin-area" id="checkin-area"></div>
      </div>
    `;
    renderCheckinArea(certName);
    document.getElementById('cert-detail-modal').classList.add('active');
    return;
  }

  container.innerHTML = `
    <div class="cert-detail-section">
      <div class="cert-section-title">📌 기본 정보</div>
      <div class="cert-info-grid">
        <div class="cert-info-item"><div class="cert-info-label">주관기관</div><div class="cert-info-value">${detail.org}</div></div>
        <div class="cert-info-item"><div class="cert-info-label">시험유형</div><div class="cert-info-value">${detail.examType}</div></div>
        <div class="cert-info-item"><div class="cert-info-label">응시료</div><div class="cert-info-value">${detail.fee}</div></div>
        <div class="cert-info-item"><div class="cert-info-label">합격기준</div><div class="cert-info-value">${detail.passCriteria}</div></div>
      </div>
    </div>
    <div class="cert-detail-section">
      <div class="cert-section-title">📅 시험일정</div>
      <div class="cert-info-grid">
        <div class="cert-info-item full-width"><div class="cert-info-label">일정</div><div class="cert-info-value">${detail.schedule}</div></div>
        <div class="cert-info-item full-width"><div class="cert-info-label">다음 시험</div><div class="cert-info-value">${detail.nextExam}</div></div>
      </div>
    </div>
    <div class="cert-detail-section">
      <div class="cert-section-title">💡 공부 팁</div>
      <div class="cert-info-grid" style="margin-bottom:10px;">
        <div class="cert-info-item"><div class="cert-info-label">예상 준비기간</div><div class="cert-info-value">${detail.prepPeriod}</div></div>
        <div class="cert-info-item"><div class="cert-info-label">난이도</div><div class="cert-info-value">${detail.difficulty}</div></div>
      </div>
      <div class="cert-study-tip">${detail.studyTips}</div>
    </div>
    <div class="cert-detail-section">
      <div class="cert-section-title">⏰ 하루 추천 공부량</div>
      <div class="cert-daily-box">${detail.dailyStudy}</div>
    </div>
    <div class="cert-detail-section">
      <div class="cert-section-title">✅ 일일 출석체크</div>
      <div class="checkin-area" id="checkin-area"></div>
    </div>
  `;
  renderCheckinArea(certName);
  document.getElementById('cert-detail-modal').classList.add('active');
}

function closeCertDetailModal() {
  document.getElementById('cert-detail-modal').classList.remove('active');
  currentCertDetailName = '';
}

// ===== 일일 출석체크 =====
function getCheckinKey(certName) { return `checkin_${certName}`; }

function getCheckinDates(certName) {
  const raw = localStorage.getItem(getCheckinKey(certName));
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function saveCheckinDates(certName, dates) {
  localStorage.setItem(getCheckinKey(certName), JSON.stringify(dates));
}

function isTodayChecked(certName) {
  return getCheckinDates(certName).includes(getTodayStr());
}

async function doCheckin(certName) {
  if (!requireLogin()) return;
  if (isTodayChecked(certName)) return;
  const dates = getCheckinDates(certName);
  const today = getTodayStr();
  dates.push(today);
  saveCheckinDates(certName, dates);

  // Server sync
  await api('POST', '/api/attendance/checkin', {
    sessionId: getSessionId(),
    certName: certName,
    date: today
  });

  renderCheckinArea(certName);
  loadRankings();
}

function getStreak(certName) {
  const dates = getCheckinDates(certName);
  if (dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort().reverse();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  let checkDate = new Date(today);
  for (let i = 0; i < 365; i++) {
    const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    if (sorted.includes(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function renderCheckinArea(certName) {
  const area = document.getElementById('checkin-area');
  if (!area) return;
  const checked = isTodayChecked(certName);
  const streak = getStreak(certName);
  let streakHtml = '';
  if (streak > 0) {
    streakHtml = `<span class="checkin-streak"><span class="checkin-streak-num">${streak}</span>일 연속 공부중!</span>`;
  }
  area.innerHTML = `
    <div class="checkin-top">
      <button class="checkin-btn ${checked ? 'checked' : 'not-checked'}"
              onclick="${checked ? '' : `doCheckin('${certName}')`}">
        ${checked ? '오늘 출석 완료!' : '오늘 공부 완료!'}
      </button>
      ${streakHtml}
    </div>
    <div class="mini-cal" id="mini-cal"></div>
  `;
  renderMiniCalendar(certName);
}

function renderMiniCalendar(certName) {
  const container = document.getElementById('mini-cal');
  if (!container) return;
  const year = certDetailMiniCalYear;
  const month = certDetailMiniCalMonth;
  const checkedDates = getCheckinDates(certName);
  const todayStr = getTodayStr();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const dayHeaders = ['일', '월', '화', '수', '목', '금', '토'];
  let daysHtml = dayHeaders.map(d => `<span class="mini-cal-day-header">${d}</span>`).join('');
  for (let i = 0; i < firstDay; i++) daysHtml += '<span class="mini-cal-day"></span>';
  for (let d = 1; d <= lastDate; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isChecked = checkedDates.includes(dateStr);
    const isToday = dateStr === todayStr;
    const classes = ['mini-cal-day', 'current-month'];
    if (isChecked) classes.push('checked-day');
    if (isToday) classes.push('today-day');
    daysHtml += `<span class="${classes.join(' ')}">${d}</span>`;
  }
  container.innerHTML = `
    <div class="mini-cal-header">
      <button class="mini-cal-nav" onclick="changeMiniCalMonth(-1)">&larr;</button>
      <span class="mini-cal-title">${year}년 ${month + 1}월</span>
      <button class="mini-cal-nav" onclick="changeMiniCalMonth(1)">&rarr;</button>
    </div>
    <div class="mini-cal-days">${daysHtml}</div>
  `;
}

function changeMiniCalMonth(delta) {
  certDetailMiniCalMonth += delta;
  if (certDetailMiniCalMonth < 0) { certDetailMiniCalMonth = 11; certDetailMiniCalYear--; }
  else if (certDetailMiniCalMonth > 11) { certDetailMiniCalMonth = 0; certDetailMiniCalYear++; }
  if (currentCertDetailName) renderMiniCalendar(currentCertDetailName);
}

// ===== 랭킹보드 =====
async function loadRankings() {
  const rankings = await api('GET', '/api/attendance/rankings');
  renderRankings(Array.isArray(rankings) ? rankings : []);
}

function renderRankings(rankings) {
  const container = document.getElementById('ranking-list');
  if (rankings.length === 0) {
    container.innerHTML = `
      <div class="ranking-empty">
        아직 출석 기록이 없습니다.<br>자격증 상세 페이지에서 출석체크를 해보세요!
      </div>
    `;
    return;
  }

  container.innerHTML = rankings.map((r, i) => {
    const rank = i + 1;
    let medal = rank;
    if (rank === 1) medal = '🥇';
    else if (rank === 2) medal = '🥈';
    else if (rank === 3) medal = '🥉';
    const topClass = rank <= 3 ? `top-${rank}` : '';
    const activeDot = r.isActiveToday ? '<span class="ranking-active-dot" title="오늘 활동"></span>' : '';

    return `
      <div class="ranking-item ${topClass}" onclick="openRankerModal('${escapeHtml(r.nickname)}', ${JSON.stringify(r.certs).replace(/"/g, '&quot;')}, ${r.totalDays}, ${r.streak})">
        <div class="ranking-rank">${medal}</div>
        <div class="ranking-info">
          <div class="ranking-nickname">${escapeHtml(r.nickname)} ${activeDot}</div>
          <div class="ranking-stats">
            <span class="ranking-stat">총 <strong>${r.totalDays}일</strong></span>
            <span class="ranking-stat">연속 <strong>${r.streak}일</strong></span>
            <span class="ranking-stat">자격증 <strong>${r.certs.length}개</strong></span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openRankerModal(nickname, certs, totalDays, streak) {
  document.getElementById('ranker-name').textContent = nickname;
  const certsHtml = certs.map(c => `<span class="ranker-cert-tag">${escapeHtml(c)}</span>`).join('');
  document.getElementById('ranker-content').innerHTML = `
    <div style="margin-bottom:16px;">
      <div class="ranking-stats" style="gap:16px;">
        <span class="ranking-stat">총 출석 <strong>${totalDays}일</strong></span>
        <span class="ranking-stat">연속 <strong>${streak}일</strong></span>
      </div>
    </div>
    <div>
      <div style="font-size:13px;font-weight:700;color:var(--text-muted);margin-bottom:8px;">공부 중인 자격증</div>
      <div class="ranker-certs">${certsHtml || '<span style="font-size:13px;color:var(--text-dim)">아직 없습니다</span>'}</div>
    </div>
  `;
  document.getElementById('ranker-modal').classList.add('active');
}

function closeRankerModal() {
  document.getElementById('ranker-modal').classList.remove('active');
}

// ===== 공유 카드 생성 =====
async function generateShareCard() {
  const canvas = document.getElementById('share-canvas');
  const ctx = canvas.getContext('2d');
  const w = 600, h = 400;
  canvas.width = w;
  canvas.height = h;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(1, '#1e293b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Decorative circles
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath(); ctx.arc(500, 80, 120, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8b5cf6';
  ctx.beginPath(); ctx.arc(100, 350, 100, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;

  // Border
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)';
  ctx.lineWidth = 2;
  ctx.roundRect(12, 12, w - 24, h - 24, 16);
  ctx.stroke();

  // Logo
  ctx.font = '700 24px Pretendard, sans-serif';
  ctx.fillStyle = '#f1f5f9';
  ctx.fillText('📋 JobReady', 40, 60);

  // Collect all local checkin data
  const allCerts = [];
  let totalDays = 0;
  const allDatesSet = new Set();

  ALL_CERTS.forEach(cert => {
    const dates = getCheckinDates(cert);
    if (dates.length > 0) {
      allCerts.push(cert);
      dates.forEach(d => allDatesSet.add(d));
    }
  });
  totalDays = allDatesSet.size;

  // Calculate total streak
  let totalStreak = 0;
  if (allDatesSet.size > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let checkDate = new Date(today);
    for (let i = 0; i < 365; i++) {
      const ds = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
      if (allDatesSet.has(ds)) {
        totalStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Stats
  ctx.font = '800 48px Pretendard, sans-serif';
  ctx.fillStyle = '#60a5fa';
  ctx.fillText(`${totalDays}`, 40, 140);
  ctx.font = '600 16px Pretendard, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('일 출석', 40 + ctx.measureText(`${totalDays}`).width + 8, 140);

  ctx.font = '800 48px Pretendard, sans-serif';
  ctx.fillStyle = '#a78bfa';
  ctx.fillText(`${totalStreak}`, 240, 140);
  ctx.font = '600 16px Pretendard, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('일 연속', 240 + ctx.measureText(`${totalStreak}`).width + 8, 140);

  // Certs
  ctx.font = '700 14px Pretendard, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText('공부 중인 자격증', 40, 190);

  ctx.font = '600 15px Pretendard, sans-serif';
  ctx.fillStyle = '#94a3b8';
  const certText = allCerts.length > 0 ? allCerts.slice(0, 5).join(', ') + (allCerts.length > 5 ? ` 외 ${allCerts.length - 5}개` : '') : '아직 없습니다';
  ctx.fillText(certText, 40, 215);

  // Motivational text
  ctx.font = '700 20px Pretendard, sans-serif';
  ctx.fillStyle = '#f1f5f9';
  ctx.fillText('JobReady에서 취업준비 중! 🔥', 40, 300);

  // Date
  ctx.font = '600 13px Pretendard, sans-serif';
  ctx.fillStyle = '#475569';
  ctx.fillText(new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }), 40, 340);

  // Download
  const link = document.createElement('a');
  link.download = `jobready-share-${getTodayStr()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ===== 지역 드롭다운 =====
function onRegionChange() {
  const regionSelect = document.getElementById('post-region');
  const citySelect = document.getElementById('post-region-city');
  const region = regionSelect.value;

  citySelect.innerHTML = '<option value="">상세지역 선택</option>';
  if (region && REGIONS[region]) {
    REGIONS[region].forEach(city => {
      citySelect.innerHTML += `<option value="${city}">${city}</option>`;
    });
  }
}

// ===== 커뮤니티 =====
function setBoardTab(board) {
  currentBoard = board;
  currentCertFilter = '';
  currentStudyRegionFilter = '';

  document.querySelectorAll('.comm-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.board === board);
  });

  const tipsFilter = document.getElementById('tips-filter');
  const studyFilter = document.getElementById('study-filter');

  tipsFilter.style.display = board === 'tips' ? 'flex' : 'none';
  studyFilter.style.display = board === 'study' ? 'flex' : 'none';

  if (board === 'tips') renderTipsFilter();
  if (board === 'study') renderStudyFilter();

  loadPosts();
}

function renderTipsFilter() {
  const container = document.getElementById('tips-filter');
  container.innerHTML = `
    <button class="tips-filter-btn ${currentCertFilter === '' ? 'active' : ''}" onclick="setTipsCertFilter('')">전체</button>
    ${ALL_CERTS.map(cert =>
      `<button class="tips-filter-btn ${currentCertFilter === cert ? 'active' : ''}" onclick="setTipsCertFilter('${cert}')">${cert}</button>`
    ).join('')}
  `;
}

function setTipsCertFilter(cert) {
  currentCertFilter = cert;
  renderTipsFilter();
  loadPosts();
}

function renderStudyFilter() {
  const container = document.getElementById('study-filter');
  const regions = ['전체', '서울', '경기', '인천'];
  container.innerHTML = regions.map(r => {
    const val = r === '전체' ? '' : r;
    return `<button class="study-filter-btn ${currentStudyRegionFilter === val ? 'active' : ''}" onclick="setStudyRegionFilter('${val}')">${r}</button>`;
  }).join('');
}

function setStudyRegionFilter(region) {
  currentStudyRegionFilter = region;
  renderStudyFilter();
  loadPosts();
}

async function loadPosts() {
  let url = `/api/posts?board=${currentBoard}`;
  if (currentBoard === 'tips' && currentCertFilter) {
    url += `&certTag=${encodeURIComponent(currentCertFilter)}`;
  }
  if (currentBoard === 'study' && currentStudyRegionFilter) {
    url += `&region=${encodeURIComponent(currentStudyRegionFilter)}`;
  }
  const posts = await api('GET', url);
  renderPosts(Array.isArray(posts) ? posts : []);
}

function renderPosts(posts) {
  const container = document.getElementById('posts-list');
  if (posts.length === 0) {
    container.innerHTML = `
      <div class="posts-empty">
        <div class="posts-empty-icon">📝</div>
        <p>아직 게시글이 없습니다.<br>첫 번째 글을 작성해보세요!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = posts.map(post => {
    let tagsHtml = '';
    if (post.board === 'success') {
      if (post.company) tagsHtml += `<span class="post-tag company">${escapeHtml(post.company)}</span>`;
      if (post.position) tagsHtml += `<span class="post-tag position">${escapeHtml(post.position)}</span>`;
    }
    if (post.board === 'tips' && post.certTag) {
      tagsHtml += `<span class="post-tag cert">${escapeHtml(post.certTag)}</span>`;
    }
    if (post.board === 'study') {
      if (post.certTag) tagsHtml += `<span class="post-tag cert">${escapeHtml(post.certTag)}</span>`;
      if (post.method) tagsHtml += `<span class="post-tag method">${escapeHtml(post.method)}</span>`;
      if (post.region) {
        const regionText = post.regionCity ? `${post.region} ${post.regionCity}` : post.region;
        tagsHtml += `<span class="post-tag region">${escapeHtml(regionText)}</span>`;
      }
    }

    let membersHtml = '';
    if (post.board === 'study' && post.maxMembers) {
      membersHtml = `<span class="post-members">${post.currentMembers}/${post.maxMembers}명</span>`;
    }

    return `
      <div class="post-card" onclick="openPostDetail(${post.id})">
        <div class="post-top">
          <span class="post-nickname">${escapeHtml(post.nickname)}</span>
          <span class="post-time">${timeAgo(post.createdAt)}</span>
        </div>
        <div class="post-title-text">${escapeHtml(post.title)}</div>
        ${tagsHtml ? `<div class="post-tags">${tagsHtml}</div>` : ''}
        <div class="post-preview">${escapeHtml(post.content)}</div>
        <div class="post-bottom">
          <span class="post-stat">❤️ ${post.likes}</span>
          <span class="post-stat">💬 ${post.commentCount}</span>
          ${membersHtml}
        </div>
      </div>
    `;
  }).join('');
}

// 글쓰기 모달
function openWriteModal() {
  if (!requireLogin()) return;
  const modal = document.getElementById('write-modal');
  const successFields = document.getElementById('success-fields');
  const tipsFields = document.getElementById('tips-fields-form');
  const studyFields = document.getElementById('study-fields-form');
  const titleMap = { free: '자유게시판 글쓰기', success: '합격수기 작성', tips: '시험꿀팁 공유', study: '스터디 모집' };

  document.getElementById('write-modal-title').textContent = titleMap[currentBoard] || '글쓰기';

  successFields.style.display = currentBoard === 'success' ? 'block' : 'none';
  tipsFields.style.display = currentBoard === 'tips' ? 'block' : 'none';
  studyFields.style.display = currentBoard === 'study' ? 'block' : 'none';

  if (currentBoard === 'tips') {
    const select = document.getElementById('post-cert-tag');
    select.innerHTML = '<option value="">자격증 태그 선택</option>' +
      ALL_CERTS.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  if (currentBoard === 'study') {
    const select = document.getElementById('post-study-cert');
    select.innerHTML = '<option value="">자격증 태그 선택</option>' +
      ALL_CERTS.map(c => `<option value="${c}">${c}</option>`).join('');
    document.getElementById('post-max-members').value = '';
    document.getElementById('post-method').value = '';
    document.getElementById('post-region').value = '';
    document.getElementById('post-region-city').innerHTML = '<option value="">상세지역 선택</option>';
  }

  modal.classList.add('active');
}

function closeWriteModal() {
  document.getElementById('write-modal').classList.remove('active');
  document.getElementById('post-title').value = '';
  document.getElementById('post-content').value = '';
  document.getElementById('post-company').value = '';
  document.getElementById('post-position').value = '';
}

async function submitPost(e) {
  e.preventDefault();
  const title = document.getElementById('post-title').value.trim();
  const content = document.getElementById('post-content').value.trim();
  if (!title || !content) return;

  const body = { board: currentBoard, title, content, sessionId: getSessionId() };

  if (currentBoard === 'success') {
    body.company = document.getElementById('post-company').value.trim();
    body.position = document.getElementById('post-position').value.trim();
  }
  if (currentBoard === 'tips') {
    body.certTag = document.getElementById('post-cert-tag').value;
  }
  if (currentBoard === 'study') {
    body.certTag = document.getElementById('post-study-cert').value;
    body.maxMembers = document.getElementById('post-max-members').value;
    body.method = document.getElementById('post-method').value;
    body.region = document.getElementById('post-region').value;
    body.regionCity = document.getElementById('post-region-city').value;
  }

  const result = await api('POST', '/api/posts', body);
  if (result.error) return;
  closeWriteModal();
  loadPosts();
}

// 게시글 상세 모달
async function openPostDetail(id) {
  currentPostId = id;
  const post = await api('GET', `/api/posts/${id}`);
  if (post.error) return;

  document.getElementById('detail-title').textContent = post.title;

  let metaHtml = `<span class="detail-nickname">${escapeHtml(post.nickname)}</span>`;
  metaHtml += `<span class="detail-time">${timeAgo(post.createdAt)}</span>`;
  if (post.company) metaHtml += `<span class="post-tag company">${escapeHtml(post.company)}</span>`;
  if (post.position) metaHtml += `<span class="post-tag position">${escapeHtml(post.position)}</span>`;
  if (post.certTag) metaHtml += `<span class="post-tag cert">${escapeHtml(post.certTag)}</span>`;
  document.getElementById('detail-meta').innerHTML = metaHtml;

  document.getElementById('detail-body').textContent = post.content;

  // Study info
  const studyInfoEl = document.getElementById('detail-study-info');
  if (post.board === 'study') {
    studyInfoEl.style.display = 'flex';
    const sessionId = getSessionId();
    const isJoined = post.joinedMembers && post.joinedMembers.some(m => m.sessionId === sessionId);
    const isFull = post.maxMembers && post.currentMembers >= post.maxMembers && !isJoined;
    let studyHtml = '';
    if (post.method) studyHtml += `<span class="detail-study-badge" style="background:rgba(234,179,8,.15);color:#fbbf24;">${escapeHtml(post.method)}</span>`;
    if (post.region) {
      const regionText = post.regionCity ? `${post.region} ${post.regionCity}` : post.region;
      studyHtml += `<span class="detail-study-badge" style="background:rgba(6,182,212,.15);color:#22d3ee;">${escapeHtml(regionText)}</span>`;
    }
    if (post.maxMembers) {
      studyHtml += `<span class="detail-study-badge" style="background:rgba(5,150,105,.15);color:#34d399;">${post.currentMembers}/${post.maxMembers}명</span>`;
    }

    if (isFull) {
      studyHtml += `<button class="detail-join-btn join" disabled style="opacity:0.5;cursor:default">모집 완료</button>`;
    } else if (isJoined) {
      studyHtml += `<button class="detail-join-btn leave" onclick="toggleStudyJoin(${id})">참여 취소</button>`;
    } else {
      studyHtml += `<button class="detail-join-btn join" onclick="toggleStudyJoin(${id})">참여하기</button>`;
    }
    studyInfoEl.innerHTML = studyHtml;
  } else {
    studyInfoEl.style.display = 'none';
  }

  const liked = post.likedBy && post.likedBy.includes(getSessionId());
  document.getElementById('detail-actions').innerHTML = `
    <button class="like-btn ${liked ? 'liked' : ''}" onclick="event.stopPropagation(); likePost(${id})">
      ${liked ? '❤️' : '🤍'} 좋아요 <span id="like-count-${id}">${post.likes}</span>
    </button>
  `;

  renderComments(post.comments || []);
  document.getElementById('post-detail-modal').classList.add('active');
  document.getElementById('comment-input').value = '';
}

async function toggleStudyJoin(postId) {
  if (!requireLogin()) return;
  const result = await api('POST', `/api/posts/${postId}/join`, { sessionId: getSessionId() });
  if (result.error) {
    alert(result.error);
    return;
  }
  openPostDetail(postId);
}

function renderComments(comments) {
  const container = document.getElementById('detail-comments');
  if (comments.length === 0) {
    container.innerHTML = '<div class="comments-title">댓글 0개</div>';
    return;
  }
  container.innerHTML = `
    <div class="comments-title">댓글 ${comments.length}개</div>
    ${comments.map(c => `
      <div class="comment-item">
        <div class="comment-top">
          <span class="comment-nickname">${escapeHtml(c.nickname)}</span>
          <span class="comment-time">${timeAgo(c.createdAt)}</span>
        </div>
        <div class="comment-text">${escapeHtml(c.content)}</div>
      </div>
    `).join('')}
  `;
}

function closeDetailModal() {
  document.getElementById('post-detail-modal').classList.remove('active');
  currentPostId = null;
  loadPosts();
}

async function likePost(id) {
  const result = await api('POST', `/api/posts/${id}/like`, { sessionId: getSessionId() });
  if (result.error) return;
  const countEl = document.getElementById(`like-count-${id}`);
  if (countEl) countEl.textContent = result.likes;
  const btn = countEl?.closest('.like-btn');
  if (btn) {
    btn.classList.toggle('liked', result.liked);
    btn.innerHTML = `${result.liked ? '❤️' : '🤍'} 좋아요 <span id="like-count-${id}">${result.likes}</span>`;
  }
}

async function submitComment(e) {
  e.preventDefault();
  if (!requireLogin()) return;
  if (!currentPostId) return;
  const input = document.getElementById('comment-input');
  const content = input.value.trim();
  if (!content) return;
  const result = await api('POST', `/api/posts/${currentPostId}/comments`, { content, sessionId: getSessionId() });
  if (result.error) return;
  input.value = '';
  openPostDetail(currentPostId);
}

// ===== 회원가입/로그인 시스템 =====
let currentAuthMode = 'login';

function getLoggedInUser() {
  const raw = localStorage.getItem('jobready_user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function setLoggedInUser(user) {
  localStorage.setItem('jobready_user', JSON.stringify(user));
}

function clearLoggedInUser() {
  localStorage.removeItem('jobready_user');
}

function updateNavAuth() {
  const user = getLoggedInUser();
  const authEl = document.getElementById('nav-auth');
  const userEl = document.getElementById('nav-user');
  const nameEl = document.getElementById('nav-user-name');
  if (user) {
    authEl.style.display = 'none';
    userEl.style.display = 'flex';
    nameEl.textContent = user.name + '님';
  } else {
    authEl.style.display = 'flex';
    userEl.style.display = 'none';
    nameEl.textContent = '';
  }
}

function requireLogin() {
  if (getLoggedInUser()) return true;
  openAuthModal('login');
  return false;
}

function openAuthModal(mode) {
  currentAuthMode = mode || 'login';
  switchAuthMode(currentAuthMode);
  document.getElementById('auth-modal').classList.add('active');
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.remove('active');
  clearAuthErrors();
  clearAuthInputs();
}

function switchAuthMode(mode) {
  currentAuthMode = mode;
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const title = document.getElementById('auth-modal-title');
  if (mode === 'login') {
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
    title.textContent = '로그인';
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
    title.textContent = '회원가입';
  }
  clearAuthErrors();
}

function clearAuthErrors() {
  document.querySelectorAll('.auth-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.auth-input').forEach(el => {
    el.classList.remove('input-error', 'input-valid');
  });
}

function clearAuthInputs() {
  ['login-name', 'login-phone', 'register-name', 'register-phone', 'register-birth'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function formatPhoneNumber(value) {
  const digits = value.replace(/\D/g, '').substring(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return digits.substring(0, 3) + '-' + digits.substring(3);
  return digits.substring(0, 3) + '-' + digits.substring(3, 7) + '-' + digits.substring(7);
}

function validatePhone(value) {
  return /^010-\d{4}-\d{4}$/.test(value);
}

function initAuthPhoneInputs() {
  ['login-phone', 'register-phone'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      const pos = el.selectionStart;
      const before = el.value;
      el.value = formatPhoneNumber(el.value);
      const diff = el.value.length - before.length;
      el.setSelectionRange(pos + diff, pos + diff);

      const errEl = document.getElementById(id + '-error');
      if (el.value.length === 0) {
        el.classList.remove('input-error', 'input-valid');
        errEl.textContent = '';
      } else if (validatePhone(el.value)) {
        el.classList.remove('input-error');
        el.classList.add('input-valid');
        errEl.textContent = '';
      } else {
        el.classList.remove('input-valid');
        el.classList.add('input-error');
        errEl.textContent = '010-XXXX-XXXX 형식으로 입력해주세요';
      }
    });
  });

  ['login-name', 'register-name'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      const errEl = document.getElementById(id + '-error');
      if (el.value.trim().length === 0) {
        el.classList.remove('input-valid');
        errEl.textContent = '';
      } else {
        el.classList.remove('input-error');
        el.classList.add('input-valid');
        errEl.textContent = '';
      }
    });
  });

  const birthEl = document.getElementById('register-birth');
  if (birthEl) {
    birthEl.addEventListener('change', () => {
      const errEl = document.getElementById('register-birth-error');
      if (birthEl.value) {
        birthEl.classList.remove('input-error');
        birthEl.classList.add('input-valid');
        errEl.textContent = '';
      }
    });
  }
}

async function handleLogin(e) {
  e.preventDefault();
  clearAuthErrors();
  const name = document.getElementById('login-name').value.trim();
  const phone = document.getElementById('login-phone').value.trim();
  let hasError = false;

  if (!name) {
    document.getElementById('login-name-error').textContent = '이름을 입력해주세요';
    document.getElementById('login-name').classList.add('input-error');
    hasError = true;
  }
  if (!validatePhone(phone)) {
    document.getElementById('login-phone-error').textContent = '010-XXXX-XXXX 형식으로 입력해주세요';
    document.getElementById('login-phone').classList.add('input-error');
    hasError = true;
  }
  if (hasError) return;

  const result = await api('POST', '/api/auth/login', { name, phone });
  if (result.error) {
    document.getElementById('login-server-error').textContent = result.error;
    return;
  }
  setLoggedInUser(result.user);
  updateNavAuth();
  closeAuthModal();
}

async function handleRegister(e) {
  e.preventDefault();
  clearAuthErrors();
  const name = document.getElementById('register-name').value.trim();
  const phone = document.getElementById('register-phone').value.trim();
  const birthDate = document.getElementById('register-birth').value;
  let hasError = false;

  if (!name) {
    document.getElementById('register-name-error').textContent = '이름을 입력해주세요';
    document.getElementById('register-name').classList.add('input-error');
    hasError = true;
  }
  if (!validatePhone(phone)) {
    document.getElementById('register-phone-error').textContent = '010-XXXX-XXXX 형식으로 입력해주세요';
    document.getElementById('register-phone').classList.add('input-error');
    hasError = true;
  }
  if (!birthDate) {
    document.getElementById('register-birth-error').textContent = '생년월일을 선택해주세요';
    document.getElementById('register-birth').classList.add('input-error');
    hasError = true;
  }
  if (hasError) return;

  const result = await api('POST', '/api/auth/register', { name, phone, birthDate });
  if (result.error) {
    document.getElementById('register-server-error').textContent = result.error;
    return;
  }
  setLoggedInUser(result.user);
  updateNavAuth();
  closeAuthModal();
}

function doLogout() {
  clearLoggedInUser();
  updateNavAuth();
}

// ===== 스크롤 애니메이션 =====
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.1 }
  );
  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
  });
}

// ===== 초기화 =====
document.addEventListener('DOMContentLoaded', () => {
  // Particle system
  const particleCanvas = document.getElementById('particle-canvas');
  if (particleCanvas) {
    const ps = new ParticleSystem(particleCanvas);
    ps.start();
  }

  // Typing effect
  startTypingEffect();

  // Scroll parallax
  initScrollParallax();

  // Daily quote
  renderDailyQuote();

  // Sectors
  renderSectors();

  // Calendar
  renderAlwaysExamBox();
  renderCalendarFilters();
  renderCalendar();
  renderUpcomingEvents();

  // Rankings
  loadRankings();

  // Community
  loadPosts();

  // Auth
  updateNavAuth();
  initAuthPhoneInputs();

  // Scroll animations
  initScrollAnimations();

  // Modal close on overlay click
  ['write-modal', 'post-detail-modal', 'cal-day-modal', 'cert-detail-modal', 'ranker-modal', 'auth-modal'].forEach(id => {
    document.getElementById(id).addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        if (id === 'write-modal') closeWriteModal();
        else if (id === 'post-detail-modal') closeDetailModal();
        else if (id === 'cal-day-modal') closeCalDayModal();
        else if (id === 'cert-detail-modal') closeCertDetailModal();
        else if (id === 'ranker-modal') closeRankerModal();
        else if (id === 'auth-modal') closeAuthModal();
      }
    });
  });
});
