import config from './function/config';
import { randomInt } from './function/main';

console.log('一言api: ', config.yiyan[randomInt(0, config.yiyan.length - 1)]);
fetch(config.yiyan[randomInt(0, config.yiyan.length - 1)])
    .then(response => response.json())
    // .then(data => console.log(data))
    .then(data => {
        let dom = document.querySelector('#yiyan') as HTMLElement;
        dom.innerHTML = `“ ${data.content}” —— ${data.author} 《${data.origin}》`;
    })
    .catch(error => {
        console.error('一言读取出现错误:', error);
    });
