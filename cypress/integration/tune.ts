import styles from '../../src/index.pcss';

describe('Footnote Tune', () => {
  beforeEach(() => {
    cy.initEditorJS();
  });

  it('should have icon in block settings', () => {
    cy.getEditor({ block: 0 })
      .click();

    cy.getEditor()
      .find('.ce-toolbar__actions-buttons')
      .click();

    cy.getEditor()
      .find('.ce-toolbar__actions')
      .contains('Footnote');
  });

  it('should have be disabled if there is no range inside a block', () => {
    cy.getEditor({ block: 0 })
      .click('topLeft');

    cy.getEditor()
      .find('.ce-toolbar__actions-buttons')
      .click();

    cy.getEditor()
      .find('.ce-toolbar__actions')
      .find(`.${styles['ej-fn-tune']}`)
      .should('have.class', styles['ej-fn-tune--disabled']);
  });
});
