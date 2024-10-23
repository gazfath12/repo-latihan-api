const http = require("http");// membuar http mengambil 
let products = [];
let productId = 1;
// memebuat server
const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/products") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const product = JSON.parse(body);
      product.product_id = productId++;
      products.push(product);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Produk berhasil ditambahkan",
          product_id: product.product_id,
        })
      );
    });
    
  } else if (req.method === "GET" && req.url === "/api/products") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(products));
  } 
  // match menyamakan d adalah number
  else if (req.method === "GET" && req.url.match(/\/api\/products\/\d+/)) {
    // url di pecah
    const id = parseInt(req.url.split("/")[3]);
    // mencari produck berdasarkan idnya 
    const product = products.find((p) => p.product_id === id);
    // jika produk ada maka merespon klao ada object kalo gk ada null
    if (product) {
      //menulis header untuk menyatakan berhasil dengan port 200
      res.writeHead(200, { "Content-Type": "application/json" }); // tipe dari contenya dalam bentuk json
      // karena tipe data dalam end adalah string 
      res.end(JSON.stringify(product)); // mersepon menampilkan produk dalam bentuk string
      // tidak boleh ada end lagi
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      // perintah tidak di temukan dengan message 404
      res.end(JSON.stringify({ message: "Produk tidak ditemukan" }));
    }
    // untuk kemungkinan lain jika tidak berjalan if diatas tidak berjalan  
    // method untuk update /ketika salah satu bernilai true maka menjalankan salah satu
  } else if (req.method === "PUT" && req.url.match(/\/api\/products\/\d+/)) { //digital = number
    // mengubah string ke number bilangan bulat
    const id = parseInt(req.url.split("/")[3]);//split memecah berdasarkan / setelah split array index ke-3
    // untuk menyimpan data dari body
    let body = "";
    // on memantau / listener menjalankan function chunk seperti biner
    req.on("data", (chunk) => {
      // += untuk menambah nilai mengubah menjadi string semua disimpan di body
      body += chunk.toString();
    });
    // ketika proses selesai dan menjalankan arrow function
    req.on("end", () => {
      // dari string ke object
      const update = JSON.parse(body);
      // untuk mencari index berdasarkan produkid 
      const productIndex = products.findIndex((p) => p.product_id === id);
      //kalau gk ketemu maka hasilnya -1 kalau ada 0 -> 3
      if (productIndex !== -1) {
        // mengubah data produk berdasarkan index
        products[productIndex] = { ...products[productIndex], ...update }; //... untuk mengmbil nialai sebelumnya berdasarkan indexnya
        // mengirimkan sesuatu yang tersembunyi 200 itu suksesfully
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Produk berhasil diperbarui" })); // tidakbisa ditampilkan dalam
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Produk tidak ditemukan" }));
      }
    });
  } else if (req.method === "DELETE" && req.url.match(/\/api\/products\/\d+/)) {
    const id = parseInt(req.url.split("/")[3]);
    const productIndex = products.findIndex((p) => p.product_id === id);
    if (productIndex !== -1) {
      // splice = index berapa yang akan dihilangkan index depannya yang dihapus
      products.splice(productIndex, 1);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Produk berhasil dihapus" })); 
      // harus menyimpan dalam format string
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      // tidak di temukan
      res.end(JSON.stringify({ message: "Produk tidak ditemukan" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Endpoint tidak ditemukan" }));
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
