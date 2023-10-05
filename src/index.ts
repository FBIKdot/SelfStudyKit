/*!
 * SelfStudyKit v1.0.3 - 基于mdui的纯前端自习辅助工具集.
 * https://github.com/FBIKdot/SelfStudyKit
 * Copyright (C) 2023 FBIK <fbik@fbik.top>
 * https://github.com/FBIKdot/SelfStudyKit/blob/master/LICENSE
 */
import 'mdui/dist/css/mdui.min.css';
import mdui from 'mdui';
import './css/main.css';
import page from './page';
import { getCookie, setCookie } from 'typescript-cookie';

let $ = mdui.$;

// 等css加载完再显示 body
$('body').removeAttr('style');

/*
 * 核心功能 起
 */
// 绑定左上角button按钮打开drawer. 更改属性无法禁用drawer
$('#button-menu').on('click', () => page.drawer.dom.toggle());

//* 生成drawer侧边栏. 使用js调用mdui tab选项卡, 实现页面切换
page.name.forEach((element: string, index: number) => {
    $('#drawer-list').append(
        `${
            page.drawer.subheader[element]
                ? '<div class="mdui-subheader">' + page.drawer.subheader[element] + '</div>'
                : ''
        } ` +
            `<a class="mdui-list-item mdui-ripple" id="link-${element}">` +
            `<i class="mdui-list-item-icon mdui-icon material-icons">${page.config[element].icon}</i>` +
            `<div class="mdui-list-item-content">${page.config[element].title}</div></a> `,
    );
    $('#link-' + element).on('click', () => {
        // 切换页面
        page.changer.show(index);

        // 根据屏幕宽度判断drawer是否启用遮罩, 如果是则在点击后关闭drawer
        if ($(window).width() < 1024) {
            page.drawer.dom.close();
        }
    });
});

/*
 * 核心功能 终
 */

/*
 * 页面功能声明区 起
 */
//* 页面切换 逻辑
// 切换页面
const pageNumber: number = Number(getCookie('page') || 0);
page.changer.show(pageNumber);

// 切换标题
$('.mdui-typo-title').text(page.config[page.name[pageNumber]].title);

// 是否启用clock
if (getCookie('page') === '2') {
    page.fn.clock.start('#page-clock-text', '{年}/{月}/{日} {时}:{分}:{秒} {时辰}');
}

// 页面切换事件监听
$('#page-changer').on('change.mdui.tab', (event: Event) => {
    const pageNumber: number = (event as any)._detail.index;

    //默认隐藏fab
    page.fab.hide();
    page.fn.clock.stop();
    // 根据mdui文档, 这里的event._detail绝对存在
    switch ((event as any)._detail.index) {
        case 1:
            // page.fab.show();
            break;
        case 2:
            page.fn.clock.start('#page-clock-text', '{年}/{月}/{日} {时}:{分}:{秒} {时辰}');
            break;
    }
    // 切换标题
    $('.mdui-typo-title').text(page.config[page.name[pageNumber]].title);
    // 存储页面页码
    setCookie('page', pageNumber.toString());
    console.log('pageNumber.toString()', pageNumber.toString());
});

//* 测试区 起
// 测试用功能:
page.fn.fab_change({
    closeIcon: 'add',
    openIcon: 'close',
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

//* 测试区 终

//* 首页 index
// 一言
import './page/yiyan';

//* 欢迎使用 welcome
new mdui.Tooltip('#tooltip-番茄工作法', {
    content: '"番茄工作法"是由 弗朗西斯科·西里洛 于1992年创立的一种相对于GTD(Getting Things Done)更微观的时间管理方法',
});

//* 时钟
// 在页面切换逻辑里面

//* 番茄钟
import './page/pomodoro-timer';

//*设置
import './page/settings';

// 版本检查
// page.fn.version_Check();
/*
 * 页面功能声明区 终
 */
