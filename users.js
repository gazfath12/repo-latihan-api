const http = require('http');
let users = [];
let userId = 1;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/users') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const user = JSON.parse(body);
      user.user_id = userId++;
      users.push(user);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Pengguna berhasil ditambahkan', user_id: user.user_id }));
    });
  } else if (req.method === 'GET' && req.url === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } else if (req.method === 'GET' && req.url.match(/\/api\/users\/\d+/)) {
    const id = parseInt(req.url.split('/')[3]);
    const user = users.find(u => u.user_id === id);
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Pengguna tidak ditemukan' }));
    }
  } else if (req.method === 'PUT' && req.url.match(/\/api\/users\/\d+/)) {
    const id = parseInt(req.url.split('/')[3]);
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const update = JSON.parse(body);
      const userIndex = users.findIndex(u => u.user_id === id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...update };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Pengguna berhasil diperbarui' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Pengguna tidak ditemukan' }));
      }
    });
  } else if (req.method === 'DELETE' && req.url.match(/\/api\/users\/\d+/)) {
    const id = parseInt(req.url.split('/')[3]);
    const userIndex = users.findIndex(u => u.user_id === id);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Pengguna berhasil dihapus' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Pengguna tidak ditemukan' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Endpoint tidak ditemukan' }));
  }
});

server.listen(3001, () => {
  console.log('Server running on port 3001');
});
