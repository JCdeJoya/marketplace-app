/// <reference types="cypress" />
describe('Shopping Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('browses and adds products to cart', () => {
    cy.visit('/products')
    cy.get('[data-testid=product-card]').first().within(() => {
      cy.get('[data-testid=add-to-cart]').click()
    })
    cy.get('[data-testid=cart-count]').should('have.text', '1')
  })

  it('completes checkout process', () => {
    cy.visit('/products')
    cy.get('[data-testid=product-card]').first().find('[data-testid=add-to-cart]').click()
    cy.visit('/cart')
    cy.get('[data-testid=checkout-button]').click()
    
    // Fill shipping form
    cy.get('input[name="full_name"]').type('Test User')
    cy.get('input[name="address"]').type('123 Test St')
    cy.get('input[name="city"]').type('Test City')
    cy.get('input[name="postal_code"]').type('12345')
    cy.get('input[name="phone"]').type('1234567890')
    
    cy.get('[data-testid=place-order]').click()
    cy.url().should('include', '/orders')
  })
})