/*!
 * SelfStudyKit v1.0.3 - 基于mdui的纯前端自习辅助工具集.
 * https://github.com/BovineBeta/SelfStudyKit
 * Copyright (C) 2023 FBIK <fbik@fbik.top>
 * https://github.com/BovineBeta/SelfStudyKit/blob/master/LICENSE
 */
import 'mdui/dist/css/mdui.min.css';
import mdui from 'mdui';
import './css/main.css';
import page from './page';
import { getCookie, setCookie } from 'typescript-cookie';

let $ = mdui.$;

// 等css加载完再显示 body
$('body').removeAttr('style');

/**
 * @description 随机生成一定范围的整数
 * @param {Number} min - 最小值, 整数
 * @param {Number} max - 最大值, 整数
 * @return {Number} 随机生成的整数
 */
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);

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
page.changer.show(Number(getCookie('page') !== void 0 ? getCookie('page') : 0));

if (getCookie('page') === '2') {
    page.fn.clock.start('#page-clock-text', '{年}/{月}/{日} {时}:{分}:{秒} {时辰}');
}
$('#page-changer').on('change.mdui.tab', (event: Event) => {
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
    setCookie('page', (event as any)._detail.index.toString());
    console.log((event as any)._detail.index.toString());
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
console.log('一言api: ', page.yiyan.api[randomInt(0, page.yiyan.api.length - 1)]);
fetch(page.yiyan.api[randomInt(0, page.yiyan.api.length - 1)])
    .then(response => response.json())
    // .then(data => console.log(data))
    .then(data => $('#yiyan').text(`“ ${data.content}” —— ${data.author} 《${data.origin}》`))
    .catch(error => {
        console.error('一言读取出现错误:', error);
    });

//* 欢迎使用 welcome

new mdui.Tooltip('#tooltip-番茄工作法', {
    content: '"番茄工作法"是由 弗朗西斯科·西里洛 于1992年创立的一种相对于GTD(Getting Things Done)更微观的时间管理方法',
});

//* 时钟
// 在页面切换逻辑里面

//* 番茄钟
$('#page-pomodoro-timer-options input')
    .eq(3)
    .on('click', () => {
        let checked = $('#page-pomodoro-timer-options input').eq(3).prop('checked');
        $('#page-pomodoro-timer-options input')
            .eq(2)
            .attr('disabled', !checked ? 'true' : null);
        $('#page-pomodoro-timer-options label')
            .eq(2)
            .text(checked ? '长休息时间 (秒)' : '已关闭 长休息时间 (秒)');
        $('#page-pomodoro-timer-options .mdui-textfield').eq(2).removeClass('mdui-textfield-invalid');
    });
$('#button-pomodoro-timer-start').on('click', () => {
    let hasError: boolean = false;
    [0, 1, 2].forEach(element => {
        let warning = $('#page-pomodoro-timer-options .mdui-textfield-error').eq(element);
        let input = $('#page-pomodoro-timer-options input').eq(element);
        let textfield = $('#page-pomodoro-timer-options .mdui-textfield').eq(element);
        let hasLongBreak: boolean = $('#page-pomodoro-timer-options input').eq(3).prop('checked');
        // 判断是否为正整数
        if (/^[1-9]|[1-5]\d$/.test(input.val()?.toString() || '') || (element === 2 && !hasLongBreak)) {
            warning.text('');
            textfield.removeClass('mdui-textfield-invalid');
        } else {
            warning.text('内容必须为不超过60的正整数');
            hasError = true;
            textfield.addClass('mdui-textfield-invalid');
        }
    });

    if (!hasError) {
        let input = $('#page-pomodoro-timer-options input');
        let settings = {
            pomodoro: Number(input.eq(0).val() as string),
            short_break: Number(input.eq(1).val() as string),
            long_break: Number(input.eq(2).val() as string),
        };

        // 倒计时
        page.fn.pomodoro_timer.init(
            '#page-pomodoro-timer-display div',
            100,
            settings.pomodoro,
            settings.short_break,
            settings.long_break,
        );
    }
});
$('#button-pomodoro-timer-next').on('click', () =>
    page.fn.pomodoro_timer.next('#page-pomodoro-timer-display div', 100),
);
$('#button-pomodoro-timer-stop').on('click', () => {
    mdui.dialog({
        title: '确定?',
        content: '你确定要结束番茄钟吗?',
        buttons: [
            {
                text: '取消',
            },
            {
                text: '确定',
                onClick: () => page.fn.pomodoro_timer.stop('#page-pomodoro-timer-display div'),
            },
        ],
    });
});

//*设置
// Cookie
let themeStatus: string = getCookie('theme') || 'auto';
page.fn.theme_changer(themeStatus);

$('#page-settings-panel .mdui-panel-item')
    .get()
    .forEach(element => {
        $(element).on('click', () => {
            page.settings.panel.open($(element));
        });
    });

// 勾选当前主题色
$(`input[name="主题色"][value="${themeStatus}"]`).prop('checked', true);

// 应用主题色
$('#page-settings-theme-apply').on('click', () => {
    themeStatus = $('input[name="主题色"]:checked').val() as string;
    page.fn.theme_changer(themeStatus);
    $(`input[name="主题色"][value="${themeStatus}"]`).prop('checked', true);
});

// 版本检查
// page.fn.version_Check();
/*
 * 页面功能声明区 终
 */
