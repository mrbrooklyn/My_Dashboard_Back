const http = require('http');
const mongoose = require('mongoose');
const { URL } = require('url');

// เชื่อม MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/my-dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// สร้าง Schema & Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String
});
const User = mongoose.model('users', userSchema);

// helper function อ่าน body
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body ? JSON.parse(body) : {}));
    req.on('error', err => reject(err));
  });
}

// สร้าง HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const path = parsedUrl.pathname;
  const method = req.method;

  // CREATE
  if (path === '/users' && method === 'POST') {
    const data = await getRequestBody(req);
    const user = new User(data);
    await user.save();
    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(user));
  }

  // READ ALL
  if (path === '/users' && method === 'GET') {
    const users = await User.find();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(users));
  }

  // READ ONE / UPDATE / DELETE
  const idMatch = path.match(/^\/users\/([a-f0-9]{24})$/); // match Mongo ObjectId
  if (idMatch) {
    const id = idMatch[1];

    // READ ONE
    if (method === 'GET') {
      const user = await User.findById(id);
      res.writeHead(user ? 200 : 404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(user || { message: 'User not found' }));
    }

    // UPDATE
    if (method === 'PUT') {
      const data = await getRequestBody(req);
      const user = await User.findByIdAndUpdate(id, data, { new: true });
      res.writeHead(user ? 200 : 404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(user || { message: 'User not found' }));
    }

    // DELETE
    if (method === 'DELETE') {
      const user = await User.findByIdAndDelete(id);
      res.writeHead(user ? 200 : 404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(user ? { message: 'User deleted' } : { message: 'User not found' }));
    }
  }

  // ถ้า path ไม่ตรง
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Not found' }));
});

// start server
const PORT = 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));