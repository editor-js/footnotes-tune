import { make } from './dom';
import styles from './note.pcss';
import Popover from './popover';

/**
 * Note object
 */
export default class Note {
  /**
   * data-tune value
   */
  public static dataAttribute = 'footnote';

  /**
   * Note's content
   */
  public content = '';

  /**
   * Range which contain sup element
   */
  public range: Range;

  /**
   * Sup element
   */
  public node: HTMLElement = make('sup', styles['ej-fn-sup'], { contentEditable: 'false' });

  /**
   * Note's index
   */
  private _index = 0;

  /**
   * Editable popover
   */
  private popover: Popover;

  /**
   * @param rangeOrNode - range to insert sup or existing sup to hydrate
   * @param popover - editable popover
   */
  constructor(rangeOrNode: Range | HTMLElement, popover: Popover) {
    this.popover = popover;

    if (rangeOrNode instanceof Range) {
      this.range = rangeOrNode;
      rangeOrNode.insertNode(this.node);
    } else {
      this.node = rangeOrNode;
      this.node.contentEditable = 'false';
      this.node.classList.add(styles['ej-fn-sup']);

      this.range = new Range();

      this.range.selectNode(this.node);
    }

    this.node.dataset.tune = Note.dataAttribute;
    this.node.addEventListener('click', () => {
      this.popover.open(this);
    });
  }

  /**
   * Returns note's index
   */
  public get index(): number {
    return this._index;
  }

  /**
   * Updates note's index
   */
  public set index(index: number) {
    this._index = index;

    this.node.textContent = this._index.toString();
  }

  /**
   * Removes sup element from DOM
   */
  public remove(): void {
    this.node.remove();
  }
}
