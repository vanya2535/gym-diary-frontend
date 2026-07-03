export function getMessageFirstLine(content: string, maxLength = 80): string {
  const firstLine = content.split('\n')[0] ?? ''

  if (firstLine.length <= maxLength) {
    return firstLine
  }

  return `${firstLine.slice(0, maxLength)}…`
}
