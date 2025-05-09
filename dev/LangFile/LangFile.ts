/**
 * Class to read, manipulate and register translations from .lang files in defined format from library.
 * @example
   ```lang
   //lang file start
   rocketTier: 1 tier //register keyword
   mod.rocket = I am rocket from mod and my tier is ${rocketTier} //register translation, keyword inside line
 
   mod.version := 1.0.0 //register translation and keyword
   mod.info = I am mod, adds ${rocketTier} rocket and my version is ${version}
   //lang file end
   ```
   ```javascript
   //in mod
   const langFile = new LangFile("path/to/file.lang", "en", "//");
   Game.message(JSON.stringify(langFile.keywords)); 
   //{
   //"rocketTier": "1 tier", 
   //"version": "1.0.0"
   //}
   Game.message(JSON.stringify(langFile.entries)); 
   //{
   //"mod.rocket": "I am rocket from mod and my tier is 1 tier",
   //"mod.version": "I am mod, adds 1 tier rocket and my version is 1.0.0"
   //}
   langFile.registerTranslations();
   alert(Translation.translate("mod.rocket")) // I am rocket from mod and my tier is 1 tier
   ```
 */
class LangFile {
    /**
     * List of supports languages
     */
    public static readonly langs: string[] = ["ru", "en", "uk", "kz"];
    /**
     * Language
     */
    public readonly lang: string;
    /**
     * String from file
     */
    public readonly file: string;
    /**
     * Comment format
     * @default //
     */
    public commentFormat: string;
    /**
     * Entries in {[key: string]: string} format
     */
    public entries: Record<string, string> = {};
    /**
     * Keywords in {[key: string]: string} format
     */
    public keywords: Record<string, string> = {};
    /**
     * @param path file path
     * @param lang file language
     * @param commentFormat comment format
     */
    public constructor(path: string, lang: string = "en", commentFormat?: string) {
        if(!LangFile.langs.includes(lang)) {
            throw new Error("Wrong language format");
        }
        const file = FileTools.ReadText(path);
        if(file == null) {
            throw new Error(`File from path "${path}" is not found`);
        }
        this.lang = lang;
        this.commentFormat = commentFormat || "//";
        this.file = file;
        this.parse()
    }
    /**
     * Method to get entries without comments
     * @param line line
     * @param separator separator between key and value
     */
    protected getEntry(line: string, separator: string): string[] {
        return line.split(separator).map((v) => v.split(this.commentFormat)[0].trim());
    }
    /**
     * Parse file
     */
    protected parse(): void {
        const entries = {};
        const keywords = {};
        const splited = this.file.split("\n");

        for (const i in splited) {
            const line = splited[i].trim();

            if(line.length == 0) {
                continue;
            }

            if(line.startsWith(this.commentFormat)) {
                continue;
            }

            if(!line.includes("=") && line.includes(":")) {
                const [key, value] = this.getEntry(line, ":");
                keywords[key] = value;
                continue;
            }

            if(line.includes(":=")) {
                const [key, value] = this.getEntry(line, ":=");
                keywords[key] = value;
                entries[key] = value;
                continue;
            }

            if(!line.includes("=")) {
                continue;
            }

            let [key, value] = this.getEntry(line, "=");

            if(value.includes("${")) {
                let index = 0;
                while(index < value.length) {
                    const lastStart = value.indexOf("${", index);
                    if(lastStart == -1) {
                        break;
                    }

                    const lastEnd = value.indexOf("}", lastStart);
                    if(lastEnd == -1) {
                        throw new Error("Wrong construction ${ [keyword] }");
                    }

                    const keyName = value.slice(lastStart + 2, lastEnd);
                    const replacement = keywords[keyName];
                    if(replacement != undefined) {
                        value = value.slice(0, lastStart) + replacement + value.slice(lastEnd + 1);
                    }
                    index = lastStart + replacement.length || 0;
                }
            }
            entries[key] = value;
        }
        this.entries = entries;
        this.keywords = keywords;
    }
    /**
     * Register translations
     */
    public registerTranslations(): void {
        for(const key in this.entries) {
            Translation.addTranslation(key, {
                [this.lang]: this.entries[key]
            })
        }
    }

    public static registerTranslationsFrom(path: string, lang: string, commentFormat?: string): LangFile {
        const file = new LangFile(path, lang, commentFormat);
        file.registerTranslations();
        return file;
    }
}