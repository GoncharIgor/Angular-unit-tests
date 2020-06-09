context('Home page', () => {

    beforeEach(() => {
        // expect(true).to.equal(true, 'Incorrect value');

        cy.fixture('courses.json').as('coursesJSON'); // loaded file from fixtures folder and gave him an alias

        cy.server(); // mock http BE

        // link fixture data to particular http request. 2-nd parameter - response
        cy.route('/api/courses', '@coursesJSON').as('courses');

        cy.visit('/');
    })

    it('should display a list of courses', () => {
        cy.contains('All Courses');

        cy.wait('@courses'); // wait for @courses event to finish
        cy.get('mat-card').should('have.length', 9);
    })

    it('should display the advanced courses', () => {
        cy.get('.mat-tab-label').should('have.length', 2);

        cy.get('.mat-tab-label').last().click();

        // checking that the list of titles is not empty
        cy.get('.mat-tab-body-active .mat-card-title').its('length').should('be.gt', 1);

        cy.get('.mat-tab-body-active .mat-card-title').first().should('contain', 'Angular Security Course');
    })
});
