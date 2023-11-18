const config = {
    config: {
        index: { title: '首页', icon: 'home' },
        welcome: { title: '欢迎使用', icon: 'star' },
        clock: {
            title: '时钟',
            icon: 'access_time',
        },
        'pomodoro-timer': { title: '番茄钟', icon: 'timer' },
        /* 'word-notepad': { title: '单词本', icon: 'book' }, */
        settings: { title: '设置', icon: 'settings' },
    },
    get name(): string[] {
        return Object.keys(this.config);
    },
    drawer: {
        subheader: { clock: '时间管理' },
    },
    get yiyan(): string[] {
        return [
            // 使用 古诗词·一言 api: https://github.com/xenv/gushici
            '//v1.jinrishici.com/rensheng/lizhi.json',
            '//v1.jinrishici.com/rensheng/zheli.json',
            '//v1.jinrishici.com/rensheng/dushu.json', //人生-读书
        ].map((value: string): string => {
            // 适配 (mini-)electron, 根据协议选择获取方式
            if (window.location.protocol === 'file:') {
                return 'https:' + value;
            } else {
                return window.location.protocol + value;
            }
        });
    },
};
export default config;
