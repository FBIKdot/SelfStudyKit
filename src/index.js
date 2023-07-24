/*!
 * SelfStudyKit v0.0.1 - 基于mdui的纯前端自习辅助工具集.
 * https://github.com/BovineBeta/SelfStudyKit
 * Copyright (C) 2023 FBIK <fbik@fbik.top>
 * https://github.com/BovineBeta/SelfStudyKit/blob/master/LICENSE
 */
import 'mdui/dist/css/mdui.min.css';
import mdui from 'mdui';
import yiyan from './json/yiyan.json';
import './css/main.css';

let $ = mdui.$;

// vercel预先构建警告
if (window.location.host === 'self-study-kit.vercel.app') {
    let devWarning = ` * SelfStudyKit v0.x 未开发完成 - 基于mdui的纯前端自习辅助工具集.
 * https://github.com/BovineBeta/SelfStudyKit
 * Copyright (C) 2023 FBIK <fbik@fbik.top>
 * https://github.com/BovineBeta/SelfStudyKit/blob/master/LICENSE`;
    window.location.assign('/#delay');
    mdui.dialog({
        title: '没做完',
        content:
            '你在使用 Vercel 自动构建. <br/ >目前开发未完成, 无法保证上一次代码提交前做好了充分的调试, 因此你可能会遇到bug.' +
            devWarning.replace(/(\s)\*(\s)/g, '<br/ > * '),
        buttons: [
            {
                text: '确认',
            },
        ],
    });
    console.warn(devWarning);
}

/*
 * 数据处理函数声明 起
 */

/**
 * @description: 随机生成一定范围的整数
 * @param {Number} min - 最小值, 整数,默认为
 * @param {Number} max - 最大值, 整数
 * @return {Number} 随机生成的整数
 */
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
/**
 * @description 根据一个时间戳和样式生成一个时间文本
 * @param {string} [style='{年}/{月}/{日} {时}:{分}:{秒}'] 时间样式字符串, 默认为'{年}/{月}/{日} {时}:{分}:{秒}'
 * @param {Date} [time=new Date()] 一个时间戳
 * @return {string} 生成的时间文本
 */
function timeTextDiy(style = '{年}/{月}/{日} {时}:{分}:{秒}', time = new Date()) {
    let god = new Date(time);
    let DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    let HANZI = ['天', '一', '二', '三', '四', '五', '六'];
    let type = {
        年: god.getFullYear(),
        月: god.getMonth() + 1,
        日: god.getDate(),
        时: god.getHours().toString().padStart(2, '0'),
        分: god.getMinutes().toString().padStart(2, '0'),
        秒: god.getSeconds().toString().padStart(2, '0'),
        毫秒: god.getMilliseconds(),
        星期: HANZI[god.getDay()],
        时辰: `${DIZHI[[Math.floor((god.getHours() % 12) + god.getMinutes() / 60)]]}时${
            HANZI[Math.floor(god.getMinutes() / 15)]
        }刻`,
    };
    return style.replace(/{([^}]+)}/g, (match, p1) => type[p1]);
}

/*
 * 数据处理函数声明 终
 */

/*
 * 核心功能 起
 */

// 页面内容配置
let page = {
    config: {
        index: { title: '首页', icon: 'home' },
        welcome: { title: '欢迎使用', icon: 'star' },
        clock: {
            title: '时钟',
            icon: 'access_time',
            settings: {
                title: '当前时间',
            },
        },
        'pomodoro-timer': { title: '番茄钟', icon: 'timer' },
        'word-notepad': { title: '单词本', icon: 'book' },
        settings: { title: '设置', icon: 'settings' },
    },
    get name() {
        return Object.keys(this.config);
    },
    drawer: {
        subheader: { clock: '时间管理' },
        dom: new mdui.Drawer('#drawer'),
    },
    changer: new mdui.Tab('#page-changer'),
    fab: new mdui.Fab('#fab-wrapper'),
    pomodoro_timer: {
        changer: new mdui.Tab('#page-pomodoro-timer-page-changer'),
    },
    fn: {
        /**
         * @description 根据传入的参数更改 fab-wrapper 的外观与功能
         * @param {Object} opts - 配置对象
         * @param {string} [opts.close='add'] - fab 关闭时显示的图标
         * @param {string} [opts.open='close'] - fab 打开时显示的图标
         * @param {Array} opts.dial - 拨号按钮数组
         * @param {string} [opts.dial[].icon='touch_app'] - 拨号按钮图标
         * @param {string} [opts.dial[].color=''] - 拨号按钮颜色
         * @param {Function} opts.dial[].fn - 拨号按钮点击后执行的函数
         */
        fab_change: function ({ close: closeIcon = 'add', open: openIcon = 'close', dial = [] }) {
            $('#fab-wrapper i').eq(0).text(closeIcon);
            $('#fab-wrapper i').eq(1).text(openIcon);
            $('#fab-dial').text('');
            dial.forEach(([icon, color, fn], index) => {
                $('#fab-dial').append(
                    `<button class="mdui-fab mdui-fab-mini mdui-ripple ${color ? 'mdui-color-' + color : ''}">` +
                        `<i class="mdui-icon material-icons">${icon || 'touch_app'}</i></button>`,
                );
                $('#fab-dial button').eq(index).on('click', fn);
            });
            // console.log('page.fn.fab_change:', closeIcon, openIcon, dial);
        },
        clock: {
            /**
             * @description 创建clock实例并启动
             * @param {string} [target='#page-clock-text'] 目标, 使用css选择器, 默认为#page-clock-text
             * @param {string} style 时间样式字符串, 默认为'{年}/{月}/{日} {时}:{分}:{秒}'
             * @param {number} [delay=100] 间隔时间, 默认为100
             */
            start: function (target = '#page-clock-text', style, delay = 100) {
                this.instances[target] = setInterval(() => {
                    $(target).text(timeTextDiy(style));
                }, delay);
            },
            /**
             * @description 停止并删除clock实例
             * @param {string} [target='#page-clock-text'] 目标, 使用css选择器, 默认为#page-clock-text
             */
            stop: function (target = '#page-clock-text') {
                clearInterval(this.instances[target]);
                delete this.instances[target];
            },
            instances: {},
        },
        'pomodoro-timer': {
            run: false,
            start: function () {},
            stop: function () {},
        },
    },
};
// 绑定左上角button按钮打开drawer. 更改属性无法禁用drawer
$('#button-menu').on('click', () => {
    page.drawer.dom.open();
});

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
    }
    darkModeState = !darkModeState;
});

//* 生成drawer侧边栏. 使用js调用mdui tab选项卡, 实现页面切换
page.name.forEach((element, index) => {
    $('.mdui-list').append(
        `${
            page.drawer.subheader[element]
                ? '<div class="mdui-subheader">' + page.drawer.subheader[element] + '</div>'
                : ''
        } `,
        `<a class="mdui-list-item mdui-ripple" id="link-${element}">` +
            `<i class="mdui-list-item-icon mdui-icon material-icons">${page.config[element].icon}</i>` +
            `<div class="mdui-list-item-content">${page.config[element].title}</div></a> `,
    );
    $('#link-' + element).on('click', () => page.changer.show(index));
});

/*
 * 核心功能 终
 */

/*
 * 页面功能声明区 起
 */
//* 页面切换 逻辑
$('#page-changer').on('change.mdui.tab', event => {
    //默认隐藏fab
    page.fab.hide();
    page.fn.clock.stop();
    switch (event._detail.index) {
        case 1:
            page.fab.show();
            break;
        case 2:
            page.fn.clock.start(undefined, '{年}/{月}/{日} {时}:{分}:{秒} {时辰}');
            break;
    }
});

//* 测试区 起
// 测试用功能:
page.fn.fab_change({
    close: 'add',
    open: 'close',
    dial: [
        ['backup', 'pink'],
        ['bookmark', 'red'],
        ['access_alarms', 'orange'],
        [
            'touch_app',
            'blue',
            function () {
                console.log(`it's work!!!`);
            },
        ],
    ],
});
// 临时用于切换到默认页面
page.changer.show(3);
//* 测试区 终

//* 首页 index

// 一言
fetch(yiyan)
    .then(response => response.json())
    .then(data => $('#yiyan').text(data[randomInt(0, data.length)]))
    .catch(error => {
        console.error('一言读取出现错误:', error);
    });

//* 欢迎使用 welcome

new mdui.Tooltip('#tooltip-番茄工作法', {
    content: '"番茄工作法"是由 弗朗西斯科·西里洛 于1992年创立的一种相对于GTD(Getting Things Done)更微观的时间管理方法',
});

//* 时钟
$('#page-clock-title').text(page.config.clock.settings.title);

//* 番茄钟
$('#page-pomodoro-timer-options input')
    .eq(3)
    .on('click', () => {
        let checked = $('#page-pomodoro-timer-options input').eq(3).prop('checked');
        $('#page-pomodoro-timer-options input')
            .eq(2)
            .attr('disabled', !checked ? true : null);
        $('#page-pomodoro-timer-options label')
            .eq(2)
            .text(checked ? '长休息时间' : '已关闭 长休息时间');
        $('#page-pomodoro-timer-options .mdui-textfield').eq(2).removeClass('mdui-textfield-invalid');
    });
page.pomodoro_timer.changer.show(0);
$('#button-pomodoro-timer-start').on('click', () => {
    console.log($('#page-pomodoro-timer-options input').eq(3).prop('checked') ? '开' : '关');

    let hasError = false;
    [0, 1, 2].forEach(element => {
        let warning = $('#page-pomodoro-timer-options .mdui-textfield-error').eq(element);
        let input = $('#page-pomodoro-timer-options input').eq(element);
        let textfield = $('#page-pomodoro-timer-options .mdui-textfield').eq(element);
        if (
            /^[1-9]\d*$/.test(input.val()) ||
            (element === 2 && !$('#page-pomodoro-timer-options input').eq(3).prop('checked'))
        ) {
            warning.text('');
            textfield.removeClass('mdui-textfield-invalid');
        } else {
            warning.text('内容必须为正整数');
            hasError = true;
            console.log(warning);
            textfield.addClass('mdui-textfield-invalid');
        }
    });

    if (!hasError) {
        $('#button-menu').on('click', () => {
            page.drawer.dom.close();
        });
        let input = $('#page-pomodoro-timer-options input');
        let settings = {
            pomodoro: Number(input.eq(0).val()),
            short_break: Number(input.eq(1).val()),
            long_break: Number(input.eq(2).val()),
        };
        page.pomodoro_timer.changer.show(1);
    }
});

/*
 * 页面功能声明区 终
 */
