export  function showToast(title: string, content: string = "") {
    const toastTemplate = document.querySelector<HTMLTemplateElement>("#toast-template")!;
    const toastStack = document.querySelector<HTMLDivElement>("#toast-stack")!;
    const toast = toastTemplate.content.cloneNode(true) as DocumentFragment;
    const container = toast.querySelector<HTMLDivElement>(".toast-notification")!;
    container.querySelector<HTMLSpanElement>(".toast-title")!.innerText = title;
    container.querySelector<HTMLSpanElement>(".toast-body")!.innerText = content;
    container.classList.add("animate-slide-in");

    container.addEventListener("click", () => {
        container.classList.add("animate-slide-out");
        setTimeout(() => container.remove(), 1000); //Wait for the animation to finish
    })
    setTimeout(() => {
        container.classList.add("animate-slide-out");
        setTimeout(() => container.remove(), 1000); //Wait for the animation to finish
    }, 5000);

    toastStack.appendChild(container);
}