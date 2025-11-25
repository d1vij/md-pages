import {showToast} from "./showToast";
import { copyToClipboard } from "./copyToClipboard";
import { markdownContainer } from "./script";

export function makeCodeBlocksCopyable() {
    const codeContainers = Array.from(markdownContainer.querySelectorAll<HTMLPreElement>(".md-code-container"));
    for (const container of codeContainers) {
        const langDisplay = container.querySelector<HTMLSpanElement>("span.md-code-langdisplay")!;
        langDisplay.addEventListener("click", async (event) => {
            event.preventDefault();
            const text = container.querySelector<HTMLDivElement>(".md-code")!.textContent;;
            await copyToClipboard(text);
            showToast("Copied snippet to clipboard!");
        })
    }
}
