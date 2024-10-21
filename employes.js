const http = require('http');
let employees = [];
let employeeId = 1;

const server = http.createServer((req, res) => {
  if (req.method === 'DELETE' && req.url.match(/\/api\/employees\/\d+/)) {
    const id = parseInt(req.url.split('/')[3]);
    const employeeIndex = employees.findIndex(e => e.employee_id === id);
    
    if (employeeIndex !== -1) {
      employees.splice(employeeIndex, 1);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Karyawan berhasil dihapus' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Karyawan tidak ditemukan' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Endpoint tidak ditemukan' }));
  }
});

server.listen(3003, () => {
  console.log('Server running on port 3003');
});
