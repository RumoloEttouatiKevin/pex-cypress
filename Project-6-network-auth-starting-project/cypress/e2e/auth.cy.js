/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="Cypress" />

describe('Auth', () => {
  beforeEach(() => {
    cy.task('seedDatabase');
  });

  it('should signup', () => {
    cy.visit('/signup');

    cy.wait(200);

    cy.get('[data-cy="auth-email"]').type('test2@example.com');
    cy.get('[data-cy="auth-password"]').type('testPassword');
    cy.get('[data-cy="auth-submit"]').click();

    cy.location('pathname').should('equal', '/takeaways');
    cy.getCookie('__session').its('value').should('not.be.empty');
  });

  it('should login', () => {
    cy.visit('/login');

    cy.wait(200);

    cy.get('[data-cy="auth-email"]').type('test@example.com');
    cy.get('[data-cy="auth-password"]').type('testpassword');
    cy.get('[data-cy="auth-submit"]').click();

    cy.location('pathname').should('equal', '/takeaways');
    cy.getCookie('__session').its('value').should('not.be.empty');
  });

  it('should logout', () => {
    cy.login();

    cy.contains('Logout').click();
    cy.location('pathname').should('equal', '/');
    cy.getCookie('__session').its('value').should('be.empty');
  });
});
