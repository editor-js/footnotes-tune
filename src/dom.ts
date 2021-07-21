/**
 * Helper for making Elements with attributes
 *
 * @param  {string} tagName           - new Element tag name
 * @param  {Array|string} classNames  - list or name of CSS classname(s)
 * @param  {object} attributes        - any attributes
 * @returns {Element}
 */
export function make<E extends HTMLElement = HTMLElement>(
  tagName: string,
  classNames: string | string[] = '',
  attributes: Partial<E> = {}
): E {
  const el = document.createElement(tagName) as E;

  if (Array.isArray(classNames)) {
    el.classList.add(...classNames);
  } else if (classNames) {
    el.classList.add(classNames);
  }

  for (const attrName in attributes) {
    if (!Object.prototype.hasOwnProperty.call(attributes, attrName)) {
      continue;
    }

    el[attrName] = attributes[attrName]!;
  }

  return el;
}
