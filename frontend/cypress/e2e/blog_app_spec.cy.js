describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user1 = {
      name: 'Valtteri Lakanen',
      username: 'vadelma',
      password: 'salasana',
    };
    const user2 = {
      name: 'Hakkeri',
      username: 'hacker69',
      password: 'salis',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', user1);
    cy.request('POST', 'http://localhost:3003/api/users/', user2);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', function () {
    cy.contains('Login');
    cy.contains('username');
    cy.contains('password');
    cy.contains('login');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('vadelma');
      cy.get('#password').type('salasana');
      cy.get('#login-button').click();
      cy.contains('Valtteri Lakanen logged in');
    });

    it('fails with wrong credentials', function () {
      cy.get('#username').type('vääräkäyttäjätunnus');
      cy.get('#password').type('vääräsalasana');
      cy.get('#login-button').click();
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('vadelma');
      cy.get('#password').type('salasana');
      cy.get('#login-button').click();
    });

    it('A blog can be created', function () {
      cy.get('#new-blog-button').click();
      cy.get('#title-input').type('Cypress Test Blog');
      cy.get('#author-input').type('Cypress');
      cy.get('#url-input').type('www.cprss.inet.fi');
      cy.get('#create-button').click();
      cy.get('.notification').should('have.css', 'color', 'rgb(0, 128, 0)');
      cy.get('.blog').contains('Cypress Test Blog');
      cy.get('#view-button').click();
      cy.get('.blog-details').contains('www.cprss.inet.fi');
    });

    it('a Blog can be liked', function () {
      cy.get('#new-blog-button').click();
      cy.get('#title-input').type('Cypress Test Blog');
      cy.get('#author-input').type('Cypress');
      cy.get('#url-input').type('www.cprss.inet.fi');
      cy.get('#create-button').click();
      cy.get('#view-button').click();
      cy.get('.blog-details').should('contain', 'likes 0');
      cy.get('#like-button').click();
      cy.get('.blog-details').should('contain', 'likes 1');
    });

    it('a Blog can be removed by user who created it', function () {
      cy.get('#new-blog-button').click();
      cy.get('#title-input').type('Cypress Test Blog');
      cy.get('#author-input').type('Cypress');
      cy.get('#url-input').type('www.cprss.inet.fi');
      cy.get('#create-button').click();
      cy.get('#view-button').click();
      cy.get('.blog-details').should('contain', 'remove');
      cy.get('.remove').click();
      cy.get('.notification')
        .should('have.css', 'color', 'rgb(0, 128, 0)')
        .and('contain', 'removed');
    });

    it('a Blog cannot be removed by other user', function () {
      cy.get('#new-blog-button').click();
      cy.get('#title-input').type('Cypress Test Blog');
      cy.get('#author-input').type('Cypress');
      cy.get('#url-input').type('www.cprss.inet.fi');
      cy.get('#create-button').click();
      cy.get('#logout-button').click();
      cy.get('#username').type('hacker69');
      cy.get('#password').type('salis');
      cy.get('#login-button').click();
      cy.get('#view-button').click();
      cy.get('.blog-details').should('not.contain', 'remove');
    });

    it('Blogs should be ordered by likes', function () {
      cy.get('#new-blog-button').click();
      cy.get('#title-input').type('Test Blog 1');
      cy.get('#author-input').type('Cypress');
      cy.get('#url-input').type('www.cprss.inet.fi');
      cy.get('#create-button').click();
      cy.wait(500);
      cy.get('.blog').contains('Test Blog 1').contains('view').click();
      cy.get('#new-blog-button').click();
      cy.get('#title-input').type('Test Blog 2');
      cy.get('#author-input').type('Cypress');
      cy.get('#url-input').type('www.cprss.inet.fi');
      cy.get('#create-button').click();
      cy.wait(500);
      cy.get('.blog').contains('Test Blog 2').contains('view').click();
      cy.get('#new-blog-button').click();
      cy.get('#title-input').type('Test Blog 3');
      cy.get('#author-input').type('Cypress');
      cy.get('#url-input').type('www.cprss.inet.fi');
      cy.get('#create-button').click();
      cy.wait(500);
      cy.get('.blog').contains('Test Blog 3').contains('view').click();
      cy.wait(500);
      cy.get('.blog-details').contains('Test Blog 3').contains('like').click();
      cy.get('.blog-details').contains('Test Blog 2').contains('like').click();
      cy.get('.blog-details').contains('Test Blog 3').contains('like').click();
      cy.wait(500);
      cy.get('.blog-details')
        .eq(0)
        .should('contain', 'Test Blog 3')
        .and('contain', 'likes 2');
      cy.get('.blog-details')
        .eq(1)
        .should('contain', 'Test Blog 2')
        .and('contain', 'likes 1');
      cy.get('.blog-details')
        .eq(2)
        .should('contain', 'Test Blog 1')
        .and('contain', 'likes 0');
    });
  });
});
