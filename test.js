const fs = require('fs');
const xlsx = require('node-xlsx');
const nodeExcel = require('excel-export');

Date.prototype.Format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1,
      "d+": this.getDate(),
      "h+": this.getHours(),
      "m+": this.getMinutes(),
      "s+": this.getSeconds(), 
      "q+": Math.floor((this.getMonth() + 3) / 3),
      "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  };

const test = JSON.parse(JSON.stringify(require('./test.json')));

let testArray = new Array();
for (let i = 0; i < test.data[100].x_axis.length; i++) {
    let list = [];
    list.push(new Date(1000 * test.data[100].x_axis[i]).Format("yyyy-MM-dd hh:mm:ss"));
    list.push(test.data[100].y_axis[i].value);
    list.push((test.data[100].y_axis[i].ratio * 100).toFixed(3)+'%');
    testArray.push(list);
}
console.log(testArray);
// 导出Excel
let conf = {} // excel配置
conf.name = 'sheet' //表格名
// 列名和类型
conf.cols = [
    {
        caption: '时间',
        type: 'string',
    },
    {
        caption: '数值',
        type: 'number',
    },
    {
        caption: '百分比',
        type: 'string',
    },
]

conf.rows = testArray;
let result = nodeExcel.execute(conf)
let path = `${__dirname}/输出文件.xlsx`
fs.writeFile(path, result, 'binary', (err) => {
    err ? console.log(err) : null
})

