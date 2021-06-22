import { make } from './dom';
import styles from './popup.pcss';
import Note from './note';

/**
 *
 */
export default class Popup {
    /**
     * Popup node
     */
    public node: HTMLElement;

    /**
     * Current note to edit
     */
    private currentNote: Note | null = null;

    /**
     * Tune's wrapper
     */
    private wrapper: HTMLElement;

    /**
     * @param wrapper - Tune's wrapper
     * @param readOnly - flag shows if Editor is in read-only mode
     */
    constructor(wrapper: HTMLElement, readOnly: boolean) {
      this.node = make('div', styles['ej-fn-popup'], { contentEditable: readOnly ? 'false' : 'true' });
      this.wrapper = wrapper;

      /**
       * If enter pressed, close the popup
       */
      this.node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.stopPropagation();
          e.preventDefault();

          this.close();
        }
      }, true);

      this.onClickOutside = this.onClickOutside.bind(this);
    }

    /**
     * Opens popup
     *
     * @param note - note to edit
     */
    public open(note: Note): void {
      this.currentNote = note;
      this.node.innerHTML = note.content;

      document.addEventListener('click', this.onClickOutside, true);

      this.move(note);

      this.node.classList.add(styles['ej-fn-popup--opened']);
      this.node.focus();
    }

    /**
     * Closes popup and saves note's content
     */
    public close(): void {
      if (this.currentNote) {
        this.currentNote.content = this.node.innerHTML;
        this.currentNote = null;
      }

      this.node.classList.remove(styles['ej-fn-popup--opened']);
    }

    /**
     * Move popup to passed note
     *
     * @param note - current editable note
     */
    private move(note: Note): void {
      const { node } = note;
      const topMargin = 5;
      const leftMargin = -250;

      const wrapperRect = this.wrapper.getBoundingClientRect();
      const rect = node.getBoundingClientRect();

      this.node.style.top = (rect.bottom - wrapperRect.top + topMargin) + 'px';
      this.node.style.left = (rect.left + leftMargin) + 'px';
    }

    /**
     * Click outside handler to close the popup
     *
     * @param e
     */
    private onClickOutside(e: MouseEvent): void {
      if (e.target === this.node) {
        return;
      }

      document.removeEventListener('click', this.onClickOutside, true);

      this.close();
    }
}
