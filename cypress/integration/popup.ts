import styles from '../../src/popup.pcss';

describe('Popup element', () => {
  beforeEach(() => {
    cy.initEditorJS();
  });

  it('should not be visible by default', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popup']}`)
      .should('not.be.visible');
  });

  it('should open popup on tune click', () => {
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
      .find(`.${styles['ej-fn-popup']}`)
      .should('be.visible');
  });

  it('should open popup on shortcut', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popup']}`)
      .should('be.visible');
  });

  it('should open popup on sup click', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F')
      .click()
      .find('sup')
      .click();

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popup']}`)
      .should('be.visible');
  });

  it('should open popup on another sup click', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some {command}{shift}F');


    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popup']}`)
      /**
       * For some reason cypress inserts F from shortcut to a popup
       */
      .type('{selectall}{backspace}')
      .type('This text is inside the first popup');

    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('{movetoend} text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popup']}`)
      /**
       * For some reason cypress inserts F from shortcut to a popup
       */
      .type('{selectall}{backspace}')
      .type('This text is inside the second popup');

    cy.getEditor({ block: 0 })
      .find('sup')
      .first()
      .click();

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popup']}`)
      .should('be.visible')
      .should('contain', 'This text is inside the first popup');
  });


  it('should be available for typing', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popup']}`)
      /**
       * For some reason cypress inserts F from shortcut to a popup
       */
      .type('{selectall}{backspace}')
      .type('This text is inside the popup')
      .should('contain', 'This text is inside the popup');
  });

  it('should enable inline toolbar', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popup']}`)
      /**
       * For some reason cypress inserts F from shortcut to a popup
       */
      .type('{selectall}{backspace}')
      .type('This text is inside the popup{selectall}');

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
      .find(`.${styles['ej-fn-popup']}`)
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

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popup']}`)
      .should('contain.html', '<b>This text is inside the popup</b>');
  });

  it('should add br on enter', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popup']}`)
      /**
       * For some reason cypress inserts F from shortcut to a popup
       */
      .type('{selectall}{backspace}')
      .type('This text is inside the popup{enter}')
      .should('contain.html', 'This text is inside the popup<br>');
  });

  it('should not close popup on click inside popup', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popup']}`)
      .should('be.visible')
      .click()
      .should('be.visible');
  });

  it('should close popup on click outside', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find(`.${styles['ej-fn-popup']}`)
      .should('be.visible');

    cy.getEditor({ block: 0 })
      .click()
      .find(`.${styles['ej-fn-popup']}`)
      .should('not.be.visible');
  });
});
