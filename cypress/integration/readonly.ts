import popoverStyles from '../../src/popover.pcss';

describe('Read-only mode', () => {
  beforeEach(() => {
    cy.initEditorJS({
      data: {
        blocks: [ {
          type: 'paragraph',
          data: {
            text: "Some text<sup data-tune='footnotes'>1</sup>",
          },
          tunes: {
            footnotes: [ {
              content: 'This is a footnote text',
              superscript: 1,
              id: 'N6iKKL',
            } ],
          },
        } ],
      },
      readOnly: true,
    }).as('EditorJS');
  });

  it('should render sup elements', () => {
    cy.getEditor({ block: 0 })
      .find('sup')
      .should('exist');
  });

  it('should open popover on sup click', () => {
    cy.getEditor({ block: 0 })
      .find('sup')
      .click();

    cy.getEditor({ block: 0 })
      .find(`.${popoverStyles['ej-fn-popover']}`)
      .should('be.visible');
  });

  it('should open popover on sup click', () => {
    cy.getEditor({ block: 0 })
      .find('sup')
      .click();

    cy.getEditor({ block: 0 })
      .find(`.${popoverStyles['ej-fn-popover']}`)
      .should('be.visible');
  });

  it('should close popover on second sup click', () => {
    cy.getEditor({ block: 0 })
      .find('sup')
      .click();

    cy.getEditor({ block: 0 })
      .find(`.${popoverStyles['ej-fn-popover']}`)
      .should('be.visible');

    cy.getEditor({ block: 0 })
      .find('sup')
      .click();

    cy.getEditor({ block: 0 })
      .find(`.${popoverStyles['ej-fn-popover']}`)
      .should('not.be.visible');
  });

  it('popover should not be editable', () => {
    cy.getEditor({ block: 0 })
      .find('sup')
      .click();

    cy.getEditor({ block: 0 })
      .find(`.${popoverStyles['ej-fn-popover__textarea']}`)
      .should('have.attr', 'contenteditable', 'false');
  });

  it('popover should not have buttons', () => {
    cy.getEditor({ block: 0 })
      .find('sup')
      .click();

    cy.getEditor({ block: 0 })
      .find(`.${popoverStyles['ej-fn-popover__buttons']}`)
      .should('not.exist');
  });

  it('should not save note content even if it was changed somehow', () => {
    cy.getEditor({ block: 0 })
      .find('sup')
      .click();

    cy.getEditor({ block: 0 })
      .find(`.${popoverStyles['ej-fn-popover__textarea']}`)
      .then(textarea => {
        textarea.text('Some new text for footnote');
      });

    cy.getEditor({ block: 0 })
      .click('topLeft');

    cy.getEditor({ block: 0 })
      .find('sup')
      .click();

    cy.getEditor({ block: 0 })
      .find(`.${popoverStyles['ej-fn-popover__textarea']}`)
      .should('contain', 'This is a footnote text')
      .should('not.contain', 'Some new text for footnote');
  });
});
