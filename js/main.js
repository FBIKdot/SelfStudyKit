console.log("awa");

let $ = mdui.$;

/* 使用js调用mdui tab选项卡, 实现页面切换 */
var page = new mdui.Tab('#page-changer');
$('#link-index').on('click', () => page.show(0));
$('#link-welcome').on('click', () => page.show(1));
