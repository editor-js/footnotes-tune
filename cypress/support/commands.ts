import EditorJS, { EditorConfig } from '@editorjs/editorjs';

Cypress.Commands.add('initEditorJS', (config: EditorConfig = {}): Cypress.Chainable<EditorJS> => {

  return cy.document()
    .then(doc => {
      if (!config.holder) {
        const container = doc.createElement('div');

        container.setAttribute('id', 'editorjs');
        container.dataset.cy = 'editorjs';

        doc.body.append(container);

        config.holder = container;
      }

      return cy.window()
        .then(async win => {

          if (!config.tools) {
            config.tools = {};
          }

          config.tools = {
            paragraph: {
              tunes: [ 'footnote' ],
            },
            ...config.tools,
            footnote: {
              class: win.FootnotesTune,
              ...config.tools.footnote,
            },
          };


          const editor = new win.EditorJS(config);

          await editor.isReady;

          return editor;
        });
    });
});

Cypress.Commands.add('getEditor', ({ block }: { block?: number } = {}): Cypress.Chainable<JQuery> => {
  const editor = cy.get('[data-cy=editorjs]');

  if (!block) {
    return editor;
  }

  return editor
    .find('.ce-block')
    .eq(block);
});
