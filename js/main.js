console.log('made by FBIK.');

let $ = mdui.$;

// 页面内容配置
let page = {
    name: ['index', 'welcome'],
    changer: new mdui.Tab('#page-changer'),
    lab: new mdui.Fab('#fab-wrapper')
}

// 随机整数生成器
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);


// 右上角mdui menu主题色更换按钮
let darkModeState = window.matchMedia('(prefers-color-scheme:dark)').matches;
$('#theme-changer').on('click', () => {
    if ($('body').hasClass('mdui-theme-layout-auto')) $('body').removeClass('mdui-theme-layout-auto');
    if (darkModeState) {
        if ($('body').hasClass('mdui-theme-layout-dark')) $('body').removeClass('mdui-theme-layout-dark');
        $('body').addClass('mdui-theme-layout-light');
        $('#theme-changer-icon').text('brightness_high');
    } else {
        if ($('body').hasClass('mdui-theme-layout-light')) $('body').removeClass('mdui-theme-layout-light');
        $('body').addClass('mdui-theme-layout-dark');
        $('#theme-changer-icon').text('brightness_3');
    };
    darkModeState = !darkModeState;
});


// 一言
fetch('./js/json/yiyan.json')
    .then(response => response.json())
    .then(data => $('#yiyan').text(data[randomInt(0, data.length)]))
    .catch(error => {
        console.error('一言读取出现错误:', error);
    });


/* 使用js调用mdui tab选项卡, 实现页面切换 */
page.name.forEach((element, index) => {
    $('#link-' + element).on('click', () => page.changer.show(index));
});

