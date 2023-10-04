import mdui from 'mdui';
import { getCookie } from 'typescript-cookie';
import { themeChanger } from './main';

let $ = mdui.$;

// Cookie
const themeStatus: string = getCookie('theme') || 'auto';
themeChanger(themeStatus);

// 锁住panel. 因为懒得设计ui
$('#page-settings-panel .mdui-panel-item')
    .get()
    .forEach(element => {
        $(element).on('click', () => {});
    });

// 勾选当前主题色
$(`input[name="主题色"][value="${themeStatus}"]`).prop('checked', true);

// 应用主题色
$('#page-settings-theme-apply').on('click', () => {
    const themeStatus = $('input[name="主题色"]:checked').val() as string;
    themeChanger(themeStatus);
    $(`input[name="主题色"][value="${themeStatus}"]`).prop('checked', true);
});
