// 元素世界 - 评论 API Worker
// 部署在 Cloudflare Workers，D1 数据库存储

const ADMIN_PASSWORD_HASH = 'e73a17a28343de77ae15d872d38e47689415df2effd35f20d4e9b2ced6ca67fb';

// 链接检测
const URL_REGEX = /https?:\/\/|www\.[a-zA-Z0-9]|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\/[^\s]*/;

function containsUrl(text) {
  return URL_REGEX.test(text);
}

// SHA-256 哈希
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// CORS 头
function cors(headers) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-password',
    ...headers,
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: cors({ 'Content-Type': 'application/json' }),
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS 预检
    if (method === 'OPTIONS') {
      return new Response(null, { headers: cors() });
    }

    try {
      // GET /comments?elementId=xxx
      if (method === 'GET' && path === '/comments') {
        const elementId = url.searchParams.get('elementId');
        if (!elementId) return json({ error: '缺少 elementId' }, 400);

        const { results } = await env.DB.prepare(
          'SELECT * FROM comments WHERE elementId = ? ORDER BY createdAt DESC LIMIT 100'
        ).bind(elementId).all();

        return json(results || []);
      }

      // POST /comments
      if (method === 'POST' && path === '/comments') {
        const body = await request.json();
        const { elementId, nickname, content } = body;

        if (!elementId || !nickname || !content) {
          return json({ error: '缺少必填字段' }, 400);
        }
        if (nickname.length > 20) {
          return json({ error: '昵称过长' }, 400);
        }
        if (content.length > 1000) {
          return json({ error: '评论过长' }, 400);
        }
        if (containsUrl(content)) {
          return json({ error: '评论不能包含网址链接' }, 400);
        }

        // 检查 1 万条上限
        const { total } = await env.DB.prepare(
          'SELECT COUNT(*) as total FROM comments WHERE elementId = ?'
        ).bind(elementId).first();

        if (total >= 10000) {
          const toDelete = total - 9999;
          // 删除最旧的 <10 赞评论
          await env.DB.prepare(
            'DELETE FROM comments WHERE id IN (SELECT id FROM comments WHERE elementId = ? AND likes < 10 ORDER BY createdAt ASC LIMIT ?)'
          ).bind(elementId, toDelete).run();
        }

        const result = await env.DB.prepare(
          'INSERT INTO comments (elementId, nickname, content, likes, likedBy, createdAt) VALUES (?, ?, ?, 0, ?, ?)'
        ).bind(elementId, nickname, content, '[]', Date.now()).run();

        return json({ success: true, id: result.meta?.last_row_id }, 201);
      }

      // POST /comments/:id/like
      const likeMatch = path.match(/^\/comments\/(\d+)\/like$/);
      if (method === 'POST' && likeMatch) {
        const id = parseInt(likeMatch[1]);
        const body = await request.json();
        const { uid } = body;

        if (!uid) return json({ error: '缺少 uid' }, 400);

        const row = await env.DB.prepare('SELECT * FROM comments WHERE id = ?').bind(id).first();
        if (!row) return json({ error: '评论不存在' }, 404);

        let likedBy = [];
        try { likedBy = JSON.parse(row.likedBy || '[]'); } catch {}
        const idx = likedBy.indexOf(uid);

        if (idx >= 0) {
          // 取消点赞
          likedBy.splice(idx, 1);
          await env.DB.prepare('UPDATE comments SET likes = ?, likedBy = ? WHERE id = ?')
            .bind(Math.max(0, row.likes - 1), JSON.stringify(likedBy), id).run();
        } else {
          // 点赞
          likedBy.push(uid);
          await env.DB.prepare('UPDATE comments SET likes = ?, likedBy = ? WHERE id = ?')
            .bind(row.likes + 1, JSON.stringify(likedBy), id).run();
        }

        return json({ success: true });
      }

      // DELETE /comments/:id (管理员)
      if (method === 'DELETE' && path.startsWith('/comments/')) {
        const id = parseInt(path.split('/')[2]);
        if (!id) return json({ error: '缺少评论 ID' }, 400);

        const password = request.headers.get('x-admin-password') || '';
        const hash = await sha256(password);

        if (hash !== ADMIN_PASSWORD_HASH) {
          return json({ error: '密码错误' }, 403);
        }

        await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      return json({ error: 'Not Found' }, 404);
    } catch (err) {
      console.error('Worker Error:', err);
      return json({ error: '服务器内部错误' }, 500);
    }
  },
};
