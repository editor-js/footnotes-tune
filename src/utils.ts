/**
 * Limits the frequency of calling a function
 *
 * @param {number} delay - delay between calls in milliseconds
 * @param {Function} fn - function to be throttled
 */
export function throttled(delay: number, fn: (...args: unknown[]) => void): (...args: unknown[]) => void {
  let lastCall = 0;

  return function (...args: unknown[]): void {
    const now = new Date().getTime();

    if (now - lastCall < delay) {
      return;
    }

    lastCall = now;

    return fn(...args);
  };
}

/**
 * Returns true if passed node is BR element
 *
 * @param node - node to check
 */
export function isBrTag(node: Node | null): node is HTMLBRElement {
  if (!node) {
    return false;
  }

  return node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'BR';
}

/**
 * Returns true if range is at the end of common ancestor container
 *
 * @param range - range to check
 */
export function isRangeAtEnd(range: Range): boolean {
  const container = range.commonAncestorContainer;

  switch (container.nodeType) {
    case Node.TEXT_NODE:
      return container.textContent?.length === range.endOffset && !container.nextSibling;

    case Node.ELEMENT_NODE:
      return container.childNodes.length === range.endOffset && !isBrTag(container.lastChild);
  }

  return false;
}

/**
 * Sets cursor to the end of element's content
 *
 * @param element - element to set selection in
 */
export function setSelectionAtEnd(element: HTMLElement): void {
  const selection = window.getSelection();
  const range = new Range();

  range.selectNodeContents(element);
  range.collapse();

  selection?.removeAllRanges();
  selection?.addRange(range);
}
