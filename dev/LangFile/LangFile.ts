interface ILangSettings {
    /**
     * Language
     */
    lang?: typeof LangFile.langs[any],
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
   const langFile = new LangFile("path/to/file.lang", {
        lang: "en",
        parseAdvanced: true
   });
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
	public static readonly langs = <const> ["ru", "en", "uk", "kz", "es", "pt", "zh"];

    /**
     * Path to file
     */

    public path?: string;

	/**
	 * String from file
	 */

	public readonly file: string;

	/**
	 * Settings to parse
     */

	public settings: ILangSettings;

	/**
	 * Entries in {[key: string]: string} format
	 */

	public entries: Record<string, string>;

	/**
	 * Keywords in {[key: string]: string} format
	 */

	public keywords: Record<string, string>;

	/**
	 * @param path file path
     * @param settings parse settings
     */

	public constructor(path: string, settings: ILangSettings) {
        settings = settings || {};

        if(!LangFile.langs.includes(settings.lang)) {
            throw new Error(`Wrong language "${settings.lang}" format`);
        }
        const file = FileTools.ReadText(path);
        if(file == null) {
            throw new Error(`File from path "${path}" is not found`);
        }

        this.entries = {};
        settings.parseAdvanced = settings.parseAdvanced || true;
        settings.commentFormat = settings.commentFormat || {};
        settings.commentFormat.inline = settings.commentFormat.inline || "#";
        this.file = file;

        if(settings.parseAdvanced == true) {
            this.keywords = {};
            settings.commentFormat.start = settings.commentFormat.start || "<-#";
            settings.commentFormat.end = settings.commentFormat.end || "#->";
            settings.keywordEmbedding = settings.keywordEmbedding || {
                start: "${",
                end: "}"
            };
            settings.concatMultiline = settings.concatMultiline || true;
            settings.multilineChar = settings.multilineChar || "`";
            this.settings = settings;
            this.parseAdvanced();
        } else {
            this.settings = settings;
            this.parse();
        }
	}

	/**
	 * Method to get entry [key, value] without comments.
	 * @param line line
	 * @param separator separator between key and value
	 */

	protected getEntry(line: string, separator: string): string[] {
		const entry = line.split(separator).map((v) => v.split(this.settings.commentFormat.inline)[0].trim());
        
        const index = entry.findIndex(v => !v);
        if(index != -1) {
            throw new Error(`Not valid format of ${ index == 0 ? "key" : "value" } at line "${line}"`);
        }
        return entry;
	}

    /**
     * Method to default parse file.
     */

	protected parse(): void {
		const lines = this.file.split("\n");
		for(const i in lines) {
			const line = lines[i].trim();
			const [key, value] = this.getEntry(line, "=");

			if(line.length == 0 || line.startsWith(this.settings.commentFormat.inline)) {
				continue;
			}

			this.entries[key] = value;
		}
	}

	/**
	 * Method to advanced parse file.
	 */

	protected parseAdvanced(): void {
		const lines = this.file.split("\n");
		let commentIndex = null;
		let longString = null;

		for(const i in lines) {
			let line = lines[i];
			if(line.startsWith(this.settings.commentFormat.inline)) {
				continue;
			}

			if(longString == null) {
				line = line.trim();
				if(line.length == 0) {
					continue;
				}
				const stringSymbol = line.indexOf(this.settings.multilineChar);
				if(stringSymbol != -1) {
					longString = line + (this.settings.concatMultiline ? "\n" : "");
					continue;
				}
			}

			if(longString != null) {
				const stringSymbol = line.indexOf(this.settings.multilineChar);
				if(stringSymbol != -1) {
					longString += line.substring(longString);
					line = longString.replaceAll(this.settings.multilineChar, "");
					longString = null;
				} else {
					longString += line + (this.settings.concatMultiline ? "\n" : "");
					continue;
				}
			}

			if(commentIndex != null) {
				const commentEnd = line.indexOf(this.settings.commentFormat.end);
				if(commentEnd == -1) {
					continue;
				}
				line = line.substring(commentEnd + this.settings.commentFormat.end.length);
				commentIndex = null;
			}

			if(!line.includes("=") && line.includes(":")) {
				const [key, value] = this.getEntry(line, ":");
				this.keywords[key] = value;
				continue;
			}

			const commentStart = line.indexOf(this.settings.commentFormat.start);
			if(commentIndex == null && commentStart != -1) {
				line = line.substring(0, commentStart);
				commentIndex = i;
			}

			if(line.includes(":=")) {
				const [key, value] = this.getEntry(line, ":=");
				this.keywords[key] = value;
				this.entries[key] = value;
				continue;
			}

			if(!line.includes("=")) {
				continue;
			}

			let [key, value] = this.getEntry(line, "=");

			if(value.includes(this.settings.keywordEmbedding.start)) {
				let index = 0;
				while(index < value.length) {
					const lastStart = value.indexOf(this.settings.keywordEmbedding.start, index);
					if(lastStart == -1) {
						break;
					}

					const lastEnd = value.indexOf(this.settings.keywordEmbedding.end, lastStart);
					if(lastEnd == -1) {
						throw new Error(`Wrong construction ${this.settings.keywordEmbedding.start} [keyword] ${this.settings.keywordEmbedding.end}`);
					}

					const keyName = value.substring(lastStart + (this.settings.keywordEmbedding.start.length), lastEnd);
					const keyValue = this.keywords[keyName];
					if(keyValue != undefined) {
						value = value.substring(0, lastStart) + keyValue + value.substring(lastEnd + this.settings.keywordEmbedding.end.length);
					}
					index = lastStart + keyValue?.length ?? 0;
				}
			}
			this.entries[key] = value;
		}
	}

	/**
	 * Method to register translations.
	 */

	public registerTranslations(): void {
		for(const key in this.entries) {
			Translation.addTranslation(key, {
				[this.settings.lang]: this.entries[key],
			});
		}
	}

    /**
     * Method to register translations from file.
     * @param path path
     * @param settings parse settings
     */

	public static registerTranslationsFrom(path: string, settings?: ILangSettings): LangFile {
		const file = new LangFile(path, settings);
		file.registerTranslations();
		return file;
	}
}
/*
const file = "" +
    "aboba:= абоба" + "\n" +
    "hi = `привет " + "\n"  + " ${aboba} " + "и не только`//hehe" + "\n" +
    "as = 1" + "and heh";
*/