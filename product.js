const http = require('http');
let products = [];
let productId = 1;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/products') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const product = JSON.parse(body);
      product.product_id = productId++;
      products.push(product);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Produk berhasil ditambahkan', product_id: product.product_id }));
    });
  } else if (req.method === 'GET' && req.url === '/api/products') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(products));
  } else if (req.method === 'GET' && req.url.match(/\/api\/products\/\d+/)) {
    const id = parseInt(req.url.split('/')[3]);
    const product = products.find(p => p.product_id === id);
    if (product) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(product));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Produk tidak ditemukan' }));
    }
  } else if (req.method === 'PUT' && req.url.match(/\/api\/products\/\d+/)) {
    const id = parseInt(req.url.split('/')[3]);
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const update = JSON.parse(body);
      const productIndex = products.findIndex(p => p.product_id === id);
      if (productIndex !== -1) {
        products[productIndex] = { ...products[productIndex], ...update };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Produk berhasil diperbarui' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Produk tidak ditemukan' }));
      }
    });
  } else if (req.method === 'DELETE' && req.url.match(/\/api\/products\/\d+/)) {
    const id = parseInt(req.url.split('/')[3]);
    const productIndex = products.findIndex(p => p.product_id === id);
    if (productIndex !== -1) {
      products.splice(productIndex, 1);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Produk berhasil dihapus' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Produk tidak ditemukan' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Endpoint tidak ditemukan' }));
  }
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
