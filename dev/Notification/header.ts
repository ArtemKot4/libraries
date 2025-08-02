/**
 * Данная библиотека была разработана для упрощения создания экранных анимаций.
 * Библиотека разработана с упором на производительность и высокую скорость работы, что позволяет вам создавать собственные анимации.
 * 
 * Я признателен вам за использование библиотеки и надеюсь, что вы понимаете: 
 * код открыт для ознакомления, однако копирование любой части вне контекста использования данной библиотеки недопустимо.
 *
 * Автор проекта: ArtemKot — github.com/ArtemKot4
 * Год основания: 2025
 * Вопросы можете задать мне в discord: discordapp.com/users/908847403073937419
 */

LIBRARY({
    name: "Notification",
    shared: true,
    version: 1,
    api: "CoreEngine"
});

let screenName = null;

function separateText(text: string, lineSize: number = 25): string {
    const result: string[] = [];
    let line = "";

    for(let word of text.split(" ")) {
        if(line.length + word.length <= lineSize) {
            line += word + " ";
        } else {
            result.push(line.trim());
            line = word + " ";
        }
    }

    if(line) {
        result.push(line.trim());
    }

    return result.join("\n");
}