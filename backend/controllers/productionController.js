const dataService = require('../services/dataService');

// API 1: Trả về toàn bộ dataset
const getAllProduction = async (req, res) => {
    try {
        const data = await dataService.getDataFromCSV();
        res.status(200).json({ success: true, total: data.length, data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// API 2: Trả về dữ liệu của một máy cụ thể (Dùng params :id)
const getMachineById = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ URL (ví dụ: Line_01)
        const data = await dataService.getDataFromCSV();
        const machineData = data.filter(item => item.Machine_ID === id);
        
        res.status(200).json({ 
            success: true, 
            machine_id: id, 
            count: machineData.length, 
            data: machineData 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// API 3: Trả về các chỉ số KPI (Sử dụng logic tính toán)
const getKPIStats = async (req, res) => {
    try {
        const data = await dataService.getDataFromCSV();
        
        const totalOutput = data.reduce((sum, item) => sum + parseInt(item.Output), 0);
        const totalDefects = data.reduce((sum, item) => sum + parseInt(item.Defects), 0);
        
        // Tính toán các tỷ lệ
        const production_rate = (totalOutput / data.length).toFixed(2);
        const defect_rate = ((totalDefects / totalOutput) * 100).toFixed(2) + "%";
        // OEE đơn giản = (Sản phẩm đạt / Tổng sản phẩm) * 100
        const oee = (((totalOutput - totalDefects) / totalOutput) * 100).toFixed(2) + "%";

        res.status(200).json({
            success: true,
            kpi: {
                production_rate,
                defect_rate,
                oee
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllProduction, getMachineById, getKPIStats };