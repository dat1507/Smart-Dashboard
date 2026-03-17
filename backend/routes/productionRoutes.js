const express = require('express');
const router = express.Router();
const productionController = require('../controllers/productionController');

// API 1: Lấy toàn bộ
router.get('/production', productionController.getAllProduction);

// API 2: Lấy theo ID máy (Ví dụ: /api/machine/Line_01)
router.get('/machine/:id', productionController.getMachineById);

// API 3: Lấy KPI
router.get('/kpi', productionController.getKPIStats);

module.exports = router;