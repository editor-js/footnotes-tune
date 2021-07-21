import styles from '../../src/popover.pcss';

describe('popover element', () => {
  beforeEach(() => {
    cy.initEditorJS();
  });

  it('should not be visible by default', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
      .should('not.be.visible');
  });

  it('should open popover on tune click', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text')
      .tab();

    cy.getEditor()
      .find('.ce-toolbar__actions')
      .contains('Footnote')
      .click();

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
      .should('be.visible');
  });

  it('should open popover on shortcut', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
      .should('be.visible');
  });

  it('should open popover on sup click', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F')
      .click()
      .find('sup')
      .click();

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
      .should('be.visible');
  });

  it('should close popover on related sup click', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
      .should('be.visible');

    cy.getEditor({ block: 0 })
      .find('sup')
      .click();

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
      .should('not.be.visible');
  });

  it('should open popover on another sup click', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some {command}{shift}F');


    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
      /**
       * For some reason cypress inserts F from shortcut to a popover
       */
      .type('{selectall}{backspace}')
      .type('This text is inside the first popover');

    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('{movetoend} text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
      /**
       * For some reason cypress inserts F from shortcut to a popover
       */
      .type('{selectall}{backspace}')
      .type('This text is inside the second popover');

    cy.getEditor({ block: 0 })
      .find('sup')
      .first()
      .click();

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
      .should('be.visible')
      .should('contain', 'This text is inside the first popover');
  });


  it('should be available for typing', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
      /**
       * For some reason cypress inserts F from shortcut to a popover
       */
      .type('{selectall}{backspace}')
      .type('This text is inside the popover')
      .should('contain', 'This text is inside the popover');
  });

  it('should enable inline toolbar', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
      /**
       * For some reason cypress inserts F from shortcut to a popover
       */
      .type('{selectall}{backspace}')
      .type('This text is inside the popover{selectall}');

    cy.getEditor()
      .find('.ce-inline-toolbar')
      .should('be.visible');
  });

  it('should change inline markup on inline tool click', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
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

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover__textarea']}`)
      .invoke('html')
      .should('match', /<b>This text is inside the popover(<br>)?<\/b>/);
  });

  it('should add br on enter', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
      /**
       * For some reason cypress inserts F from shortcut to a popover
       */
      .type('{selectall}{backspace}')
      .type('This text is inside the popover{enter}')
      .should('contain.html', 'This text is inside the popover<br><br>');
  });

  it('should not close popover on click inside popover', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
      .should('be.visible')
      .click()
      .should('be.visible');
  });

  it('should close popover on click outside', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
      .should('be.visible');

    cy.getEditor({ block: 0 })
      .click('topLeft')
      .find(`.${styles['ej-fn-popover']}`)
      .should('not.be.visible');
  });

  it('should close popover on Apply button click', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .contains('Apply')
      .click();

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
      .should('not.be.visible');
  });

  it('should close popover on CMD+Enter shortcut', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover__textarea']}`)
      .type(/Mac/.test(window.navigator.userAgent) ? '{cmd}{enter}' : '{ctrl}{enter}');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
      .should('not.be.visible');
  });

  it('should remove Note on Remove button click', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .contains('Remove')
      .click();

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popover']}`)
      .should('not.be.visible');

    cy.getEditor({ block: 0 })
      .find('sup[data-tune=footnotes]')
      .should('not.exist');
  });
});
