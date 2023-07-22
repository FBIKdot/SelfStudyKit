/*!
 * SelfStudyKit v0.0.1 - 基于mdui的纯前端自习辅助工具集.
 * https://github.com/BovineBeta/SelfStudyKit
 * Copyright (C) 2023 FBIK <fbik@fbik.top>
 * https://github.com/BovineBeta/SelfStudyKit/blob/master/LICENSE
 */
import 'mdui/dist/css/mdui.min.css'
import mdui from 'mdui'
import yiyan from './json/yiyan.json'
import './css/main.css'

let $ = mdui.$

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

/*
 * 数据处理函数声明 终
 */

/*
 * 核心功能 起
 */

// 页面内容配置
let page = {
    content: {
        'index': { title: '首页', icon: 'home' },
        'welcome': { title: '欢迎使用', icon: 'star' },
        'clock': { title: '时钟', icon: 'access_time' },
        'pomodoro-timer': { title: '番茄钟', icon: 'timer' },
        'word-notepad': { title: '单词本', icon: 'book' },
        'settings': { title: '设置', icon: 'settings' }
    },
    get name() { return Object.keys(this.content); },
    drawer: {
        subheader: { 'clock': '时间管理' }
    },
    changer: new mdui.Tab('#page-changer'),
    fab: new mdui.Fab('#fab-wrapper'),
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
         * @returns {void} 没有返回值
         */
        fab_change: function ({
            close: closeIcon = 'add',
            open: openIcon = 'close',
            dial = []
        }) {
            $('#fab-wrapper i').eq(0).text(closeIcon);
            $('#fab-wrapper i').eq(1).text(openIcon);
            $('#fab-dial').text('');
            dial.forEach(([icon, color, fn], index) => {
                $('#fab-dial').append(
                    `<button class="mdui-fab mdui-fab-mini mdui-ripple ${color ? 'mdui-color-' + color : ''}">
                    <i class="mdui-icon material-icons">${icon || 'touch_app'}</i></button>`)
                $('#fab-dial button').eq(index).on('click', fn);
            });
            // console.log('page.fn.fab_change:', closeIcon, openIcon, dial);
        }
    }
};

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

//* 生成drawer侧边栏. 使用js调用mdui tab选项卡, 实现页面切换
page.name.forEach((element, index) => {
    $('.mdui-list').append(
        `${page.drawer.subheader[element] ? '<div class="mdui-subheader">' + page.drawer.subheader[element] + '</div>' : ''}`,
        `<a class="mdui-list-item mdui-ripple" id="link-${element}">
        <i class="mdui-list-item-icon mdui-icon material-icons">${page.content[element].icon}</i>
        <div class="mdui-list-item-content">${page.content[element].title}</div></a>`)
    $('#link-' + element).on('click', () => page.changer.show(index));
});

//* 悬浮按钮 fab-wrapper 逻辑 起
$('#page-changer').on('change.mdui.tab', event => {
    switch (event._detail.index) {
        case 1:
            page.fab.show();
            break;
        default:
            page.fab.hide();
    };
});

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
fetch(yiyan)
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