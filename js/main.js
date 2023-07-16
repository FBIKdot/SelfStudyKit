console.log('made by FBIK.');

let $ = mdui.$;

/*
 * 数据处理函数声明 起
 */

/**
 * @description: 随机生成一定范围的整数 
 * @param {Number} min=0 - 最小值, 整数
 * @param {Number} max - 最大值, 整数
 * @return {Number} - 随机生成的整数
 */
const randomInt = (min = 0, max) => Math.floor(Math.random() * (max - min + 1) + min);

/*
 * 数据处理函数声明 终
 */

/*
 * 核心功能 起
 */

// 页面内容配置
let page = {
    name: ['index', 'welcome'],
    changer: new mdui.Tab('#page-changer'),
    lab: new mdui.Fab('#fab-wrapper'),
    fn: {}
};
console.log(page.lab);

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

// 使用js调用mdui tab选项卡, 实现页面切换
page.name.forEach((element, index) => {
    $('#link-' + element).on('click', () => page.changer.show(index));
});

//* 悬浮按钮 mdui-fab 逻辑 起
$('#page-changer').on('change.mdui.tab', event => {
    switch (event._detail.index) {
        case 1:
            page.lab.show();
            break;
        default:
            page.lab.hide();
    };
});


//* 悬浮按钮 mdui-fab 逻辑 终

/*
 * 核心功能 终
 */

/* 
 * 页面功能声明区 起
 */

// 临时用于切换到默认页面
page.changer.show(1)

//* 首页 index

// 一言
fetch('./js/json/yiyan.json')
    .then(response => response.json())
    .then(data => $('#yiyan').text(data[randomInt(0, data.length)]))
    .catch(error => {
        console.error('一言读取出现错误:', error);
    });

//* 欢迎使用 welcome

new mdui.Tooltip('#tooltip-番茄工作法', {
    content: '\"番茄工作法\"是由 弗朗西斯科·西里洛 于1992年创立的一种相对于GTD(Getting Things Done)更微观的时间管理方法'
});


/* 
 * 页面功能声明区 终
 */