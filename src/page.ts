import mdui from 'mdui';
import 'mdui/dist/css/mdui.css';
import { getCookie, setCookie } from 'typescript-cookie';

let $ = mdui.$;

/*
 * Page数据处理函数声明 起
 */
interface Page {
    config: {
        [key: string]: {
            title: string;
            icon: string;
            settings?: {
                title: string;
            };
        };
    };
    name: string[];
    drawer: {
        subheader: {
            [key: string]: string;
        };
        dom: any; // mdui.Drawer
    };
    changer: any; // mdui.Tab
    fab: any; // mdui.Fab
    pomodoro_timer: {
        changer: any; // mdui.Tab
    };
    yiyan: {
        api: string[];
    };
    settings: {
        panel: any; // mdui.Panel
    };
    fn: {
        /**
         * @description 更改主题色
         * @param {string} status 主题色
         */
        theme_changer: (status: string) => void;
        /**
         * @description 根据传入的参数更改 fab-wrapper 的外观与功能
         * @param {string} opts.close - fab 关闭时显示的图标
         * @param {string} opts.open - fab 打开时显示的图标
         * @param {string} [opts.dial[].icon='touch_app'] - 拨号按钮图标
         * @param {string} [opts.dial[].color=''] - 拨号按钮颜色
         * @param {Function} opts.dial[].fn - 拨号按钮点击后执行的函数
         */
        fab_change: (opts: { closeIcon: string; openIcon: string; dial: [string?, string?, Function?][] }) => void;
        clock: {
            /**
             * @description 根据一个时间戳和样式生成一个时间文本
             * @param {string} [style='{年}/{月}/{日} {时}:{分}:{秒}'] 时间样式字符串, 默认为'{年}/{月}/{日} {时}:{分}:{秒}'
             * @param {Date} [time=new Date()] 一个时间戳
             * @return {string} 生成的时间文本
             */
            timeTextDiy: (style?: string, time?: Date) => string;
            /**
             * @description 创建clock实例并启动
             * @param {string} target 目标DOM, 使用css选择器, 默认为#page-clock-text
             * @param {string} style 时间样式字符串, 默认为'{年}/{月}/{日} {时}:{分}:{秒}'
             * @param {number} [delay=100] 间隔时间, 默认为100
             */
            start: (target: string, style: string, delay?: number) => void;
            /**
             * @description 停止并删除clock实例
             * @param {string} target 目标DOM, 使用css选择器, 默认为#page-clock-text
             */
            stop: (target?: string) => void;
            instances: {
                [key: string]: number;
            };
        };
        pomodoro_timer: {
            /**
             * @description 计算目标时间与现在时间之差
             * @param {number} time 目标时间戳
             * @return {string | void} 时间未过则返回'剩余分钟:剩余时间', 时间已过则无返回
             */
            getTimeDiff: (time: number) => string | void;
            /**
             * @description 创建并启动番茄钟实例
             * @param {string} [targetDOM='#page-pomodoro-timer-display div'] 目标DOM, 使用css选择器, 默认为'#page-pomodoro-timer-display div'
             * @param {number} [delay=100] 间隔时间, 默认为100
             * @param {Number} pomodoro_time 专注时间
             * @param {Number} short_break_time 休息时间
             * @param {Number} [long_break_time=undefined] 长休息时间
             */
            init: (
                targetDOM: string,
                delay: number,
                pomodoro_time: number,
                short_break_time: number,
                long_break_time: number,
            ) => void;
            /**
             * @description 切换番茄钟实例到下个阶段. 如果刚刚初始化, 则是启动番茄钟实例
             * @param {string} targetDOM 目标DOM, 使用css选择器
             * @param {number} delay 间隔时间
             */
            next: (targetDOM: string, delay: number) => void;
            /**
             * @description 停止番茄钟实例
             * @param {string} target 目标DOM, 使用css选择器, 应该为'#page-pomodoro-timer-display div'
             */
            stop: (target: string) => void;
            instances: {
                [key: string]: {
                    status: number;
                    counter: number;
                    break_turn: number;
                    settings: {
                        pomodoro: number;
                        short_break: number;
                        long_break: number;
                    };
                    interval?: number;
                };
            };
        };
    };
}
// 页面内容配置
let page: Page = {
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
        /* 'word-notepad': { title: '单词本', icon: 'book' }, */
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
    yiyan: {
        api: [
            // 使用 古诗词·一言 api: https://github.com/xenv/gushici
            '//v1.jinrishici.com/rensheng/lizhi.json',
            '//v1.jinrishici.com/rensheng/zheli.json',
            '//v1.jinrishici.com/rensheng/dushu.json', //人生-读书
        ],
    },
    settings: {
        panel: new mdui.Panel('#page-settings-panel'),
    },
    fn: {
        theme_changer(status: string) {
            setCookie('theme', status);
            $('body').removeClass('mdui-theme-layout-auto mdui-theme-layout-light mdui-theme-layout-dark');
            $('body').addClass(`mdui-theme-layout-${status}`);
        },
        /**
         * @description 根据传入的参数更改 fab-wrapper 的外观与功能
         * @param {string} opts.close - fab 关闭时显示的图标
         * @param {string} opts.open - fab 打开时显示的图标
         * @param {string} [opts.dial[].icon='touch_app'] - 拨号按钮图标
         * @param {string} [opts.dial[].color=''] - 拨号按钮颜色
         * @param {Function} opts.dial[].fn - 拨号按钮点击后执行的函数
         */
        fab_change(opts: { closeIcon: string; openIcon: string; dial: [string?, string?, Function?][] }) {
            let { closeIcon, openIcon, dial } = opts;
            $('#fab-wrapper i').eq(0).text(closeIcon);
            $('#fab-wrapper i').eq(1).text(openIcon);
            $('#fab-dial').text('');
            dial.forEach((config: [string?, string?, Function?], index: number) => {
                let [icon, color, fn = () => {}] = config;
                $('#fab-dial').append(
                    `<button class="mdui-fab mdui-fab-mini mdui-ripple ${color ? 'mdui-color-' + color : ''}">` +
                        `<i class="mdui-icon material-icons">${icon || 'touch_app'}</i></button>`,
                );
                $('#fab-dial button')
                    .eq(index)
                    .on('click', () => {
                        fn();
                    });
            });
        },
        clock: {
            /**
             * @description 根据一个时间戳和样式生成一个时间文本
             * @param {string} [style='{年}/{月}/{日} {时}:{分}:{秒}'] 时间样式字符串, 默认为'{年}/{月}/{日} {时}:{分}:{秒}'
             * @param {Date} [time=new Date()] 一个时间戳
             * @return {string} 生成的时间文本
             */
            timeTextDiy: function (style: string = '{年}/{月}/{日} {时}:{分}:{秒}', time: Date = new Date()): string {
                let god: Date = new Date(time);
                let DIZHI: string[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
                let HANZI: string[] = ['天', '一', '二', '三', '四', '五', '六'];
                let type: any = {
                    年: god.getFullYear().toString(),
                    月: (god.getMonth() + 1).toString(),
                    日: god.getDate().toString(),
                    时: god.getHours().toString().padStart(2, '0'),
                    分: god.getMinutes().toString().padStart(2, '0'),
                    秒: god.getSeconds().toString().padStart(2, '0'),
                    毫秒: god.getMilliseconds().toString(),
                    星期: HANZI[god.getDay()],
                    时辰: `${DIZHI[Math.floor((god.getHours() % 12) + god.getMinutes() / 60)]}时${
                        HANZI[Math.floor(god.getMinutes() / 15)]
                    }刻`,
                };
                return style.replace(/{([^}]+)}/g, (_match, p1) => type[p1]);
            },
            /**
             * @description 创建clock实例并启动
             * @param {string} target 目标DOM, 使用css选择器, 默认为#page-clock-text
             * @param {string} style 时间样式字符串, 默认为'{年}/{月}/{日} {时}:{分}:{秒}'
             * @param {number} [delay=100] 间隔时间, 默认为100
             */
            start: function (target: string = '#page-clock-text', style: string, delay: number = 100) {
                this.instances[target] = window.setInterval(() => {
                    $(target).text(this.timeTextDiy(style));
                }, delay);
            },
            /**
             * @description 停止并删除clock实例
             * @param {string} target 目标DOM, 使用css选择器, 默认为#page-clock-text
             */
            stop: function (target: string = '#page-clock-text') {
                clearInterval(this.instances[target]);
                delete this.instances[target];
            },
            instances: {} as any,
        },
        pomodoro_timer: {
            /**
             * @description 计算目标时间与现在时间之差
             * @param {number} time 目标时间戳
             * @return {string | void} 时间未过则返回'剩余分钟:剩余时间', 时间已过则无返回
             */
            getTimeDiff: function (time: number): string | void {
                let diff: number = new Date(time).getTime() - new Date().getTime();
                // console.log('diff', diff);
                return diff < 0
                    ? void 0
                    : Math.floor((diff / (1000 * 60)) % 60)
                          .toString()
                          .padStart(2, '0') +
                          ':' +
                          Math.floor((diff / 1000) % 60)
                              .toString()
                              .padStart(2, '0');
            },
            /**
             * @description 创建并启动番茄钟实例
             * @param {string} [targetDOM='#page-pomodoro-timer-display div'] 目标DOM, 使用css选择器, 默认为'#page-pomodoro-timer-display div'
             * @param {number} [delay=100] 间隔时间, 默认为100
             * @param {Number} pomodoro_time 专注时间
             * @param {Number} short_break_time 休息时间
             * @param {Number} [long_break_time=undefined] 长休息时间
             */
            init: function (
                targetDOM: string = '#page-pomodoro-timer-display div',
                delay: number = 100,
                pomodoro_time: number,
                short_break_time: number,
                long_break_time: number,
            ) {
                this.instances[targetDOM] = {
                    status: 0,
                    counter: 0,
                    break_turn: 0,
                    settings: {
                        pomodoro: pomodoro_time,
                        short_break: short_break_time,
                        long_break: long_break_time,
                    },
                };
                page.pomodoro_timer.changer.show(1);
                page.drawer.dom.close();
                $('#button-menu').on('click', () => page.drawer.dom.close());
                this.next(targetDOM, delay);
            },
            /**
             * @description 切换番茄钟实例到下个阶段. 如果刚刚初始化, 则是启动番茄钟实例
             * @param {string} targetDOM 目标DOM, 使用css选择器
             * @param {number} delay 间隔时间
             */
            next: function (targetDOM: string, delay: number) {
                // 浅拷贝
                let i: any = this.instances[targetDOM];
                clearInterval(i.interval);
                delete i.interval;

                console.log('status', i.status);
                /*
                 * 如果为休息时间, 则根据循环次数turn判断示范应为长休息时间
                 ! 这里的i.status是上次的状态, 不是这次!
                 */
                let nextStatus: number = 0;
                let hasLongBreak: boolean = $('#page-pomodoro-timer-options input').eq(3).prop('checked');
                switch (i.status) {
                    // 如果上次是1
                    case 1:
                        // 这次是2或3
                        // 这里break_turn是没自增的, 方便阅读写+1
                        console.log('hasLongBreak', hasLongBreak);
                        if (i.break_turn + 1 === 4 && hasLongBreak) {
                            // 这次第4个休息, 也就是长休息了
                            i.status = 3;
                            i.break_turn = 0;

                            nextStatus = 1;
                        } else {
                            // 正常
                            i.status = 2;
                            ++i.break_turn;

                            nextStatus = 1;
                        }

                        break;
                    // 如果上次是2, 或者3, 或没有上次
                    case 0:
                    case 2:
                    case 3:
                        // 这次是1
                        if (i.break_turn + 1 === 4 && hasLongBreak) {
                            // 这次第4个专注, 下次长休息
                            i.status = 1;
                            ++i.counter;

                            nextStatus = 3;
                        } else {
                            i.status = 1;
                            ++i.counter;

                            nextStatus = 2;
                        }
                        break;
                }

                let phase: string[] = ['Error', 'pomodoro', 'short_break', 'long_break'];
                let phaseName: string[] = ['初始化', '专注时间', '休息时间', '长休息时间'];
                $(targetDOM).eq(0).text(phaseName[i.status]);
                let time: number = new Date().getTime() + i.settings[phase[i.status]] * 1000 * 60;
                $(targetDOM)
                    .eq(2)
                    .text('下一阶段: ' + phaseName[nextStatus]);
                $(targetDOM)
                    .eq(1)
                    .text(this.getTimeDiff(time)?.toString() || 'Error');
                i.interval = window.setInterval(() => {
                    this.getTimeDiff(time)
                        ? $(targetDOM)
                              .eq(1)
                              .text(this.getTimeDiff(time)?.toString() || 'Error')
                        : this.next(targetDOM, delay);
                }, delay);
            },
            /**
             * @description 停止番茄钟实例
             * @param {string} target 目标DOM, 使用css选择器, 应该为'#page-pomodoro-timer-display div'
             */
            stop: function (target: string = '#page-pomodoro-timer-display div') {
                clearInterval(this.instances[target].interval);
                delete this.instances[target];
                $('#button-menu').on('click', () => {
                    page.drawer.dom.toggle();
                });
                page.pomodoro_timer.changer.show(0);
            },
            instances: {} as any,
        },
    },
};
export default page;
/*
 * Page数据处理函数声明 终
 */
