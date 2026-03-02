const router = require('express').Router();
const { usersDb, saveUsers } = require('../utils/dataStore');

// ===== Auth API =====
router.post('/register', (req, res) => {
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

router.post('/login', (req, res) => {
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

module.exports = router;
