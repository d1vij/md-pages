import { Renderer, Tokens } from "marked";
import { resolveRelativeUrl } from "./baseUrl.js";
import { ENV } from "./env.js";

/**
 * Ok so each renderer is defined for each element and each function is passed a token object
 * which first must be parsed inline (cuz nested html might be there) using this.parser.parseInline
 * other relevant properties to that element is there in the Tokens.<elm name> interface
 */

export enum MarkdownClasses {
    "md-header",
    "md-header-1",
    "md-header-2",
    "md-header-3",
    "md-header-4",
    "md-header-5",
    "md-header-6",
    "md-paragraph",
    "md-image",
    "md-anchor",
    "md-pre",
    "md-code",
    "md-code-container",
    "md-code-langdisplay",
    "md-list",
    "md-list-item",
    "md-list-ordered",
    "md-list-unordered",
    "md-hr",
    "md-blockquote",
    "md-codespan",

    "md-admonition",
    "md-admonition-TYPE",
    "md-admonition-title",
    "md-admonition-icon",

    "md-table", // <table>
    "md-table-head", // <thead>
    "md-table-header", // <th>
    "md-table-body", //tbody
    "md-table-row", // <tr>
    "md-table-data", // <td>
    "md-table-data-align-center",
    "md-table-data-align-left",
    "md-table-data-align-right",
}

export function addClasses(...classes: string[]): string {
    const joined = classes.join(' ');
    return `class="${joined}"`;
}


function normalizeHeader(text: string): string {
    // Converts string to lowercase and replaces spaces with dashes
    return text.toLowerCase().replaceAll(/\s/g, '-');
}

export class CustomRenderer extends Renderer {
    public override heading(token: Tokens.Heading): string {
        const headerContent = this.parser.parseInline(token.tokens);
        const id = normalizeHeader(headerContent);
        return `<h${token.depth} ${addClasses("md-header", `md-header-${token.depth}`)} id=${id} >${headerContent}</h${token.depth}>`;
    }

    public override paragraph(token: Tokens.Paragraph): string {
        const inner = this.parser.parseInline(token.tokens);
        return `<p ${addClasses("md-paragraph")} >${inner}</p>`;
    }

    public override image({ href, title, text, tokens }: Tokens.Image): string {
        const inner = this.parser.parseInline(tokens);
        const absoluteHref = resolveRelativeUrl(ENV.base_url, href);
        return `<img ${addClasses("md-image")} src="${absoluteHref}" draggable=false alt=${text}>`;
    }

    public override link({ href, title, tokens }: Tokens.Link): string {
        const inner = this.parser.parseInline(tokens);
        const absoluteHref = resolveRelativeUrl(ENV.base_url, href);
        return `<a ${addClasses("md-anchor")} href="${absoluteHref}" title=${title}>${inner}</a>`;
    }

    public override code({ text, lang, escaped }: Tokens.Code): string {
        const content = text.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
        // code block enclosed in pre tags is returned to follow prism.js conventions
        return `<div ${addClasses("md-code-container")}><pre ${addClasses("md-pre", `language-${lang}`)}><code ${addClasses("md-code", `language-${lang}`)}>${content}</code></pre><span ${addClasses("md-code-langdisplay")}>${lang}</span></div>`;
    }

    public override list(token: Tokens.List): string {
        const ordered = token.ordered;
        const start = token.start;

        let body = "";
        for (const item of token.items) {
            body += this.listitem(item);
        }

        const type = ordered ? "ol" : "ul";
        const startAttr = ordered && start !== 1 ? ` start="${start}"` : "";

        return `<${type}${startAttr} ${addClasses(
            "md-list",
            ordered ? "md-list-ordered" : "md-list-unordered"
        )}>\n${body}</${type}>\n`;
    }

    public override listitem(item: Tokens.ListItem): string {
        const inner = this.parser.parse(item.tokens);
        return `<li ${addClasses("md-list-item")}>${inner}</li>\n`;
    }

    public override hr(token: Tokens.Hr): string {
        return `<hr ${addClasses("md-hr")}>`
    }

    public override blockquote({ tokens }: Tokens.Blockquote): string {

        const inner = this.parser.parse(tokens);
        return `<blockquote ${addClasses("md-blockquote")}>`
              + inner
              + "</blockquote>";
    }    

    public override codespan({ text }: Tokens.Codespan): string {
        return `<code ${addClasses("md-codespan")}>`
              + text
              + "</code>";
    }


    // https://github.com/markedjs/marked/blob/60626572f1e16d256317b40f9472faa6b5a02352/src/Renderer.ts#L111
    public override table(token: Tokens.Table): string {

        const head = [];
        const body = [];

        for (const header of token.header) {
            head.push(this.tablecell(header));
        }
        for (const row of token.rows) {
            const parsedRow: string[] = []

            for (const cell of row) {
                parsedRow.push(this.tablecell(cell))
            }

            body.push(this.tablerow({ text: parsedRow.join("") }))
        }

        const tableHeaders = head.join("");
        const tableRows = body.join("");
        return `
        <table ${addClasses("md-table")} > 
            <thead ${addClasses("md-table-head")}>
                ${tableHeaders} 
            </thead>
            <tbody ${addClasses("md-table-body")}>
                ${tableRows}
            </tbody>
        </table>
        `
    }

    public override tablecell(token: Tokens.TableCell): string {
        const content = this.parser.parseInline(token.tokens)

        let type;
        let typeClass;
        if (token.header) {
            type = "th";
            typeClass = "md-table-header"
        } else {
            type = "td";
            typeClass = "md-table-data"
        }

        let alignClass;
        switch (token.align) {
            case "center": alignClass = "md-table-data-align-center";
            case "right": alignClass = "md-table-data-align-center";
            default: alignClass = "md-table-data-align-left";
        }

        return `<${type} ${addClasses(typeClass, alignClass)}>`
            + `${content}`
            + `</${type} >`
    }

    public override tablerow({ text }: Tokens.TableRow<string>): string {
        return `<tr ${addClasses("md-table-row")}> ${text} </tr>`
    }
}