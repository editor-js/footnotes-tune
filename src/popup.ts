import { make } from './dom';
import styles from './popup.pcss';
import Note from './note';
import { API } from "@editorjs/editorjs";

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
   * Editor.js API
   */
  private readonly api: API;

    /**
     * @param wrapper - Tune's wrapper
     * @param readOnly - flag shows if Editor is in read-only mode
     * @param api - Editor.js API
     */
    constructor(wrapper: HTMLElement, readOnly: boolean, api: API) {
      this.api = api;
      this.node = make('div', styles['ej-fn-popup'], {
        contentEditable: readOnly ? 'false' : 'true',
      });
      this.wrapper = wrapper;

      this.node.dataset.inlineToolbar = 'true';
      this.node.dataset.placeholder = this.api.i18n.t('Write a footnote');

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
      const isClickedInside = (e.target as HTMLElement).closest(`.${styles['ej-fn-popup']}`) !== null;
      const isClickedOnInlineToolbar = (e.target as HTMLElement).closest(`.ce-inline-toolbar`) !== null;

      if (isClickedInside || isClickedOnInlineToolbar) {
        return;
      }

      document.removeEventListener('click', this.onClickOutside, true);

      this.close();
    }
}
