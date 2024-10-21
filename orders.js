const http = require('http');
let orders = [];
let orderId = 1;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/orders') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const order = JSON.parse(body);
      order.order_id = orderId++;
      orders.push(order);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Pesanan berhasil ditambahkan', order_id: order.order_id }));
    });
  } else if (req.method === 'GET' && req.url === '/api/orders') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(orders));
  } else if (req.method === 'GET' && req.url.match(/\/api\/orders\/\d+/)) {
    const id = parseInt(req.url.split('/')[3]);
    const order = orders.find(o => o.order_id === id);
    if (order) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(order));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Pesanan tidak ditemukan' }));
    }
  } else if (req.method === 'PUT' && req.url.match(/\/api\/orders\/\d+/)) {
    const id = parseInt(req.url.split('/')[3]);
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const update = JSON.parse(body);
      const orderIndex = orders.findIndex(o => o.order_id === id);
      if (orderIndex !== -1) {
        orders[orderIndex] = { ...orders[orderIndex], ...update };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Pesanan berhasil diperbarui' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Pesanan tidak ditemukan' }));
      }
    });
  } else if (req.method === 'DELETE' && req.url.match(/\/api\/orders\/\d+/)) {
    const id = parseInt(req.url.split('/')[3]);
    const orderIndex = orders.findIndex(o => o.order_id === id);
    if (orderIndex !== -1) {
      orders.splice(orderIndex, 1);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Pesanan berhasil dihapus' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Pesanan tidak ditemukan' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Endpoint tidak ditemukan' }));
  }
});

server.listen(3002, () => {
  console.log('Server running on port 3002');
});
