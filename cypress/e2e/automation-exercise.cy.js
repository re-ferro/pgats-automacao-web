/// <reference types="cypress" />


import userData from '../fixtures/example.json'
import { faker } from '@faker-js/faker'
import 'cypress-xpath';

describe('Automation Exercise', () => {
    beforeEach(() => {
      cy.visit('https://automationexercise.com')  
      cy.xpath('//a[@href="/login"]').click()

    });

    it('Exemplos de Logs', () =>{
      // Não há seletores neste teste, nada a adaptar
      cy.log(`Nome do Usuário: ${userData.name}`)
      cy.log(`Email do Usuário: ${userData.email}`)
      console.log('PGATS AUTOMACAO WEB CONSOLE LOG')
    })

    it('Cadastrar um usuário', () => {
      const timestamp = new Date().getTime();

      cy.xpath('//*[@data-qa="signup-name"]').type('QA Tester');
      cy.xpath('//*[@data-qa="signup-email"]').type(`qa-tester-${timestamp}@test.com`);
      cy.xpath('//button[contains(text(),"Signup")]').click();

      cy.xpath('//input[@type="radio" and @value="Mr"]').check('Mr');
      cy.xpath('//input[@id="password"]').type('12345', { log: false });

      cy.xpath('//*[@data-qa="days"]').select('20');
      cy.xpath('//*[@data-qa="months"]').select('March');
      cy.xpath('//*[@data-qa="years"]').select('1992');

      cy.xpath('//input[@type="checkbox" and @id="newsletter"]').check();
      cy.xpath('//input[@type="checkbox" and @id="optin"]').check();

      cy.xpath('//input[@id="first_name"]').type(faker.person.firstName());
      cy.xpath('//input[@id="last_name"]').type(faker.person.lastName());
      cy.xpath('//input[@id="company"]').type(`PGATS ${faker.company.name()}`);
      cy.xpath('//input[@id="address1"]').type(faker.location.streetAddress());
      cy.xpath('//select[@id="country"]').select('Canada');
      cy.xpath('//input[@id="state"]').type(faker.location.state());
      cy.xpath('//input[@id="city"]').type(faker.location.city());
      cy.xpath('//*[@data-qa="zipcode"]').type(faker.location.zipCode());
      cy.xpath('//*[@data-qa="mobile_number"]').type('012 222 333');

      cy.xpath('//*[@data-qa="create-account"]').click();

      cy.url().should('includes', 'account_created');
      cy.xpath('//b[contains(text(),"Account Created!")]');
    });

    it('Login de Usuário com e-mail e senha corretos', () => {
      cy.xpath('//*[@data-qa="login-email"]').type('qa-tester-1759685094171@test.com');
      cy.xpath('//*[@data-qa="login-password"]').type('12345');
      cy.xpath('//*[@data-qa="login-button"]').click();
      cy.xpath('//i[contains(@class,"fa-user")]').parent().should('contain', 'QA Tester');
    });

    it('Login de Usuário com e-mail e senha incorretos', () => {
      cy.xpath('//*[@data-qa="login-email"]').type('qa-tester-1759685094171@test.com');
      cy.xpath('//*[@data-qa="login-password"]').type('54321');
      cy.xpath('//*[@data-qa="login-button"]').click();
      cy.xpath('//form/p[contains(text(),"Your email or password is incorrect!")]').should('contain', 'Your email or password is incorrect!');
    });

    it('Logout de Usuário', () => {
      cy.xpath('//*[@data-qa="login-email"]').type('qa-tester-1759685094171@test.com');
      cy.xpath('//*[@data-qa="login-password"]').type('12345');
      cy.xpath('//*[@data-qa="login-button"]').click();
      cy.xpath('//i[contains(@class,"fa-user")]').parent().should('contain', 'QA Tester');
      cy.xpath('//a[@href="/logout"]').should('be.visible').click();
      cy.url().should('contain', 'login');
    });

    it('Cadastrar Usuário com e-mail existente no sistema', () => {
      cy.xpath('//*[@data-qa="signup-name"]').type('QA Tester');
      cy.xpath('//*[@data-qa="signup-email"]').type('qa-tester-1759685094171@test.com');
      cy.xpath('//button[contains(text(),"Signup")]').click();
      cy.xpath('//form/p[contains(text(),"Email Address already exist!")]').should('contain', 'Email Address already exist!');
    });

    it('Enviar um Formulário de Contato com upload de arquivo', () => {
      cy.xpath('//a[contains(@href,"contact")]').click();
      cy.xpath('//*[@data-qa="name"]').type(userData.name);
      cy.xpath('//*[@data-qa="email"]').type(userData.email);
      cy.xpath('//*[@data-qa="subject"]').type(userData.subject);
      cy.xpath('//*[@data-qa="message"]').type(userData.message);
      cy.fixture('example.json').as('arquivo');
      cy.xpath('//input[@type="file"]').selectFile('@arquivo');
      cy.xpath('//*[@data-qa="submit-button"]').click();
      cy.xpath('//*[contains(@class,"status")]').should('be.visible');
      cy.xpath('//*[contains(@class,"status")]').should('have.text','Success! Your details have been submitted successfully.');
    });

})    


    
    