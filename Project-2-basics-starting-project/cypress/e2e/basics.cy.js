/// <reference types="Cypress" />

describe('Tasks page', () => {
  it('Should render the main image', () => {
    cy.visit('http://localhost:5173/');
    cy.get('.main-header').find('img');
  });

  it('Should display the page title', () => {
    cy.visit('http://localhost:5173/');
    cy.get('h1').should('have.length', 1);
    cy.get('h1').contains('My Cypress Course Tasks');
  });
});
