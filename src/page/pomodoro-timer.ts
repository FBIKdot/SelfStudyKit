import mdui from 'mdui';
import { PomodoroTimer } from './function/pomodoroTimer';

let $ = mdui.$;

const instance = new PomodoroTimer('#page-pomodoro-timer-display div');

$('#page-pomodoro-timer-options input')
    .eq(3)
    .on('click', () => {
        let checked = $('#page-pomodoro-timer-options input').eq(3).prop('checked');
        $('#page-pomodoro-timer-options input')
            .eq(2)
            .attr('disabled', !checked ? 'true' : null);
        $('#page-pomodoro-timer-options label')
            .eq(2)
            .text(checked ? '长休息时间 (分钟)' : '已关闭 长休息时间 (分钟)');
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
        instance.start(settings.pomodoro, settings.short_break, settings.long_break, 100);
    }
});
$('#button-pomodoro-timer-next').on('click', () => instance.next());
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
                onClick: () => instance.stop(),
            },
        ],
    });
});

