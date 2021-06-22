import styles from  './index.pcss';

import { API, BlockTune } from '@editorjs/editorjs';
import { make } from './dom';
import Popup from './popup';
import Note from './note';

/**
 * Type of Footnotes Tune data
 */
export type FootnotesData = string[];

/**
 * FootnotesTune for Editor.js
 */
export default class FootnotesTune implements BlockTune {
  /**
   * Specify this is a Block Tune
   */
  public static isTune = true;

  /**
   * Sanitize config for Tune
   */
  public static sanitize = {
    sup: {},
  };

  /**
   * Tune's wrapper for tools' content
   */
  private wrapper = make('div', styles['ej-fn-wrapper']);

  /**
   * Editable popup for notes
   */
  private popup: Popup;

  /**
   * Notes for Tool
   */
  private notes: Note[] = [];

  /**
   * We need to observe mutations to check if footnote removed
   */
  private observer = new MutationObserver(this.contentDidMutated.bind(this));

  /**
   * Data passed on render
   */
  private readonly data: string[] = [];

  /**
   * @class
   *
   * @param data - data passed on render
   * @param api - Editor.js API
   */
  constructor({ data, api }: { data: FootnotesData, api: API }) {
    this.data = data;

    this.popup = new Popup(this.wrapper, api.readOnly.isEnabled);
  }

  /**
   * Render Tune icon
   *
   * @param range - current selected range
   */
  public render(range: Range): HTMLElement {
    const button = make('div');

    button.innerText = 'FN';

    button.addEventListener('click', () => {
      this.onClick(range);
    });

    return button;
  }

  /**
   * Saves notes data
   */
  public save(): FootnotesData {
    return this.notes.map(note => note.content);
  }

  /**
   * Wraps plugins content with Tune's own wrapper
   *
   * @param pluginsContent - Tool's content
   */
  public wrap(pluginsContent: HTMLElement): HTMLElement {
    this.wrapper.append(pluginsContent, this.popup.node);

    this.hydrate(pluginsContent);

    this.observer.observe(this.wrapper, {
      childList: true,
      subtree: true,
    });

    return this.wrapper;
  }

  /**
   * Callback on click on Tunes icon
   *
   * @param range - selected range at Editor zone
   */
  private onClick(range: Range): void {
    range.collapse(false);

    const note = new Note(range, this.popup);

    this.insertNote(note);
  }

  /**
   * Inserts new note to notes array
   *
   * @param newNote - note to insert
   */
  private insertNote(newNote: Note): void {
    let nextNoteIndex = this.notes.findIndex(note =>
      newNote.range.compareBoundaryPoints(Range.START_TO_START, note.range) === -1
    );

    if (nextNoteIndex === -1) {
      nextNoteIndex = this.notes.length;
    }

    this.notes.splice(nextNoteIndex, 0, newNote);
  }

  /**
   * Mutation Observer callback
   *
   * @param mutationsList - mutation records array
   */
  private contentDidMutated(mutationsList: MutationRecord[]): void {
    const shouldUpdateIndices = mutationsList.some(record => {
      const supAdded = Array.from(record.addedNodes).some(node => node.nodeName === 'SUP');
      const supRemoved = Array.from(record.removedNodes).some(node => {
        if (node.nodeName !== 'SUP') {
          return false;
        }

        const index = parseInt(node.textContent || '-1');

        this.notes.splice(index - 1, 1);

        return true;
      });

      return supAdded || supRemoved;
    });

    /**
     * If sup element was added or removed, we need to update indices
     */
    if (shouldUpdateIndices) {
      this.updateIndices();
    }
  }

  /**
   * Updates notes indices
   */
  private updateIndices(): void {
    this.notes.forEach((note, i) => note.index = i + 1);
  }

  /**
   * Hydrate content passed on render
   *
   * @param content - Tool's content
   */
  private hydrate(content: HTMLElement): void {
    const sups = content.querySelectorAll('sup');

    sups.forEach((sup, i) => {
      const note = new Note(sup, this.popup);

      note.content = this.data[i];
      this.notes.push(note);
    });
  }
}

