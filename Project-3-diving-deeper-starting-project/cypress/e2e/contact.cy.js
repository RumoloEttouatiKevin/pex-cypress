/// <reference types="Cypress" />

describe('contact form', () => {
  it('should submit the form', () => {
    cy.visit('http://localhost:5173/about');
    cy.get('[data-cy="contact-input-message"]').type('Hello world!');
    cy.get('[data-cy="contact-input-name"]').type('John Doe');
    cy.get('[data-cy="contact-input-email"]').type('test@example.com');

    cy.get('[data-cy="contact-btn-submit"]')
      .contains('Send Message')
      .and('not.have.attr', 'disabled');

    cy.get('[data-cy="contact-btn-submit"]').then((el) => {
      expect(el.attr('disabled')).to.be.undefined;
      expect(el.text()).to.contain('Send Message');
    });

    cy.get('[data-cy="contact-btn-submit"]').click();
    cy.get('[data-cy="contact-btn-submit"]').contains('Sending...');
    cy.get('[data-cy="contact-btn-submit"]').should('have.attr', 'disabled');

    cy.get('[data-cy="contact-btn-submit"]').as('submitBtn');
    cy.get('@submitBtn').click();
    cy.get('@submitBtn').contains('Sending...');
    cy.get('@submitBtn').should('have.attr', 'disabled');

    cy.get('[data-cy="contact-btn-submit"]').then((el) => {
      el[0].click();
      expect(el.text()).to.contain('Sending...');
      expect(el.attr('disabled')).not.to.be.undefined;
    });

    cy.screenshot();

    cy.get('[data-cy="contact-input-email"]').clear().type('test@example.com{enter}');
  });

  it('should validate the form input', () => {
    cy.visit('http://localhost:5173/about');

    cy.get('[data-cy="contact-btn-submit"]').click();
    cy.get('[data-cy="contact-btn-submit"]').then(el => {
      expect(el).to.not.have.attr('disabled');
      expect(el.text()).to.not.equal('Sending...');
    });
    cy.get('[data-cy="contact-btn-submit"]').contains('Send Message');

    cy.get('[data-cy="contact-input-message"]').blur();
    cy.get('[data-cy="contact-input-message"]')
      .parent()
      .should('have.attr', 'class')
      .and('match', /invalid/);

    cy.get('[data-cy="contact-input-name"]').focus().blur();
    cy.get('[data-cy="contact-input-name"]')
      .parent()
      .should('have.attr', 'class')
      .and('match', /invalid/);

    cy.get('[data-cy="contact-input-email"]').focus().blur();
    cy.get('[data-cy="contact-input-email"]')
      .parent()
      .should((el) => {
        expect(el.attr('class')).not.to.be.undefined;
        expect(el.attr('class')).contain('invalid');
      });
  });
});
