import popoverStyles from '../../src/popover.pcss';

describe('Tune configuration', () => {
  /**
   * @todo understand why it doesn't work on CI
   */
  it.skip('should use placeholder provided by user', () => {
    cy.initEditorJS({
      tools: {
        footnotes: {
          config: {
            placeholder: 'Some placeholder passed by user',
          },
        },
      },
    });

    cy.getEditor({ block: 0 })
      .find(`.${popoverStyles['ej-fn-popover__textarea']}`)
      .then(textarea => {
        cy.window()
          .then(win => {
            const before = win.getComputedStyle(textarea.get(0), 'before');

            expect(before.getPropertyValue('content')).to.eq('"Some placeholder passed by user"');
          });
      });
  });

  it('should use shortcut provided by user', () => {
    cy.initEditorJS({
      tools: {
        footnotes: {
          config: {
            shortcut: 'CMD+SHIFT+P',
          },
        },
      },
    });

    cy.getEditor({ block: 0 })
      .find('[contenteditable=true]')
      .type('Some text{cmd}{shift}P');

    cy.getEditor({ block: 0 })
      .find(`.${popoverStyles['ej-fn-popover']}`)
      .should('be.visible');
  });
});
