import { TokenizerExtension, RendererExtension, Tokens } from "marked";
import { addClasses } from "./CustomRenderer.js";

// NOTE: Nested admonitions are broken

const ValidAdmonitions = [
    "note",
    "tip",
    "important",
    "warning",
    "caution",
    "unknown"
];
type ValidAdmonitionType = (typeof ValidAdmonitions)[number];

// 
const firstLineRegexp = new RegExp(/^\>\s+\[!(\w+)\]\s+(.*)?\s*\n*/i);

const bodyRegexp = new RegExp(/^(?:\>(?: )*\n)|(?:^\>(?: )(.*)\n?)/);
// const bodyRegexp = new RegExp(/^(?:(?:\>(?: )*)+\n)|(?:^(?:\>(?: )*)+(.*)\n?)/);

// titletokens would be parsed by this.parser.parseinline
// tokens would be parsed by this.parser.parse (cuz its block level)
export interface GFMAdmonitionToken extends Tokens.Generic {
    type: "gfm_admonition",
    raw: string, // Whole body of the admonition
    text: string, // Body text of the admonition
    title: string, // Inline title of the admonition
    titleTokens: [], // Tokens of the title
    admonitionType: ValidAdmonitionType, // Type of admonition is it 
    tokens: [], // Block level tokens
}

export const GFMAdmonitionsExtension: TokenizerExtension | RendererExtension = {
    name: "gfm_admonition",
    level: "block",

    // The function which tells marked js from where in my whole document does my custom block begin from
    // start(src: string) {
    //     const index = src.match(/(?:^|[\r\n])\>\s\[!note\]\s*/i)?.index ?? -1;

    //     // const index = src.match(/(?:^|[\r\n])\>\s\[!NOTE\]\s*\n(?:^\>\s+(?:.*)\n?)+/i)?.index;
    //     console.log(`Index ${index}`)
    //     return index;
    // },

    // This recieves the whole of unprocessed markdown string upto this point
    tokenizer(src: string, tokens): Tokens.Generic | undefined {

        // Split raw on newlines. This would split the whole document
        const lines = src.split(/\n/);

        const firstLine = lines.shift();
        if (firstLine === undefined) return;

        const match = firstLineRegexp.exec(firstLine);
        // if first line does not match startRegex, then return undefined,
        if (!match) return;
        let [_, admonitionType, title] = match;
        admonitionType = admonitionType.toLowerCase();
        // console.log(JSON.stringify(lines, null, 4))

        //we start from the second line
        const processedLines = [];
        for (let idx = 0; idx < lines.length; idx++) {
            const match = bodyRegexp.exec(lines[idx]);

            if (match) {
                processedLines.push(match[1])
                // console.log(`Line ==> ${lines[idx]} <== matched`)
            } else {
                // console.log(`Line ==> ${lines[idx]} <== DIDNOT MATCH`)
                break;
            }; // Break out if any of the next line doesnt match lineregex
        }

        if (processedLines.length === 0) return; //Nothing to tokenize


        // Raw include all the lines my tokenizer has matched
        // Markedjs removes all the stuff in "raw" string from the src and passes that src to the next tokenizer
        // essentially consuming it
        const raw = [firstLine, ...processedLines.map(l => "> " + l)].join('\n');
        const text = processedLines.join("\n");

        if (!ValidAdmonitions.includes(admonitionType)) {
            admonitionType = "unknown";
        }

        const token: GFMAdmonitionToken = {
            type: "gfm_admonition",
            raw: raw,
            text: text,
            title: title,
            titleTokens: [],
            admonitionType: admonitionType,
            tokens: [],
        }

        // Parse nested markdown
        this.lexer.inlineTokens(token.title, token.titleTokens);
        this.lexer.blockTokens(token.text, token.tokens);

        // console.log(JSON.stringify(token, null, 2))
        return token
    },

    renderer(this, _tokens) {
        const tokens = _tokens as GFMAdmonitionToken;

        // Parse block tokens
        const body = this.parser.parse(tokens.tokens);
        // Parse inline tokens
        const title = this.parser.parseInline(tokens.titleTokens);
        const admType = tokens.admonitionType.toLowerCase();

        return `<div ${addClasses("md-admonition", `md-admonition-${admType}`)}>`
            + `<span ${addClasses("md-admonition-title")}>`
            + `<span ${addClasses("md-admonition-icon")}></span>`
            + `${title}`
            + `</span>`
            + `<blockquote ${addClasses("md-blockquote")}>`
            + body
            + `</blockquote>`
            + `</div>`
    }
}


type myArray<T> = T[]
const myIntArray: myArray<number> = [1, 2, 3];
const myStrArray: myArray<string> = ['a', 'b'];

// Stuff like this can get complicated in normal code
interface a<in out ain>{

}