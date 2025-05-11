## LangFile Library

LangFile - это библиотека, добавляющая широкие возможности для создания переводов. Можно использовать как специальный формат хранения строк если нужно.

#### Рассмотрим возможности:

##### Создание переменных (keywords):

Псевдонимы строк, или ключевые слова, или переменные - строки, хранящиеся по ключам, создающиеся при помощи оператора ":". Слева операнда ключ, справа значение.

```lang
version: 10
```

Переменные можно использовать внутри переводов при помощи встраивания. Встраиваний может быть сколько угодно. Формат по умолчанию: ${ [keyword] }.

```lang
mod.info = Этот мод версии ${version}
```

Важно! Изменение значений переменных из кода не изменит их значений в переводах. Это статичные значения после сборки.

Используйте, если вам нужно записать что-то в более краткий формат. Например цвета:

```lang
white: \u00A7f
mod.apple = ${white} яблоко
```

##### Создание переводов (entries):

Переводы создаются при помощи оператора "=". Слева операнда ключ. справа значение. 

```lang
mod.author = I am Steve
```

Поддерживаются многострочные значения. Внутри и в конце блока комментарии не игнорируются. Используйте это если нужно.

```lang
mod.authors = `I am Steve
I am Henry` #просто комментарий
```

##### Комментарии

Комментарии создаются при помощи оператора "#" по умолчанию. Могут быть в начале строки, или в любом месте. Всё, что находится внутри, не учитывается.

```lang
#просто комментарий
mod.theme = Магия #просто комментарий
```

Многострочные комментарии:

```lang
welcome = Приветствую %s! #->
Хорошего дня!
<-#
```

##### Слияние переводов и переменных

Библиотека допускает слияние переводов с переменными при помощи оператора ":=".

```lang
переменная_и_перевод := значение
```

В настоящем применении выглядит это примерно так:

```lang
version: 10
mod.game := Minecraft
mod.info = Я мод, написанный для игры ${mod.name}, версии ${version}
```

В данном случае mod.game это и перевод, и переменная, а version - просто переменная, которая не будет добавлена при регистрации переводов как перевод.

### Давайте отойдём от .lang файлов и перейдём уже непосредственно к нашему коду:

##### Регистрация файла:

```javascript
const langFile = new LangFile(__dir__ + "resources/assets/lang/en.lang", {
    lang: "en"
});
```

Тут мы создали переменную, являющуюся экземпляром нового класса LangFile. Первый параметр это полный путь до файла, а второй интереснее.

Давайте рассмотрим объект описания:

```ts
interface ILangSettings {
    /**
     * Language
     */
    lang?: string,
    /**
     * Concats lines with \n, if you use multiline format of value
     * @default true
     */
    concatMultiline?: boolean,
    /**
     * Enables more of performances. If it's false, it will parse faster, but considerings only inline comments.
     * @default false
     */
    parseAdvanced?: boolean,
    /**
     * Format of comments
     */
    commentFormat?: {
        /**
         * @default #
         */
        inline?: string
        /**
         * @default #->
         */
        start?: string,
        /**
         * @default <-#
         */
        end?: string
    },
    /**
     * Char to embed multiline
     * @default `
     */
    multilineChar?: string,
    /**
     * Char to embed keywords
     */
    keywordEmbedding?: {
        /**
         * @default ${
         */
        start: string,
        /**
         * @default }
         */
        end: string
    }
}
```

Второй аргумент - это настройки для нашего небольшого интерпретатора, который собирает файл в итоговые переводы. Рекомендуется включить parseAdvanced, если вы собираетесь использовать возможности выше стандартного формата lang из Minecraft.

#### Регистрация переводов:

Переводы регистрируются при помощи метода registerTranslations.

```javascript
langFile.registerTranslations();
alert(Translation.translate("mod.author")) // I am Steve
```

Тут мы зарегистрировали наши переводы, и теперь можем узнать их.

Если вы не хотите сохранять переводы в переменную или просто сразу же зарегистрировать, можете использовать статический метод LangFile.registerTranslationsFrom(path: string, settings?: ILangSettings): LangFile.

```javascript
LangFile.registerTranslationsFrom(__dir__ + "resources/assets/lang/en.lang", {
    lang: "en"
});
```

#### Получение значений переменных:

```javascript
Game.message(JSON.stringify(langFile.keywords)); /*
{
  "white": "\u00A7f",
  "mod.game": "Minecraft", 
  "version": "10"
}
*/
```

#### Получение значений переводов:

```javascript
Game.message(JSON.stringify(langFile.entries)); /*
{
  "mod.info": "Я мод, написанный для игры Minecraft, версии 10",
  "mod.apple": "\u00A7f яблоко",
  "mod.authors": "I am Steve\nI am Alex",
  "mod.theme": "Магия",
  "mod.game": "Minecraft"
}
*/
```

Важно! Из переводов удаляются все лишние пробелы, поэтому учитывайте это заранее.
