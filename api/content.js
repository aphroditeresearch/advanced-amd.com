// GET /api/content → announcements, homework, breakdowns and lessons for the signed-in member.
// Videos and notes for chapters the member's roles don't unlock are left out, so a locked
// lesson's video link never reaches their browser.
const { readSession, isAdmin, loadContent, CHAPTER_ROLES, json } = require('./_lib');

module.exports = async (req, res) => {
  const s = readSession(req);
  if (!s) return json(res, 401, { error: 'signed_out' });

  let content = null;
  try { content = await loadContent(); } catch (e) { return json(res, 502, { error: 'storage' }); }
  if (!content) return json(res, 200, { content: null });   // nothing saved yet: the page uses its built-in defaults

  const admin = isAdmin(s);
  const roles = s.roles || [];
  const now = Date.now();
  const out = Object.assign({}, content);

  out.curriculum = (content.curriculum || []).map((ch) => {
    const role = ch.role || CHAPTER_ROLES[ch.id] || null;
    const open = admin || !role || roles.includes(role);
    return Object.assign({}, ch, {
      role,
      lessons: (ch.lessons || []).map((l) => (open ? l : { id: l.id, title: l.title })),
    });
  });
  out.announcements = (content.announcements || []).filter((a) => !a.expires || Date.parse(a.expires) > now);

  json(res, 200, { content: out });
};
