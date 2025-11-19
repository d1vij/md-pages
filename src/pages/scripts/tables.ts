import {showToast} from "./showToast";
import { copyToClipboard } from "./copyToClipboard";
import { markdownContainer } from "./script";

function __getDataFromTable(table: HTMLTableElement): string[][] {
    // Since GFM doesnt allow for table headers with sub columns, we can just iterate over all nodes and scrape table data.
    // So we can also assume that the the first row of the data array would always be the heading row of the table.

    const data: string[][] = [];

    const headingElms = Array.from(table.querySelectorAll<HTMLTableRowElement>("thead th"));

    const headings = [];
    for (const headingElm of headingElms) {
        headings.push(headingElm.innerText);
    }
    data.push(headings);

    const rowElms = Array.from(table.querySelectorAll<HTMLTableRowElement>("tbody tr"));
    for (const rowElm of rowElms) {
        const cells = Array.from(rowElm.querySelectorAll<HTMLTableCellElement>("td"));
        const row = [];
        for (const cell of cells) {
            row.push(cell.innerText);
        }

        data.push(row);
    }

    return data;
}

export function makeTablesCopyable() {
    const tableNavbarTemplate = document.querySelector<HTMLTemplateElement>("template#tables-copy-template")!;

    const tables = markdownContainer.querySelectorAll<HTMLTableElement>("table.md-table");

    for (const table of tables) {
        const clone = tableNavbarTemplate.content.cloneNode(true) as DocumentFragment;
        const container = clone.querySelector<HTMLDivElement>("div.md-table-navbar")!;

        table.appendChild(container);
        container.querySelector<HTMLButtonElement>("button[data-as='html']")!.addEventListener("click", async () => {
            const data = __getDataFromTable(table);
            const headings = `<tr>\n<th>${data.shift()!.join('</th>\n<th>')}</th>\n</tr>`

            let body = ""
            // We have removed the first heading row
            for (const row of data) {
                body += `<tr>\n<th>${row.join('</th>\n<th>')}</th>\n</tr>`
            }
            const tableHtml = "<table>\n"
                + headings
                + "\n"
                + body
                + "\n</table>";

            await copyToClipboard(tableHtml);
            showToast("Copied table to clipboard as html");
        });

        container.querySelector<HTMLButtonElement>("button[data-as=csv]")!.addEventListener("click", async () => {
            const delims = [',', ';', '|', '^'];
            const raw = table.innerText;

            let delim;
            for (delim of delims) {
                if (Boolean(raw.match(delim)) == false) break;
            }

            let data = "";
            for (const row of __getDataFromTable(table)) {
                data += "\n" + row.join(delim);
            }
            await copyToClipboard(data);
            showToast("Copied table to clipboard as csv", `Data delimited by ${delim}`);
        });

        container.querySelector<HTMLButtonElement>("button[data-as=json]")!.addEventListener("click", async () => {
            const data = __getDataFromTable(table);
            await copyToClipboard(JSON.stringify(data, null, 2));
            showToast("Copied table to clipboard as json")
        });

    }
}