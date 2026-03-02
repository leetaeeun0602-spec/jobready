const express = require('express');
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

app.listen(PORT, () => {
  console.log(`==========================================`);
  console.log(`  🚀 JobReady 서버 실행 중`);
  console.log(`  📍 http://localhost:${PORT}`);
  console.log(`==========================================`);
});
