import mdui from 'mdui';
import { getCookie } from 'typescript-cookie';
import { themeChanger } from './function/main';

let $ = mdui.$;

// 尝试从cookit获取主题信息
const themeStatus: 'auto' | 'light' | 'dark' = ['auto', 'light', 'dark'].includes(String(getCookie('theme')))
    ? (getCookie('theme') as 'auto' | 'light' | 'dark')
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
