export function getTyreImageUrl(filename) {
    const BASE_URL = import.meta.env.VITE_BASE_URL; // 👈 for Vite projects
    return `${BASE_URL}/Product/${filename}`; // adjust path if backend uses /Product or /uploads
  }
  
export function getBlogImageUrl(pathOrFilename) {
    if (!pathOrFilename) return '';
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    // Backend returns values like "Blog/blog-123.jpg". Ensure we don't duplicate slashes
    const normalized = pathOrFilename.startsWith('/') ? pathOrFilename.slice(1) : pathOrFilename;
    return `${BASE_URL}/${normalized}`;
}

export function formatDateTime(isoString) {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        // Example: 08 Oct 2025, 5:33 PM
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    } catch {
        return '';
    }
}

/**
 * Format currency value as Australian Dollars (AUD)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string with AU$ prefix
 */
export function formatCurrency(amount) {
    return `AU$${Number(amount).toFixed(2)}`;
}