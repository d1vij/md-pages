import path from "path";
import fs from "fs";

import DOMPurify from "isomorphic-dompurify";
import { JSDOM } from "jsdom";
import { ENV } from "./env.js";

let header: string | undefined = undefined;
let htmlTemplate: string | undefined = undefined;

// injects scripts and styles into the built html
// works as a postprocessor hook for marked js
// called after the whole html is built
export function injector(html: string): string {
    if (header === undefined || htmlTemplate === undefined) {
        init();
    }

    // sanitize html before appending header cuz otherwise
    // dompurify would strip out the custom <script> tag
    const clean = DOMPurify.sanitize(html);

    const window = new JSDOM(htmlTemplate).window;

    window.document.body.innerHTML += header;
    window.document.getElementById(ENV.markdown_container_id)!.innerHTML = clean;

    return "<!DOCTYPE html>" + window.document.documentElement.outerHTML;
}

function init() {
    const script = fs.readFileSync(path.join(ENV.assetsPath, "bundle.js"), { encoding: "utf-8" });
    const styles = fs.readFileSync(path.join(ENV.assetsPath, "bundle.css"), { encoding: "utf-8" });

    htmlTemplate = fs.readFileSync(path.join(ENV.assetsPath, "index.html"), { encoding: "utf-8" });
    header = "<!-- Script -->\n"
        + "<script>"
        + script
        + "</script>"
        + "\n<!-- Styles -->\n"
        + "<style>"
        + styles
        + "</style>";
}