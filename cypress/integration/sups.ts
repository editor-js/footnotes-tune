describe('Sup element', () => {
  beforeEach(() => {
    cy.initEditorJS();
  });

  it('should render sup element on tune click', () => {
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
      .find('sup')
      .contains('1');
  });

  it('should render sup element on shortcut', () => {
    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .click()
      .type('Some text{command}{shift}F');

    cy.getEditor({ block: 0 })
      .find('sup')
      .should('contain', '1');
  });

  it('should be removed by backspace', () => {
    /**
     * @todo Remove when https://bugzilla.mozilla.org/show_bug.cgi?id=1665167 is resolved
     */
    if (Cypress.browser.name === 'firefox') {
      return;
    }

    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .type('Some text{command}{shift}F')
      .click()
      .find('sup');

    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .type('{selectall}{backspace}')
      .find('sup')
      .should('not.exist');
  });

  it('should be removed by delete key', () => {
    /**
     * @todo Remove when https://bugzilla.mozilla.org/show_bug.cgi?id=1665167 is resolved
     */
    if (Cypress.browser.name === 'firefox') {
      return;
    }

    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .type('Some text{command}{shift}F')
      .click()
      .find('sup');

    cy.getEditor({ block: 0 })
      .find('.cdx-block[contenteditable]')
      .type('{selectall}{del}')
      .find('sup')
      .should('not.exist');
  });

  describe('tune should correctly assign numbers to sups', () => {
    it('should assign lower number if new note goes before existing one', () => {
      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .type('Some text{command}{shift}F');

      cy.getEditor({ block: 0 })
        .find('sup')
        .should('contain', '1');

      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .type('{movetostart}')
        .type('{command}{shift}F');

      cy.getEditor({ block: 0 })
        .find('sup')
        .first()
        .should('contain', '1')
        .next()
        .should('contain', '2');
    });

    it('should assign higher number if new note goes after existing one', () => {
      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .type('Some text{movetostart}{command}{shift}F');

      cy.getEditor({ block: 0 })
        .find('sup')
        .should('contain', '1');

      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .type('{movetoend}')
        .type('{command}{shift}F');

      cy.getEditor({ block: 0 })
        .find('sup')
        .first()
        .should('contain', '1')
        .next()
        .should('contain', '2');
    });

    it('should have correct order if there are many notes', () => {
      cy.getEditor({ block: 0 })
        .find('.cdx-block[contenteditable]')
        .type('Some{command}{shift}F')
        .type(' long{command}{shift}F')
        .type(' long{command}{shift}F')
        .type(' long{command}{shift}F')
        .type(' long{command}{shift}F')
        .type(' long{command}{shift}F')
        .type(' text{command}{shift}F');

      cy.getEditor({ block: 0 })
        .find('sup')
        .each((sup, index) => {
          expect(sup.get(0).textContent).to.eq((index + 1).toString());
        });
    });
  });
});
