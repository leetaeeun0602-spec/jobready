const router = require('express').Router();
const { communityDb, savePosts, getNickname } = require('../utils/dataStore');

// ===== Posts API =====

router.get('/posts', (req, res) => {
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

router.get('/posts/:id', (req, res) => {
  const post = communityDb.posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: '게시글을 찾을 수 없습니다' });
  res.json({
    ...post,
    currentMembers: (post.joinedMembers || []).length,
    likedBy: post.likedBy
  });
});

router.post('/posts', (req, res) => {
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

router.post('/posts/:id/like', (req, res) => {
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

router.post('/posts/:id/comments', (req, res) => {
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
router.post('/posts/:id/join', (req, res) => {
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

module.exports = router;
