// Pages Function: /api/comments 及子路由
// /api/comments           → GET(list) POST(create)
// /api/comments/:id/like  → POST(toggle like)
// /api/comments/:id       → DELETE(admin delete)

const ADMIN_PASSWORD_HASH = 'e73a17a28343de77ae15d872d38e47689415df2effd35f20d4e9b2ced6ca67fb';
const URL_REGEX = /https?:\/\/|www\.[a-zA-Z0-9]|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\/[^\s]*/;
function containsUrl(text) { return URL_REGEX.test(text); }

function cors(headers = {}) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-password',
    ...headers,
  };
}
function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: cors({ 'Content-Type': 'application/json' }) });
}
async function sha256(m) {
  const buf = new TextEncoder().encode(m);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// 解析子路径: /api/comments/123/like → {id: 123, action: 'like'}
function parsePath(pathname) {
  const parts = pathname.replace(/^\/api\/comments\/?/, '').split('/').filter(Boolean);
  if (parts.length === 0) return { type: 'collection' };
  if (parts.length === 1 && /^\d+$/.test(parts[0])) return { type: 'delete', id: parseInt(parts[0]) };
  if (parts.length === 2 && /^\d+$/.test(parts[0]) && parts[1] === 'like') return { type: 'like', id: parseInt(parts[0]) };
  return { type: 'unknown' };
}

export async function onRequest({ request, env }) {
  // 如果 DB 绑定未配置，返回明确错误
  if (!env.DB) {
    return json({ error: 'Database not configured' }, 500);
  }

  const url = new URL(request.url);
  const method = request.method;
  const parsed = parsePath(url.pathname);

  if (method === 'OPTIONS') return new Response(null, { headers: cors() });

  try {
    // === 列表查询 ===
    if (method === 'GET' && parsed.type === 'collection') {
      const elementId = url.searchParams.get('elementId');
      if (!elementId) return json({ error: '缺少 elementId' }, 400);
      const { results } = await env.DB.prepare(
        'SELECT * FROM comments WHERE elementId = ? ORDER BY createdAt DESC LIMIT 100'
      ).bind(elementId).all();
      return json(results || []);
    }

    // === 发布评论 ===
    if (method === 'POST' && parsed.type === 'collection') {
      const body = await request.json();
      const { elementId, nickname, content } = body;
      if (!elementId || !nickname || !content) return json({ error: '缺少必填字段' }, 400);
      if (nickname.length > 20) return json({ error: '昵称过长' }, 400);
      if (content.length > 1000) return json({ error: '评论过长' }, 400);
      if (containsUrl(content)) return json({ error: '评论不能包含网址链接' }, 400);

      const { total } = await env.DB.prepare(
        'SELECT COUNT(*) as total FROM comments WHERE elementId = ?'
      ).bind(elementId).first();
      if (total >= 10000) {
        await env.DB.prepare(
          'DELETE FROM comments WHERE id IN (SELECT id FROM comments WHERE elementId = ? AND likes < 10 ORDER BY createdAt ASC LIMIT ?)'
        ).bind(elementId, total - 9999).run();
      }

      const result = await env.DB.prepare(
        'INSERT INTO comments (elementId, nickname, content, likes, likedBy, createdAt) VALUES (?, ?, ?, 0, ?, ?)'
      ).bind(elementId, nickname, content, '[]', Date.now()).run();

      return json({ success: true, id: result.meta?.last_row_id }, 201);
    }

    // === 点赞 ===
    if (method === 'POST' && parsed.type === 'like') {
      const body = await request.json();
      const { uid } = body;
      if (!uid) return json({ error: '缺少 uid' }, 400);

      const row = await env.DB.prepare('SELECT * FROM comments WHERE id = ?').bind(parsed.id).first();
      if (!row) return json({ error: '评论不存在' }, 404);

      let likedBy = [];
      try { likedBy = JSON.parse(row.likedBy || '[]'); } catch {}
      const idx = likedBy.indexOf(uid);

      if (idx >= 0) {
        likedBy.splice(idx, 1);
        await env.DB.prepare('UPDATE comments SET likes = ?, likedBy = ? WHERE id = ?')
          .bind(Math.max(0, row.likes - 1), JSON.stringify(likedBy), parsed.id).run();
      } else {
        likedBy.push(uid);
        await env.DB.prepare('UPDATE comments SET likes = ?, likedBy = ? WHERE id = ?')
          .bind(row.likes + 1, JSON.stringify(likedBy), parsed.id).run();
      }
      return json({ success: true });
    }

    // === 删除 ===
    if (method === 'DELETE' && parsed.type === 'delete') {
      const password = request.headers.get('x-admin-password') || '';
      const hash = await sha256(password);
      if (hash !== ADMIN_PASSWORD_HASH) return json({ error: '密码错误' }, 403);

      await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(parsed.id).run();
      return json({ success: true });
    }

    return json({ error: 'Not Found' }, 404);
  } catch (err) {
    console.error('API Error:', err.message);
    return json({ error: '服务器内部错误' }, 500);
  }
}
