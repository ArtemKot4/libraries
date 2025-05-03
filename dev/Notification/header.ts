/**
 * Библиотека открыта для всех желающих легко создавать анимации, подобные анимациям достижений из Java издания игры.
 *
 * Я признателен вам за использование библиотеки и надеюсь, что вы понимаете: код открыт для ознакомления, однако копирование любой части недопустимо.
 *
 * Автор проекта: ArtemKot — github.com/ArtemKot4
 * Год основания: 2025
 * Вопросы можете задать в discord: discordapp.com/users/908847403073937419
 */

LIBRARY({
    name: "Notification",
    shared: true,
    version: 1,
    api: "CoreEngine"
});

let screenName = null;
Callback.addCallback("NativeGuiChanged", (name, lastName, isPushEvent) => {
    screenName = name;
});

function separateText(text: string, line_size: number = 25): string {
    let result: string[] = [];
    let line = "";

    for (let word of text.split(" ")) {
        if (line.length + word.length <= line_size) {
            line += word + " ";
        } else {
            result.push(line.trim());
            line = word + " ";
        }
    }

    if (line) {
        result.push(line.trim());
    }

    return result.join("\n");
}