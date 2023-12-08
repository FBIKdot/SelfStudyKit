import mdui from 'mdui';
import { getCookie } from 'typescript-cookie';
import { themeChanger, versionCheck } from './function/main';

let $ = mdui.$;

type ThemeStatus = 'auto' | 'light' | 'dark';

// 尝试从cookit获取主题信息
const themeStatus: ThemeStatus = ['auto', 'light', 'dark'].includes(String(getCookie('theme')))
    ? (getCookie('theme') as ThemeStatus)
    : 'auto';
themeChanger(themeStatus);

// 勾选当前主题色
$(`input[name="主题色"][value="${themeStatus}"]`).prop('checked', true);

// 应用主题色
$('#page-settings-theme-apply').on('click', () => {
    const themeStatus = $('input[name="主题色"]:checked').val() as 'auto' | 'light' | 'dark';
    themeChanger(themeStatus);
    $(`input[name="主题色"][value="${themeStatus}"]`).prop('checked', true);
});

// 版本号
$('#version').text(__APP_VERSION__);

$('#page-settings-versionCheck').on('click', () => {
    let dom = document.querySelector('#page-settings-versionCheck-message') as HTMLElement;
    dom.innerHTML = '请求中 .';

    let count = 1;
    const interval = setInterval(() => {
        count = count === 3 ? 1 : count + 1;
        dom.innerHTML = '请求中 ' + '.'.repeat(count);
    }, 500);
    versionCheck()
        .then(({ isLast, lastVersion }) => {
            clearInterval(interval);
            if (isLast === true) {
                dom.innerText = '已经是最新版本!';
            } else if (['https:', 'http:'].includes(window.location.protocol)) {
                dom.innerText = `发现新版本 ${lastVersion} ! 请联系网站管理员更新部署.`;
            } else {
                dom.innerText = `发现新版本 ${lastVersion} ! 请前往 Github 下载新版本.`;
            }
        })
        .catch(err => {
            clearInterval(interval);
            dom.innerText = `向 Github 的请求出现错误: ${err}`;
        });
});
