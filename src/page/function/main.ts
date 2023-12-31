import mdui from 'mdui';
import { setCookie } from 'typescript-cookie';
import config from './config';

let $ = mdui.$;

/**
 * @description 随机生成一定范围的整数
 * @param {Number} min - 最小值, 整数
 * @param {Number} max - 最大值, 整数
 * @return {Number} 随机生成的整数
 */
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);

/**
 * @description 更改主题色
 * @param {string} status 主题色
 */
function themeChanger(status: 'auto' | 'light' | 'dark'): void {
    setCookie('theme', status);
    $('body').removeClass('mdui-theme-layout-auto mdui-theme-layout-light mdui-theme-layout-dark');
    $('body').addClass(`mdui-theme-layout-${status}`);
}

/**
 * @description 根据传入的参数更改 fab-wrapper 的外观与功能
 * @param {string} opts.close - fab 关闭时显示的图标
 * @param {string} opts.open - fab 打开时显示的图标
 * @param {string} [opts.dial[].icon='touch_app'] - 拨号按钮图标
 * @param {string} [opts.dial[].color=''] - 拨号按钮颜色
 * @param {Function} opts.dial[].fn - 拨号按钮点击后执行的函数
 */
function fabChange(opts: { closeIcon: string; openIcon: string; dial: [string?, string?, Function?][] }) {
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
}

/**
 * @description 版本检查
 * @return {*}  {Promise<{ isLast: boolean; lastVersion: string }>} 检查结果
 */
async function versionCheck(): Promise<{ isLast: boolean; lastVersion: string }> {
    interface GithubRawAPI {
        version?: string;
    }
    if (__APP_VERSION__ === 'v1.x') {
        // 开发模式
        return {
            isLast: true,
            lastVersion: __APP_VERSION__,
        };
    } else {
        const data: GithubRawAPI = await fetch(
            'https://raw.githubusercontent.com/FBIKdot/SelfStudyKit/main/package.json',
            { cache: 'no-cache' },
        )
            .then(response => response.json())
            .catch(err => {
                throw new Error(err);
            });
        const lastVersion: string | void = data.version;
        if (lastVersion === void 0) {
            throw new Error('请求结果为空');
        } else {
            return {
                isLast: __APP_VERSION__ === lastVersion,
                lastVersion,
            };
        }
    }
}

const tab = new mdui.Tab('#page-changer');

/**
 * @description 切换页面
 * @param {(string | number)} name 页面名称或页码(从0开始)
 */
function pageChanger(name: string | number) {
    if (typeof name === 'string') {
        tab.show(config.name.indexOf(name));
    } else {
        tab.show(name);
    }
}

export { themeChanger, fabChange, versionCheck, pageChanger, randomInt };
