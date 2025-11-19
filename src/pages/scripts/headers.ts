import {showToast} from "./showToast";
import { markdownContainer } from "./script";
import { copyToClipboard } from "./copyToClipboard";

export function addLinksToHeaders() {
    const headers = Array.from(markdownContainer.querySelectorAll<HTMLHeadingElement>(".md-header"));

    for (const headerElm of headers) {
        headerElm.addEventListener("click", async (e) => {
            const target = e.target as HTMLHeadingElement;
            const url = new URL(`/#${target.id}`, window.location.origin).toString();

            await copyToClipboard(url);
            showToast("Copied link to clipboard!");
        })
    }
}