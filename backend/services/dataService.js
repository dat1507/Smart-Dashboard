const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const getDataFromCSV = () => {
    return new Promise((resolve, reject) => {
        const results = [];
        const csvFilePath = path.join(__dirname, '../data/production_data.csv');

        // Kiểm tra file có tồn tại không trước khi đọc
        if (!fs.existsSync(csvFilePath)) {
            return reject(new Error("File production_data.csv không tồn tại trong thư mục data!"));
        }

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

module.exports = { getDataFromCSV };