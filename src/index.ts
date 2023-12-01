/*!
 * SelfStudyKit - 基于mdui的纯前端自习辅助工具集.
 * https://github.com/FBIKdot/SelfStudyKit
 * Copyright (C) 2023 FBIK <fbik@fbik.top>
 * https://github.com/FBIKdot/SelfStudyKit/blob/master/LICENSE
 */
import 'mdui/dist/css/mdui.min.css';
import mdui from 'mdui';
import './css/main.css';
import { getCookie, setCookie } from 'typescript-cookie';

import config from './page/function/config';
import { pageChanger } from './page/function/main';
import { Clock } from './page/function/clock';

let $ = mdui.$;

// 等css加载完再显示 body
$('body').removeAttr('style');

namespace Init {
    // 启用 mdui drawer 并且绑定左上角按钮
    const drawer = new mdui.Drawer('#drawer');
    $('#button-menu').on('click', () => drawer.toggle());

    //* 生成drawer侧边栏. 使用js调用mdui tab选项卡, 实现页面切换
    config.name.forEach((element: string, index: number) => {
        const { icon, title } = config.config[element as keyof typeof config.config];
        const subheader: string = config.drawer.subheader[element as keyof typeof config.drawer.subheader] || '';
        $('#drawer-list').append(
            `${subheader ? `<div class="mdui-subheader">${subheader}</div>` : ''} ` +
                `<a class="mdui-list-item mdui-ripple" id="link-${element}">` +
                `<i class="mdui-list-item-icon mdui-icon material-icons">${icon}</i>` +
                `<div class="mdui-list-item-content">${title}</div></a> `,
        );

        $('#link-' + element).on('click', () => {
            // 切换页面
            pageChanger(index);

            // 根据屏幕宽度判断drawer是否启用遮罩, 如果是则在点击后关闭drawer
            if ($(window).width() < 1024) {
                drawer.close();
            }
        });
    });

    export const done = () => {};
}
Init.done();
//* 页面切换 逻辑
namespace pageChanging {
    const fab = new mdui.Fab('#fab-wrapper');
    // 页面切换事件监听
    $('#page-changer').on('change.mdui.tab', (event: Event) => {
        // 根据mdui文档, 这里的event._detail绝对存在
        const pageNumber: number = (event as any)._detail.index;

        //默认隐藏fab
        fab.hide();
        Clock.stop();

        switch (pageNumber) {
            case 1:
                break;
            case 2:
                Clock.start();
                break;
        }
        // 切换标题
        $('.mdui-typo-title').text(config.config[config.name[pageNumber] as keyof typeof config.config].title);
        // 存储页面页码
        setCookie('page', pageNumber.toString());
        console.log('pageNumber.toString()', pageNumber.toString());
    });

    const pageNumber: number = Number(getCookie('page') || 0);
    pageChanger(pageNumber);

    export const done = () => {};
}
pageChanging.done();

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
