/* eslint-disable @typescript-eslint/no-magic-numbers */
import popoverStyles from '../../src/popover.pcss';
import EditorJS, { OutputData } from '@editorjs/editorjs';

describe('Data manipulations', () => {
  describe('Saving', () => {
    beforeEach(() => {
      cy.initEditorJS().as('EditorJS');
    });

    it('should save sup element for block content', () => {
      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .click()
        .type('Some text{cmd}{shift}F');

      cy.getEditor({ block: 0 })
        .find(`.${popoverStyles['ej-fn-popover']}`)
        /**
         * For some reason cypress inserts F from shortcut to a popover
         */
        .type('{selectall}{backspace}')
        .type('This text is inside the popover{cmd}{ctrl}{enter}');

      cy.get<EditorJS>('@EditorJS')
        .then(async (editor) => {
          const data = await editor.save();

          const paragraph = data.blocks[0];

          expect(paragraph.data.text).to.match(/Some text<sup data-tune="footnotes" data-id="[_a-zA-Z0-9\\-]{6}">1<\/sup>(<br>)?/);
        });
    });

    it('should save sup element for block content with id equals to id in tunes section', () => {
      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .click()
        .type('Some text{cmd}{shift}F');

      cy.getEditor({ block: 0 })
        .find(`.${popoverStyles['ej-fn-popover']}`)
        /**
         * For some reason cypress inserts F from shortcut to a popover
         */
        .type('{selectall}{backspace}')
        .type('This text is inside the popover{cmd}{ctrl}{enter}');

      cy.get<EditorJS>('@EditorJS')
        .then(async (editor) => {
          const data = await editor.save();

          const paragraph = data.blocks[0];

          expect(paragraph.data.text).to.match(new RegExp(`Some text<sup data-tune="footnotes" data-id="${paragraph.tunes!.footnotes[0].id}">1<\/sup>(<br>)?`));
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
        .type('This text is inside the popover{cmd}{ctrl}{enter}');


      cy.get<EditorJS>('@EditorJS')
        .then(async (editor) => {
          const data = await editor.save();

          const paragraph = data.blocks[0];

          expect(paragraph).to.have.property('tunes');
          expect(paragraph.tunes).to.have.property('footnotes');
          expect(paragraph.tunes!.footnotes[0]).to.have.property('id');
          expect(paragraph.tunes!.footnotes[0]).to.have.property('content');
          expect(paragraph.tunes!.footnotes[0]).to.have.property('superscript');
          expect(paragraph.tunes!.footnotes[0].content).to.match(/This text is inside the popover(<br>)?/);
          expect(paragraph.tunes!.footnotes[0].superscript).to.eq(1);
        });
    });

    it('should save tunes object with several footnotes', () => {
      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .click()
        .type('Some text')
        .type('{leftarrow}{leftarrow}{command}{shift}F');

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
        .type('{movetoend}{command}{shift}F');

      cy.getEditor({ block: 0 })
        .find(`.${popoverStyles['ej-fn-popover']}`)
        /**
         * For some reason cypress inserts F from shortcut to a popover
         */
        .type('{selectall}{backspace}')
        .type('This text is inside the second popover{cmd}{ctrl}{enter}');

      cy.get<EditorJS>('@EditorJS')
        .then(async (editor) => {
          const data = await editor.save();

          const paragraph = data.blocks[0];

          expect(paragraph.tunes!.footnotes[0].content).to.match(/This text is inside the first popover(<br>)?/);
          expect(paragraph.tunes!.footnotes[0].superscript).to.eq(1);
          expect(paragraph.tunes!.footnotes[1].content).to.match(/This text is inside the second popover(<br>)?/);
          expect(paragraph.tunes!.footnotes[1].superscript).to.eq(2);
        });
    });

    it('should save footnotes from different blocks', () => {
      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .click()
        .type('First block')
        .type('{command}{shift}F');

      cy.getEditor({ block: 0 })
        .find(`.${popoverStyles['ej-fn-popover']}`)
        /**
         * For some reason cypress inserts F from shortcut to a popover
         */
        .type('{selectall}{backspace}')
        .type('This text is inside the first popover{cmd}{ctrl}{enter}');

      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .click()
        .type('{movetoend}{enter}');

      cy.getEditor({ block: 1 })
        .find('.cdx-block[contenteditable]')
        .click()
        .type('Second block')
        .type('{command}{shift}F');

      cy.getEditor({ block: 1 })
        .find(`.${popoverStyles['ej-fn-popover']}`)
        /**
         * For some reason cypress inserts F from shortcut to a popover
         */
        .type('{selectall}{backspace}This text is inside the second popover{cmd}{ctrl}{enter}');

      cy.get<EditorJS>('@EditorJS')
        .then(async (editor) => {
          const data = await editor.save();

          const paragraph1 = data.blocks[0];
          const paragraph2 = data.blocks[1];

          expect(paragraph1.tunes!.footnotes[0].content).to.match(/This text is inside the first popover(<br>)?/);
          expect(paragraph1.tunes!.footnotes[0].superscript).to.eq(1);
          expect(paragraph2.tunes!.footnotes[0].content).to.match(/This text is inside the second popover(<br>)?/);
          expect(paragraph2.tunes!.footnotes[0].superscript).to.eq(2);
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
        .find(`.${popoverStyles['ej-fn-popover']}`)
        .contains('Apply')
        .click();

      cy.get<EditorJS>('@EditorJS')
        .then(async (editor) => {
          const data = await editor.save();

          const paragraph = data.blocks[0];

          expect(paragraph.tunes!.footnotes[0].content).to.match(/<b>This text is inside the popover(<br>)?<\/b>/);
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
        .type('This text is inside the popover{enter}{cmd}{ctrl}{enter}');


      cy.get<EditorJS>('@EditorJS')
        .then(async (editor) => {
          const data = await editor.save();

          const paragraph = data.blocks[0];

          expect(paragraph.tunes!.footnotes[0].content).to.eq('This text is inside the popover<br><br>');
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
            footnotes: [ {
              content: 'This is a footnote',
              superscript: 1,
              id: 'N6iKKL',
            } ],
          },
        },
      ]);

      cy.getEditor({ block: 0 })
        .find('sup')
        .should('contain', '1')
        .should('have.attr', 'data-id', 'N6iKKL')
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
              { content: 'This is the first footnote',
                id: 'N6iKKL',
                superscript: 1 },
              { content: 'This is the second footnote',
                id: 'N6iKKM',
                superscript: 2 },
            ],
          },
        },
      ]);

      cy.getEditor({ block: 0 })
        .find('sup')
        .first()
        .should('contain', '1')
        .should('have.attr', 'data-id', 'N6iKKL')
        .click();

      cy.getEditor({ block: 0 })
        .find(`.${popoverStyles['ej-fn-popover']}`)
        .should('be.visible')
        .should('contain', 'This is the first footnote');

      cy.getEditor({ block: 0 })
        .find('sup')
        .last()
        .should('contain', '2')
        .should('have.attr', 'data-id', 'N6iKKM')
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
            footnotes: [ {
              content: 'This is a <b>footnote</b>',
              id: 'N6iKKL',
              superscript: 1,
            } ],
          },
        },
      ]);

      cy.getEditor({ block: 0 })
        .find('sup')
        .should('contain', '1')
        .should('have.attr', 'data-id', 'N6iKKL')
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
            footnotes: [{
              content: 'This is a footnote<br>',
              id: 'N6iKKL',
              superscript: 1
            }],
          },
        },
      ]);

      cy.getEditor({ block: 0 })
        .find('sup')
        .should('contain', '1')
        .should('have.attr', 'data-id', 'N6iKKL')
        .click();

      cy.getEditor({ block: 0 })
        .find(`.${popoverStyles['ej-fn-popover']}`)
        .should('be.visible')
        .should('contain.html', 'This is a footnote<br>');
    });
  });
});
