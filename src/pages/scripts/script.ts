import "../styles/root.scss";
import "../styles/prism.js.scss";
import "../styles/toast.scss";


import { makeTablesCopyable } from "./tables";
import { addLinksToHeaders } from "./headers";
import { makeCodeBlocksCopyable } from "./codeblocks";


document.addEventListener("DOMContentLoaded", () => {
    makeCodeBlocksCopyable();
    addLinksToHeaders();
    makeTablesCopyable();
})

export const markdownContainer = document.getElementById("markdown") as HTMLDivElement;
