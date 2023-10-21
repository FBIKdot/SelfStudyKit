import mdui from 'mdui';

let $ = mdui.$;

class Clock {
    private static instance?: number;
    public static delay: number = 100;
    public static style: string = '{年}/{月}/{日} {时}:{分}:{秒} {时辰}';
    /**
     * @description 根据一个时间戳和样式生成一个时间文本
     * @param {string} [style='{年}/{月}/{日} {时}:{分}:{秒}'] 时间样式字符串, 默认为'{年}/{月}/{日} {时}:{分}:{秒}'
     * @param {Date} [time=new Date()] 一个时间戳
     * @return {string} 生成的时间文本
     */
    private static timeTextDiy(style: string, time?: Date): string {
        let god: Date = new Date(time || new Date());
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
    }
    /**
     * @description 创建clock实例并启动
     * @param {string} target 目标DOM, 使用css选择器, 默认为#page-clock-text
     * @param {string} style 时间样式字符串, 默认为'{年}/{月}/{日} {时}:{分}:{秒}'
     * @param {number} [delay=100] 间隔时间, 默认为100
     */
    public static start() {
        this.instance = window.setInterval(() => {
            $('#page-clock-text').text(this.timeTextDiy(this.style));
        }, this.delay);
    }
    /**
     * @description 停止并删除clock实例
     */
    public static stop() {
        clearInterval(this.instance);
    }
}

export { Clock };
