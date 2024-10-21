const http = require('http');
let books = [];
let bookId = 1;

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/books') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const book = JSON.parse(body);
      book.book_id = bookId++;
      books.push(book);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Buku berhasil ditambahkan', book_id: book.book_id }));
    });
  } else if (req.method === 'GET' && req.url === '/api/books') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(books));
  } else if (req.method === 'GET' && req.url.match(/\/api\/books\/\d+/)) {
    const id = parseInt(req.url.split('/')[3]);
    const book = books.find(b => b.book_id === id);
    if (book) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(book));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Buku tidak ditemukan' }));
    }
  } else if (req.method === 'PUT' && req.url.match(/\/api\/books\/\d+/)) {
    const id = parseInt(req.url.split('/')[3]);
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const update = JSON.parse(body);
      const bookIndex = books.findIndex(b => b.book_id === id);
      if (bookIndex !== -1) {
        books[bookIndex] = { ...books[bookIndex], ...update };
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Buku berhasil diperbarui' }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Buku tidak ditemukan' }));
      }
    });
  } else if (req.method === 'DELETE' && req.url.match(/\/api\/books\/\d+/)) {
    const id = parseInt(req.url.split('/')[3]);
    const bookIndex = books.findIndex(b => b.book_id === id);
    if (bookIndex !== -1) {
      books.splice(bookIndex, 1);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Buku berhasil dihapus' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Buku tidak ditemukan' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Endpoint tidak ditemukan' }));
  }
});

server.listen(3004, () => {
  console.log('Server running on port 3004');
});
