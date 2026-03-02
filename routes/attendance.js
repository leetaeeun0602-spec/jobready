const router = require('express').Router();
const { attendanceDb, saveAttendance, getNickname, serverTodayStr, calcStreak } = require('../utils/dataStore');

// ===== Attendance API =====
router.post('/checkin', (req, res) => {
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

router.get('/rankings', (req, res) => {
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

module.exports = router;
