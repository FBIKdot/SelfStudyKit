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

//* 悬浮按钮 fab-wrapper 逻辑 起
$('#page-changer').on('change.mdui.tab', event => {
    switch (event._detail.index) {
        case 1:
            page.lab.show();
            break;
        default:
            page.lab.hide();
    };
});

/**
 * @description 根据传入的参数更改 fab-wrapper 的外观与功能
 * @param {Object} config - 一个包含以下属性的对象：
 *   @param {string} close='add' - 选填, 关闭时的mdui-icon名字
 *   @param {string} open='close' - 选填, 展开后的mdui-icon名字
 *   @param {Array} dial - 一个数组，包含以下两个元素：
 *     @param {string} dialIcon='touch_app' - 拨号的mdui-icon名字
 *     @param {string} dialColor - 选填, 拨号图标的颜色, 不填就不会给这个按钮添加mdui-color-*类
 *     @param {function} dialFn=function(){throw new Error("该拨号函数未定义");} - 拨号的函数
 * @return {void} - 此函数没有返回值
 */
page.fn.fab_change = function ({
    close: closeIcon = 'add',
    open: openIcon = 'close',
    dial = []
}) {
    dial = dial.map(([icon = 'touch_app', color, fn = function () { throw new Error("该拨号点击后执行的函数未定义"); }]) => [icon, color, fn]);
    $('#fab-wrapper i').eq(0).text(closeIcon);
    $('#fab-wrapper i').eq(1).text(openIcon);
    $('#fab-dial').text('');
    dial.forEach(([icon, color, fn], index) => {
        $('#fab-dial').append(`<button class="mdui-fab mdui-fab-mini mdui-ripple ${'mdui-color-' + color || ''}"><i class="mdui-icon material-icons">${icon}</i></button>`)
        $('#fab-dial button').eq(index).on('click', fn);
    });
    // console.log('page.fn.fab_change:', closeIcon, openIcon, dial);
};

// 测试用功能: 
page.fn.fab_change({
    close: 'add',
    open: 'close',
    dial: [
        ['backup', 'pink'],
        ['bookmark', 'red'],
        ['access_alarms', 'orange'],
        ['touch_app', 'blue', function () { console.log(`it's work!!!`); }]
    ]
});

//* 悬浮按钮 fab-wrapper 逻辑 终

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