import mdui from 'mdui';

let $ = mdui.$;

class PomodoroTimer {
    constructor(targetDOM: string) {
        this.target = targetDOM;
        this.tab = new mdui.Tab('#page-pomodoro-timer-page-changer');
    }
    private config?: {
        status: number;
        counter: number;
        break_turn: number;
        settings: {
            delay: number;
            pomodoro: number;
            short_break: number;
            long_break: number | void;
        };
        interval: number;
    };
    private target: string;
    private tab: any;
    private changer(page: number) {
        this.tab.show(page);
    }
    /**
     * @description 计算目标时间与现在时间之差
     * @param {number} time 目标时间戳
     * @return {string | void} 时间未过则返回'剩余分钟:剩余时间', 时间已过则无返回
     */
    private getTimeDiff(time: number): string | void {
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
    }
    /**
     * @description 启动番茄钟实例
     * @param {number} pomodoro_time 专注时间
     * @param {number} short_break_time 休息时间
     * @param {number} long_break_time 长休息时间
     * @param {number} delay 间隔时间. 默认100
     * @memberof pomodoroTimer
     */
    public start(pomodoro_time: number, short_break_time: number, long_break_time?: number, delay?: number) {
        this.config = {
            status: 0,
            counter: 0,
            break_turn: 0,
            settings: {
                delay: delay || 100,
                pomodoro: pomodoro_time,
                short_break: short_break_time,
                long_break: long_break_time,
            },
            interval: 0,
        };
        this.changer(1);
        // page.pomodoro_timer.changer.show(1);
        // page.drawer.dom.close();
        // $('#button-menu').on('click', () => page.drawer.dom.close());
        this.next();
    }
    /**
     * @description 切换番茄钟实例到下个阶段.
     * @private
     * @memberof pomodoroTimer
     */
    public next() {
        // 浅拷贝
        let i = this.config as unknown as any;
        let target = this.target;
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
        $(target).eq(0).text(phaseName[i.status]);
        let time: number = new Date().getTime() + i.settings[phase[i.status]] * 1000 * 60;
        $(target)
            .eq(2)
            .text('下一阶段: ' + phaseName[nextStatus]);
        $(target)
            .eq(1)
            .text(this.getTimeDiff(time)?.toString() || 'Error');
        i.interval = window.setInterval((): void => {
            this.getTimeDiff(time)
                ? $(target)
                      .eq(1)
                      .text(this.getTimeDiff(time)?.toString() || 'Error')
                : this.next();
        }, i.settings.delay);
    }
    /**
     * @description 停止番茄钟实例
     * @private
     * @memberof pomodoroTimer
     */
    public stop() {
        let i = this.config as unknown as any;
        clearInterval(i.interval);
        delete this.config;
        /* $('#button-menu').on('click', () => {
            page.drawer.dom.toggle();
        }); */
        this.changer(0);
    }
}

export { PomodoroTimer };
