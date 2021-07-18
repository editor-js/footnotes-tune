import popupStyles from '../../src/popup.pcss';
import EditorJS, { OutputData } from '@editorjs/editorjs';

describe('Data manipulations', () => {
  describe('saving', () => {
    beforeEach(() => {
      cy.initEditorJS().as('EditorJS');
    });

    it('should save sup element for block content', () => {
      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .click()
        .type('Some text{command}{shift}F');

      cy.getEditor({ block: 0 })
        .find(`.${popupStyles['ej-fn-popup']}`)
        /**
         * For some reason cypress inserts F from shortcut to a popup
         */
        .type('{selectall}{backspace}')
        .type('This text is inside the popup{selectall}');

      cy.getEditor()
        .click();

      cy.get<EditorJS>('@EditorJS')
        .then(async (editor) => {
          const data = await editor.save();

          const paragraph = data.blocks[0];

          expect(paragraph.data.text).to.eq('Some text<sup>1</sup>');
        });
    });

    it('should save tunes object with footnote', () => {
      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .click()
        .type('Some text{command}{shift}F');

      cy.getEditor({ block: 0 })
        .find(`.${popupStyles['ej-fn-popup']}`)
        /**
         * For some reason cypress inserts F from shortcut to a popup
         */
        .type('{selectall}{backspace}')
        .type('This text is inside the popup{selectall}');

      cy.getEditor()
        .click();

      cy.get<EditorJS>('@EditorJS')
        .then(async (editor) => {
          const data = await editor.save();

          const paragraph = data.blocks[0];

          expect(paragraph).to.have.property('tunes');
          expect(paragraph.tunes).to.have.property('footnote');
          expect(paragraph.tunes!.footnote).to.deep.eq([ 'This text is inside the popup' ]);
        });
    });

    it('should save tunes object with several footnotes', () => {
      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .click()
        .type('Some {command}{shift}F');

      cy.getEditor({ block: 0 })
        .find(`.${popupStyles['ej-fn-popup']}`)
        /**
         * For some reason cypress inserts F from shortcut to a popup
         */
        .type('{selectall}{backspace}')
        .type('This text is inside the first popup{selectall}');

      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .click()
        .type('{movetoend} text{command}{shift}F');

      cy.getEditor({ block: 0 })
        .find(`.${popupStyles['ej-fn-popup']}`)
        /**
         * For some reason cypress inserts F from shortcut to a popup
         */
        .type('{selectall}{backspace}')
        .type('This text is inside the second popup{selectall}');

      cy.getEditor()
        .click();

      cy.get<EditorJS>('@EditorJS')
        .then(async (editor) => {
          const data = await editor.save();

          const paragraph = data.blocks[0];

          expect(paragraph.tunes!.footnote).to.deep.eq(['This text is inside the first popup', 'This text is inside the second popup']);
        });
    });

    it('should save inline formatting for a footnote', () => {
      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .click()
        .type('Some text{command}{shift}F');

      cy.getEditor({ block: 0 })
        .find(`.${popupStyles['ej-fn-popup']}`)
        /**
         * For some reason cypress inserts F from shortcut to a popup
         */
        .type('{selectall}{backspace}')
        .type('This text is inside the popup{selectall}');

      cy.getEditor()
        .find('.ce-inline-toolbar')
        .find('button[data-tool=bold]')
        .first()
        .click();

      cy.getEditor()
        .click();

      cy.get<EditorJS>('@EditorJS')
        .then(async (editor) => {
          const data = await editor.save();

          const paragraph = data.blocks[0];

          expect(paragraph.tunes!.footnote).to.deep.eq([ '<b>This text is inside the popup</b>' ]);
        });
    });

    it('should save br tags for a footnote', () => {
      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .click()
        .type('Some text{command}{shift}F');

      cy.getEditor({ block: 0 })
        .find(`.${popupStyles['ej-fn-popup']}`)
        /**
         * For some reason cypress inserts F from shortcut to a popup
         */
        .type('{selectall}{backspace}')
        .type('This text is inside the popup{enter}');

      cy.getEditor()
        .click();

      cy.get<EditorJS>('@EditorJS')
        .then(async (editor) => {
          const data = await editor.save();

          const paragraph = data.blocks[0];

          expect(paragraph.tunes!.footnote).to.deep.eq([ 'This text is inside the popup<br>' ]);
        });
    });
  });

  describe('Rendering', () => {
    const render = (blocks: OutputData['blocks']): void => {
      cy.initEditorJS({
        data: {
          blocks,
        },
      }).as('EditorJS');
    };

    it('should hydrate footnote', () => {
      render([
        {
          type: 'paragraph',
          data: {
            text: 'Some text<sup>1</sup>',
          },
          tunes: {
            footnote: [
              'This is a footnote',
            ],
          },
        },
      ]);

      cy.getEditor({ block: 0 })
        .find('sup')
        .should('contain', '1')
        .click();

      cy.getEditor({ block: 0 })
        .find(`.${popupStyles['ej-fn-popup']}`)
        .should('be.visible')
        .should('contain', 'This is a footnote');
    });

    it('should hydrate several footnote', () => {
      render([
        {
          type: 'paragraph',
          data: {
            text: 'Some<sup>1</sup> text<sup>2</sup>',
          },
          tunes: {
            footnote: [
              'This is the first footnote',
              'This is the second footnote',
            ],
          },
        },
      ]);

      cy.getEditor({ block: 0 })
        .find('sup')
        .first()
        .should('contain', '1')
        .click();

      cy.getEditor({ block: 0 })
        .find(`.${popupStyles['ej-fn-popup']}`)
        .should('be.visible')
        .should('contain', 'This is the first footnote');

      cy.getEditor({ block: 0 })
        .find('sup')
        .last()
        .should('contain', '2')
        .click();

      cy.getEditor({ block: 0 })
        .find(`.${popupStyles['ej-fn-popup']}`)
        .should('be.visible')
        .should('contain', 'This is the second footnote');
    });

    it('should render inline formatting for a footnote', () => {
      render([
        {
          type: 'paragraph',
          data: {
            text: 'Some text<sup>1</sup>',
          },
          tunes: {
            footnote: [
              'This is a <b>footnote</b>',
            ],
          },
        },
      ]);

      cy.getEditor({ block: 0 })
        .find('sup')
        .should('contain', '1')
        .click();

      cy.getEditor({ block: 0 })
        .find(`.${popupStyles['ej-fn-popup']}`)
        .should('be.visible')
        .should('contain.html', 'This is a <b>footnote</b>');
    });

    it('should render br elements for a footnote', () => {
      render([
        {
          type: 'paragraph',
          data: {
            text: 'Some text<sup>1</sup>',
          },
          tunes: {
            footnote: [
              'This is a footnote<br>',
            ],
          },
        },
      ]);

      cy.getEditor({ block: 0 })
        .find('sup')
        .should('contain', '1')
        .click();

      cy.getEditor({ block: 0 })
        .find(`.${popupStyles['ej-fn-popup']}`)
        .should('be.visible')
        .should('contain.html', 'This is a footnote<br>');
    });
  });
});
