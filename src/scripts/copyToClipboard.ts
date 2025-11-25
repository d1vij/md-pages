export async function copyToClipboard(textContent: string) {
    try {
        await navigator.clipboard.writeText(textContent)
    } catch (err: any) {
        showToast("Error in copying to clipboard", err.name);
    }
}