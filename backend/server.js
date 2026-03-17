const express = require('express');
const cors = require('cors');
const productionRoutes = require('./routes/productionRoutes');

const app = express();
const PORT = 5000;

// Middleware cho phép React truy cập API
app.use(cors());
// Middleware cho phép xử lý dữ liệu JSON trong request body
app.use(express.json());

// Gắn các Routes vào tiền tố /api/production
app.use('/api', productionRoutes);

// Home route để kiểm tra server
app.get('/', (req, res) => {
    res.send('<h1>Bosch HcP - Smart Monitoring API is running</h1>');
});

app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});