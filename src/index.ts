import styles from  './index.pcss';

import { API, BlockTune } from '@editorjs/editorjs';
import { make } from './dom';
import Popup from './popup';
import Note from './note';
import IconAddFootnote from './assets/add-footnote.svg';
import Shortcut from '@codexteam/shortcuts';

/**
 * @todo - rename "popup" to "popover"
 * @todo - add "Remove note" button to the Popover
 * @todo - hide popover on second click to the Note
 * @todo - On popover opening, place caret to the end of the text
 * @todo - Move popover on window resize
 * @todo - Add external 'config' with 'placeholder'
 * @todo - Find <sup>'s by data-attribute or classname, not only a tagname
 */

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
   * Editor.js API
   */
  private readonly api: API;

  /**
   * Shortcut instance
   */
  private shortcut: any;

  /**
   * @class
   *
   * @param data - data passed on render
   * @param api - Editor.js API
   */
  constructor({ data, api }: { data: FootnotesData, api: API }) {
    this.data = data;
    this.api = api;

    this.popup = new Popup(this.wrapper, api.readOnly.isEnabled, api);
  }

  /**
   * Render Tune icon
   *
   * @param range - current selected range
   */
  public render(range: Range): HTMLElement {
    const tuneWrapper = make('div', styles['ej-fn-tune']);
    const icon = make('div', styles['ej-fn-tune__icon'], {
      innerHTML: IconAddFootnote,
    });
    const label = make('div', styles['ej-fn-tune__label'], {
      innerText: this.api.i18n.t('Footnote'),
    });

    tuneWrapper.appendChild(icon);
    tuneWrapper.appendChild(label);

    if (!range || !this.wrapper.contains(range.startContainer)) {
      tuneWrapper.classList.add(styles['ej-fn-tune--disabled']);
    } else {
      tuneWrapper.addEventListener('click', () => {
        this.onClick(range);
      });
    }

    return tuneWrapper;
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

    this.shortcut = new Shortcut({
      on: this.wrapper,
      name: 'CMD+SHIFT+F',
      callback: (): void => {
        const selection = window.getSelection();

        if (!selection) {
          return;
        }

        const range = selection.getRangeAt(0);

        if (!range) {
          return;
        }

        this.onClick(range);
      },
    });

    return this.wrapper;
  }

  /**
   * Tune destory method to clean up
   */
  public destroy(): void {
    this.shortcut?.remove();
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
    this.popup.open(note);

    this.api.toolbar.toggleBlockSettings(false);
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

