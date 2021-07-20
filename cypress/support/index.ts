// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import '@cypress/code-coverage/support';
import EditorJS, { EditorConfig } from '@editorjs/editorjs';
import 'cypress-plugin-tab';

declare global {
  namespace Cypress {
    interface Chainable {
      initEditorJS(config?: EditorConfig): Chainable<EditorJS>;

      getEditor(options?: { block: number }): Chainable<JQuery<HTMLDivElement>>;
    }
  }

  interface Window {
    FootnotesTune: typeof FootnotesTune;
    EditorJS: typeof EditorJS;
  }
}


// Import commands.js using ES2015 syntax:
import './commands';
import FootnotesTune from '../../src';

beforeEach((): void => {
  cy.visit('cypress/fixtures/index.html');
});


// Alternatively you can use CommonJS syntax:
// require('./commands')
