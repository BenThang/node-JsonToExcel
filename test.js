const fs = require('fs');
const xlsx = require('node-xlsx');
const nodeExcel = require('excel-export');
const config = require('./config');

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

const test = JSON.parse(JSON.stringify(require(`./${config.config.输入数据文件名}.json`)));
const Jsondata = test.data[config.config.生成表格数据类型];
let Keys = Object.keys(Jsondata.y_axis[0]);


const xData = Jsondata.x_axis.map((item, i) => 
     new Date(1000 * item).Format("yyyy-MM-dd hh:mm:ss")
);
const yData = Jsondata.y_axis.map((item, i) => {

    if(Keys.includes('ratio')){
        item.ratio = (item.ratio * 100).toFixed(3)+'%';
    }
});

console.log(yData);
const testArray = Jsondata.x_axis.map((item, i) => 
        [new Date(1000 * item).Format("yyyy-MM-dd hh:mm:ss"),Jsondata.y_axis[i].value,(Jsondata.y_axis[i].ratio * 100).toFixed(3)+'%']
)


let conf = {} // excel配置
conf.name = config.config.工作表名称; 
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
let path = `${__dirname}/生成文件/${config.config.生成表格文件名}.xlsx`
fs.writeFile(path, result, 'binary', (err) => {
    err ? console.log(err) : null
})

