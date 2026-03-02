const router = require('express').Router();
const { roadmapsDb, saveRoadmaps, getNickname } = require('../utils/dataStore');

// ===== 로드맵 저장 API =====
router.post('/save', (req, res) => {
  const { sessionId, roadmapData } = req.body;
  if (!sessionId || !roadmapData) {
    return res.status(400).json({ error: '필수 정보가 누락되었습니다' });
  }
  roadmapsDb.users[sessionId] = {
    nickname: getNickname(sessionId),
    data: roadmapData,
    updatedAt: new Date().toISOString()
  };
  saveRoadmaps();
  res.json({ success: true });
});

// ===== 로드맵 불러오기 API =====
router.get('/load', (req, res) => {
  const { sessionId } = req.query;
  if (!sessionId) {
    return res.status(400).json({ error: 'sessionId가 필요합니다' });
  }
  const userRoadmap = roadmapsDb.users[sessionId];
  if (!userRoadmap) {
    return res.json({ exists: false });
  }
  res.json({ exists: true, ...userRoadmap });
});

module.exports = router;
