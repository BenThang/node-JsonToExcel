const fs = require('fs');
const dayjs = require('dayjs');
// const xlsx = require('node-xlsx');
// const nodeExcel = require('excel-export');
// const config = require('./config');

const handler = {
    0: (s) => s || '', 
    10: (s) => {
        if (!s) {
            return null;
        }
        const date = new Date(s);
        return dayjs(date).format('YYYY-MM-DD HH:mm');
    },
};

const csvData = fs.readFileSync('./test.csv', 'utf8');
const csvRows = csvData.split(/[\r\n|\n]/)
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .slice(1)
    .map((s) => s.split(',').map((d, i) => {
        const fn = handler[i];
        if (fn) {
            return fn(d);
        }
        return null;
    }));

console.log(csvRows);



