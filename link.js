const YML = require('yamljs')
const fs = require('fs')

let ls   = [],
    data = YML.parse(fs.readFileSync('source/_data/link.yml').toString().replace(/(?<=rss:)\s*\n/g, ' ""\n'));

data.forEach((e, i) => {
    ls = ls.concat(e.link_list)  //获取link.yml文件内所有的数据
});
fs.writeFileSync('source/link.json', `{"link_list": ${JSON.stringify(ls)},"length":${ls.length}}`)
console.log('友链文件已生成。');
