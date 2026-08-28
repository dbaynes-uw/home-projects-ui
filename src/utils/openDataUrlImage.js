/**
 * Browsers block top-level navigation to data: URLs (used for phishing).
 * Convert the data URL to a Blob URL and open that instead, which is allowed.
 */
export function openDataUrlImage(dataUrl) {
  if (!dataUrl) return

  const [header, base64] = dataUrl.split(',')
  const mimeMatch = header.match(/data:(.*);base64/)
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/png'

  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  const blob = new Blob([bytes], { type: mimeType })
  const blobUrl = URL.createObjectURL(blob)

  const win = window.open(blobUrl, '_blank', 'noopener')
  if (win) {
    win.addEventListener('unload', () => URL.revokeObjectURL(blobUrl))
  } else {
    URL.revokeObjectURL(blobUrl)
  }
}
