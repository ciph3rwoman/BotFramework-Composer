// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

context('breadcrumb', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('COMPOSER_URL'));
    cy.createBot('TodoSample');

    // Return to Main.dialog
    cy.findByTestId('ProjectTree').within(() => {
      cy.findByText('__TestTodoSample.Main').click();
    });
  });

  function hasBreadcrumbItems(cy: Cypress.cy, items: (string | RegExp)[]) {
    cy.findByTestId('Breadcrumb')
      .get('li')
      .should($li => {
        items.forEach((item, idx) => {
          expect($li.eq(idx)).to.contain(item);
        });
      });
  }

  it('can show dialog name in breadcrumb', () => {
    // Should path = main dialog at first render
    hasBreadcrumbItems(cy, ['__TestTodoSample.Main']);

    // Click on AddToDo dialog
    cy.findByTestId('ProjectTree').within(() => {
      cy.findByText('AddToDo').click();
    });
    hasBreadcrumbItems(cy, ['AddToDo']);

    // Return to Main.dialog
    cy.findByTestId('ProjectTree').within(() => {
      cy.findByText('__TestTodoSample.Main').click();
    });

    hasBreadcrumbItems(cy, ['__TestTodoSample']);
  });

  it('can show event name in breadcrumb', () => {
    cy.findByTestId('ProjectTree').within(() => {
      cy.findByText('AddToDo').click();
      cy.findByText('Dialog started (BeginDialog)').click();
    });

    hasBreadcrumbItems(cy, ['AddToDo', 'Dialog started (BeginDialog)']);
  });

  it('can show action name in breadcrumb', () => {
    cy.findByTestId('ProjectTree').within(() => {
      cy.findByText('Greeting (ConversationUpdate)').click();
    });

    // Click on an action
    cy.withinEditor('VisualEditor', () => {
      cy.findByTestId('RuleEditor').within(() => {
        cy.findByText('Send a response').click();
      });
    });

    hasBreadcrumbItems(cy, ['__TestTodoSample.Main', 'Greeting (ConversationUpdate)', 'Send a response']);
  });
});
