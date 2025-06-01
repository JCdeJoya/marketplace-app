/// <reference types="cypress" />

describe('Shopping Flow', () => {
  beforeEach(() => {
    // Mock the auth state - add this if you have authentication
    cy.window().then((window) => {
      window.localStorage.setItem('token', 'fake-token');
    });
    cy.visit('/');
  });

  it('browses and adds products to cart', () => {
    cy.visit('/products');
    cy.get('[data-testid=product-card]').first().within(() => {
      cy.get('[data-testid=add-to-cart]').click();
    });
    // Wait for cart update
    cy.wait(500);
    cy.get('[data-testid=cart-count]').should('have.text', '1');
  });

  it('completes checkout process', () => {
    // Add item to cart first
    cy.visit('/products');
    cy.get('[data-testid=product-card]').first().find('[data-testid=add-to-cart]').click();
    cy.wait(500);
    
    // Go to cart and checkout
    cy.visit('/cart');
    cy.get('[data-testid=checkout-button]').click();
    
    // Fill shipping form
    cy.get('input#full_name').type('Test User');
    cy.get('input#address').type('123 Test St');
    cy.get('input#city').type('Test City');
    cy.get('input#postal_code').type('12345');
    cy.get('input#phone').type('1234567890');
    
    // Submit order
    cy.get('[data-testid=place-order]').click();
    
    // Wait for redirect and verify
    cy.url().should('include', '/orders');
    cy.get('[data-testid=order-list]').should('exist');
  });

  // Add cleanup after each test
  afterEach(() => {
    cy.window().then((window) => {
      window.localStorage.clear();
    });
  });
});