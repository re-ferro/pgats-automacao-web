/// <reference types="cypress" />

import userData from '../fixtures/example.json'

import { faker } from '@faker-js/faker'

import menu from '../modules/menu'
import login from '../modules/login'
import cadastro from '../modules/cadastro'

describe('Automation Exercise', () => {
    beforeEach(() => {
      cy.visit('https://automationexercise.com') 
      menu.navegarParaLogin() 
    });

    it('Exemplos de Logs', () =>{

      cy.log('Nome do Usuário: ${userData.name}')
      cy.log('Email do Usuário: ${userData.email}')

      console.log('PGATS AUTOMACAO WEB CONSOLE LOG')

    })

    it('Cadastrar um usuário', () => {
      login.preencherFormularioDePreCadastro()
      cadastro.preencherFormularioDeCadastroCompleto()

      cy.url().should('includes', 'account_created')
      cy.contains('b', 'Account Created!')

    })

    it('Login de Usuário com e-mail e senha corretos', () => {

      login.preencherFormularioDeLogin(userData.user, userData.pass)

  cy.contains(userData.name, { timeout: 10000 }).should('be.visible')


    });

    it('Login de Usuário com e-mail e senha incorretos', () => {
      
     login.preencherFormularioDeLogin(userData.user, '54321')

      cy.get('.login-form > form > p').should('contain', 'Your email or password is incorrect!')

    });  

    it('Logout de Usuário', () => {
      
     login.preencherFormularioDeLogin(userData.user, userData.pass)

     menu.efetuarLogout()
  
     cy.url().should('contain', 'login')

    });

     it('Cadastrar Usuário com e-mail existente no sistema', () => {
      
     cy.get('[data-qa="signup-name"]').type('QA Tester') 
     cy.get('[data-qa="signup-email"]').type('qa-tester-1759685094171@test.com')

     cy.contains('button','Signup').click()

     cy.get('.signup-form > form > p').should('contain', 'Email Address already exist!')

    });

     it('Enviar um Formulário de Contato com upload de arquivo', () =>{

       cy.get('a[href*=contact]').click()

       cy.get('[data-qa="name"]').type(userData.name)
       cy.get('[data-qa="email"]').type(userData.email)
       cy.get('[data-qa="subject"]').type(userData.subject)
       cy.get('[data-qa="message"]').type(userData.message)

       cy.fixture('example.json').as('arquivo')
       cy.get('input[type=file]').selectFile('@arquivo')

       cy.get('[data-qa="submit-button"]').click()

       cy.get('.status').should('be.visible')
       cy.get('.status').should('have.text','Success! Your details have been submitted successfully.')

     });

    it('Verificar todos os produtos e a página de detalhes do produto', () => {
      
      cy.visit('https://automationexercise.com')

      cy.get('body').should('be.visible')

      cy.contains('a', 'Products').click()

      cy.url().should('include', '/products')
      cy.contains('All Products').should('be.visible')

      cy.get('.features_items').should('be.visible')
      cy.contains('a', 'View Product').should('exist')

      cy.contains('a', 'View Product').first().click()

      cy.url().should('include', '/product_details')

      cy.get('h2').should('be.visible') 
      cy.get('.product-information').should('be.visible')
        .and('contain.text', 'Category')
        .and('contain.text', 'Rs.')
        .and('contain.text', 'Availability')
        .and('contain.text', 'Condition')
        .and('contain.text', 'Brand')

    })
    
    it('Pesquisar produto', () => {
      cy.visit('https://automationexercise.com')

      cy.get('body').should('be.visible')

      cy.contains('a', 'Products').click()

      cy.url().should('include', '/products')
      cy.contains('All Products').should('be.visible')

      const produto = 'Blue Top'
      cy.get('#search_product').should('exist').type(produto)
      cy.get('#submit_search').click()

      cy.contains(/Searched Products|SEARCHED PRODUCTS/i).should('be.visible')

      cy.get('.features_items').should('be.visible')
      cy.get('.features_items').within(() => {
        cy.contains(produto).should('exist')
      })
    })

    it('Fazer pedido: Registrar antes de finalizar a compra', () => {
      cy.visit('https://automationexercise.com')
      cy.get('body').should('be.visible')

      menu.navegarParaLogin()

      login.preencherFormularioDePreCadastro()
      cadastro.preencherFormularioDeCadastroCompleto()

      cy.contains('b', 'Account Created!').should('be.visible')
      cy.contains('a', 'Continue').click()

      cy.contains('a', 'Products').click()
      cy.contains('a', 'View Product').first().click()
      cy.contains(/Add to cart/i).click()

      cy.wait(500)
      cy.get('body').then($body => {
        if ($body.find('#cartModal:visible').length) {
          cy.get('#cartModal').contains('a', 'View Cart').click()
        } else {
          cy.contains('a', 'Cart').click()
        }
      })

      cy.url().should('include', '/view_cart')
      cy.contains(/Shopping Cart|Cart/i).should('be.visible')

      cy.contains(/Proceed To Checkout|Proceed To Checkout/i).click()

      cy.contains(/Address Details|Address Delivery Details|Address Billing Details/i).should('exist')

      cy.get('textarea[name="message"]').type('Pedido de teste - automatizado')
      cy.contains(/Place Order|Fazer pedido/i).click()

      cy.get('input[name="name_on_card"]').type('Test User')
      cy.get('input[name="card_number"]').type('4111111111111111')
      cy.get('input[name="cvc"]').type('123')
      cy.get('input[name="expiry_month"]').type('12')
      cy.get('input[name="expiry_year"]').type('2025')

      cy.contains(/Pay and Confirm Order|Pay and Confirm Order/i).click()

      cy.contains(/Your order has been placed successfully|Your order has been placed|Order Placed!|Your order is confirmed|Pedido realizado com sucesso/i, { timeout: 20000 })
        .should('be.visible')
    })
    
    it('Verificar assinatura na página inicial', () => {
      cy.visit('https://automationexercise.com')
      cy.get('body').should('be.visible')

      cy.get('footer').scrollIntoView()

      cy.contains(/Subscription|ASSINATURA/i).should('be.visible')

      cy.get('#susbscribe_email, #subscribe_email, input[name="email"]').first().type(userData.email)
      cy.get('button#subscribe, button#subscribe_email, .fa-arrow-circle-o-right').first().click()

      cy.contains(/You have been successfully subscribed!|You have been successfully subscribed/i).should('be.visible')
    })
})
  


    
    