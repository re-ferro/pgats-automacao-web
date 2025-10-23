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

    it.only('Cadastrar um usuário', () => {
      login.preencherFormularioDePreCadastro()
      cadastro.preencherFormularioDeCadastroCompleto()

      cy.url().should('includes', 'account_created')
      cy.contains('b', 'Account Created!')

    })

    it('Login de Usuário com e-mail e senha corretos', () => {

      login.preencherFormularioDeLogin(userData.user, userData.password)

      cy.get('i.fa-user').parent().should('contain', userData.name)


    });

    it('Login de Usuário com e-mail e senha incorretos', () => {
      
     login.preencherFormularioDeLogin(userData.user, '54321')

      cy.get('.login-form > form > p').should('contain', 'Your email or password is incorrect!')

    });  

    it('Logout de Usuário', () => {
      
     login.preencherFormularioDeLogin(userData.user, userData.password)

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



     })




})    


    
    