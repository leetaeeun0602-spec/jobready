const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// ===== Route Mounting =====
const authRouter = require('./routes/auth');
const communityRouter = require('./routes/community');
const attendanceRouter = require('./routes/attendance');
const diagnosisRouter = require('./routes/diagnosis');
const analysisRouter = require('./routes/analysis');
const roadmapRouter = require('./routes/roadmap');

app.use('/api/auth', authRouter);
app.use('/api', communityRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/diagnosis', diagnosisRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/roadmap', roadmapRouter);

// ===== Contact API =====
const {
  contactsDb, saveContacts,
  createBackup, getStats, printStartupStatus, verifyAllFiles
} = require('./utils/dataStore');

app.post('/api/contact', (req, res) => {
  const { name, email, type, message } = req.body;
  if (!name || !email || !type || !message) {
    return res.status(400).json({ error: '모든 항목을 입력해주세요' });
  }

  contactsDb.push({
    id: Date.now(),
    name,
    email,
    type,
    message,
    createdAt: new Date().toISOString()
  });

  saveContacts();
  res.json({ success: true });
});

// ===== Admin API =====
app.post('/api/admin/backup', (req, res) => {
  try {
    const backupPath = createBackup();
    const stats = getStats();
    res.json({ success: true, path: backupPath, timestamp: new Date().toISOString(), stats });
  } catch (e) {
    res.status(500).json({ error: '백업 실패: ' + e.message });
  }
});

app.get('/api/admin/stats', (req, res) => {
  res.json(getStats());
});

// ===== Server Start =====
app.listen(PORT, () => {
  console.log(`==========================================`);
  console.log(`  🚀 JobReady 서버 실행 중`);
  console.log(`  📍 http://localhost:${PORT}`);
  verifyAllFiles();
  printStartupStatus();
  console.log(`==========================================`);
});
