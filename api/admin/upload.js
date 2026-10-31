// Admin only. POST /api/admin/upload → lets the admin panel upload a video straight from the
// browser to Vercel Blob (large files never pass through this function).
// Needs a Vercel Blob store connected to the project (it adds BLOB_READ_WRITE_TOKEN).
const { handleUpload } = require('@vercel/blob/client');
const { readSession, isAdmin, json } = require('../_lib');

const MAX_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB per file

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return json(res, 405, { error: 'method' }); }
  if (!process.env.BLOB_READ_WRITE_TOKEN) return json(res, 503, { error: 'no_blob_store' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body || !body.type) return json(res, 400, { error: 'bad_body' });

  // Only a signed-in admin may ask for an upload token. (Completion notices from Vercel Blob
  // are signed by Blob itself and checked inside handleUpload.)
  if (body.type === 'blob.generate-client-token') {
    const s = readSession(req);
    if (!s) return json(res, 401, { error: 'signed_out' });
    if (!isAdmin(s)) return json(res, 403, { error: 'not_admin' });
  }

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!/^(lessons|breakdowns)\//.test(pathname)) throw new Error('Uploads go in lessons/ or breakdowns/');
        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-m4v'],
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        };
      },
    });
    json(res, 200, result);
  } catch (e) {
    json(res, 400, { error: String((e && e.message) || e) });
  }
};
