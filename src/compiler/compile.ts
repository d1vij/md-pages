import fs from "fs/promises";
import path from "path";

import { Marked } from "marked";

import { CustomRenderer } from "./CustomRenderer.js";
import { GFMAdmonitionsExtension } from "./GFMAdmonitionExtension.js";
import { injector } from "./Injector.js";
import { initEnv, ENV } from "./env.js";


initEnv({
    markdown_container_id: "markdown",
    base_url: "",
    origin: "http://localhost:20000",
    rootPath: path.resolve(path.dirname(import.meta.filename), ".."),
    assetsPath: path.resolve(path.dirname(import.meta.filename), "../pages")
});

main().catch(console.log);

async function main() {

    const MARKDOWN_ROOT = path.join(ENV.rootPath, "../markdown");
    const MARKDOWN_ROOT_PATH_LENGTH = MARKDOWN_ROOT.length;
    const BUILD_PATH = path.join(ENV.rootPath, "../build");
    console.log(MARKDOWN_ROOT)


    const paths = await fs.readdir(MARKDOWN_ROOT, { recursive: true });

    for (const subPath of paths) {
        if (typeof subPath !== "string") continue;

        const srcPath = path.resolve(path.join(MARKDOWN_ROOT, subPath));
        const stat = await fs.stat(srcPath);
        if (!stat.isFile()) continue;

        // extract the file path with respect to the source folder
        // so /foo/bar/markdown/foobar/baz.md becomes /foobar/bas.md
        const rel = srcPath.slice(MARKDOWN_ROOT_PATH_LENGTH);

        if (subPath.endsWith(".md")) {

            const dirname = path.dirname(rel);
            const filename = path.basename(rel, ".md") + ".html";
            const outPath = path.join(BUILD_PATH, dirname, filename);

            const content = await fs.readFile(srcPath, "utf-8");

            ENV.base_url = new URL(path.posix.join("/build/", dirname, "/"), ENV.origin).toString();

            const md = new Marked({
                gfm: true,
                async: true,
                extensions: [GFMAdmonitionsExtension],
                hooks: {
                    postprocess: injector
                }
            });

            const compiledHtml = await md.parse(content, { renderer: new CustomRenderer() });

            await fs.mkdir(path.dirname(outPath), { recursive: true });
            await fs.writeFile(outPath, compiledHtml, "utf-8");
            console.log(`\x1b[33m*\x1b[0m Compilied \x1b[32m${rel}\x1b[0m`);

        } else {
            // copy other static assets as it is
            const outPath = path.join(BUILD_PATH, rel);
            await fs.copyFile(srcPath, outPath);
            console.log(`\x1b[34m*\x1b[0m Copied \x1b[32m${rel}\x1b[0m`)
        }
    }
}
