import popoverStyles from '../../src/popover.pcss';
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
        .find(`.${popoverStyles['ej-fn-popover']}`)
        /**
         * For some reason cypress inserts F from shortcut to a popover
         */
        .type('{selectall}{backspace}')
        .type('This text is inside the popover{selectall}');

      cy.getEditor()
        .click();

      cy.get<EditorJS>('@EditorJS')
        .then(async (editor) => {
          const data = await editor.save();

          const paragraph = data.blocks[0];

          expect(paragraph.data.text).to.eq('Some text<sup data-tune="footnotes">1</sup>');
        });
    });

    it('should save tunes object with footnote', () => {
      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .click()
        .type('Some text{command}{shift}F');

      cy.getEditor({ block: 0 })
        .find(`.${popoverStyles['ej-fn-popover']}`)
        /**
         * For some reason cypress inserts F from shortcut to a popover
         */
        .type('{selectall}{backspace}')
        .type('This text is inside the popover{cmd}{enter}');


      cy.get<EditorJS>('@EditorJS')
        .then(async (editor) => {
          const data = await editor.save();

          const paragraph = data.blocks[0];

          expect(paragraph).to.have.property('tunes');
          expect(paragraph.tunes).to.have.property('footnotes');
          expect(paragraph.tunes!.footnotes).to.deep.eq([ 'This text is inside the popover' ]);
        });
    });

    it('should save tunes object with several footnotes', () => {
      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .click()
        .type('Some {command}{shift}F');

      cy.getEditor({ block: 0 })
        .find(`.${popoverStyles['ej-fn-popover']}`)
        /**
         * For some reason cypress inserts F from shortcut to a popover
         */
        .type('{selectall}{backspace}')
        .type('This text is inside the first popover{selectall}');

      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .click()
        .type('{movetoend} text{command}{shift}F');

      cy.getEditor({ block: 0 })
        .find(`.${popoverStyles['ej-fn-popover']}`)
        /**
         * For some reason cypress inserts F from shortcut to a popover
         */
        .type('{selectall}{backspace}')
        .type('This text is inside the second popover{cmd}{enter}');

      cy.get<EditorJS>('@EditorJS')
        .then(async (editor) => {
          const data = await editor.save();

          const paragraph = data.blocks[0];

          expect(paragraph.tunes!.footnotes).to.deep.eq(['This text is inside the first popover', 'This text is inside the second popover']);
        });
    });

    it('should save inline formatting for a footnote', () => {
      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .click()
        .type('Some text{command}{shift}F');

      cy.getEditor({ block: 0 })
        .find(`.${popoverStyles['ej-fn-popover']}`)
        /**
         * For some reason cypress inserts F from shortcut to a popover
         */
        .type('{selectall}{backspace}')
        .type('This text is inside the popover{selectall}');

      cy.getEditor()
        .find('.ce-inline-toolbar')
        .find('button[data-tool=bold]')
        .first()
        .click();

      cy.getEditor()
        .click('topLeft');

      cy.get<EditorJS>('@EditorJS')
        .then(async (editor) => {
          const data = await editor.save();

          const paragraph = data.blocks[0];

          expect(paragraph.tunes!.footnotes).to.deep.eq([ '<b>This text is inside the popover</b>' ]);
        });
    });

    it('should save br tags for a footnote', () => {
      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .click()
        .type('Some text{command}{shift}F');

      cy.getEditor({ block: 0 })
        .find(`.${popoverStyles['ej-fn-popover']}`)
        /**
         * For some reason cypress inserts F from shortcut to a popover
         */
        .type('{selectall}{backspace}')
        .type('This text is inside the popover{enter}{cmd}{enter}');


      cy.get<EditorJS>('@EditorJS')
        .then(async (editor) => {
          const data = await editor.save();

          const paragraph = data.blocks[0];

          expect(paragraph.tunes!.footnotes).to.deep.eq([ 'This text is inside the popover<br><br>' ]);
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
            text: 'Some text<sup data-tune="footnotes">1</sup>',
          },
          tunes: {
            footnotes: [
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
        .find(`.${popoverStyles['ej-fn-popover']}`)
        .should('be.visible')
        .should('contain', 'This is a footnote');
    });

    it('should hydrate several footnote', () => {
      render([
        {
          type: 'paragraph',
          data: {
            text: 'Some<sup data-tune="footnotes">1</sup> text<sup data-tune="footnotes">2</sup>',
          },
          tunes: {
            footnotes: [
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
        .find(`.${popoverStyles['ej-fn-popover']}`)
        .should('be.visible')
        .should('contain', 'This is the first footnote');

      cy.getEditor({ block: 0 })
        .find('sup')
        .last()
        .should('contain', '2')
        .click();

      cy.getEditor({ block: 0 })
        .find(`.${popoverStyles['ej-fn-popover']}`)
        .should('be.visible')
        .should('contain', 'This is the second footnote');
    });

    it('should render inline formatting for a footnote', () => {
      render([
        {
          type: 'paragraph',
          data: {
            text: 'Some text<sup data-tune="footnotes">1</sup>',
          },
          tunes: {
            footnotes: [
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
        .find(`.${popoverStyles['ej-fn-popover']}`)
        .should('be.visible')
        .should('contain.html', 'This is a <b>footnote</b>');
    });

    it('should render br elements for a footnote', () => {
      render([
        {
          type: 'paragraph',
          data: {
            text: 'Some text<sup data-tune="footnotes">1</sup>',
          },
          tunes: {
            footnotes: [
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
        .find(`.${popoverStyles['ej-fn-popover']}`)
        .should('be.visible')
        .should('contain.html', 'This is a footnote<br>');
    });
  });
});
