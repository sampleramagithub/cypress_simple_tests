beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Test suite for visual tests for registration form 3 is already created
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns
    * checkboxes, their content and links
    * email format
 */







/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + validation
    * only mandatory fields are filled in + validations
    * mandatory fields are absent + validations (try using function)
    * If city is already chosen and country is updated, then city choice should be removed
    * add file (google yourself for solution)
 */


describe('Test suite for visual tests for registration form 3', () => {
    it('check radio button regarding the frequncy of receiving the newletter ', () => {

        //verify that there are 4 options
        cy.get('input[type="radio"]').should('have.length', 4)

        //verify default state of radio buttons
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        //verify that radio button names are correct
        cy.get('input[type="radio"]').next().eq(0).should('have.text', 'Daily')
        cy.get('input[type="radio"]').next().eq(1).should('have.text', 'Weekly')
        cy.get('input[type="radio"]').next().eq(2).should('have.text', 'Monthly')
        cy.get('input[type="radio"]').next().eq(3).should('have.text', 'Never')

        //verify that radio buttons behave correctly, only one option at the time
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')

    });

    it('check dropdown and dependencies between 2 dropdowns', () => {

        //verify that dropdown has only 4 options
        cy.get('#country').find('option').should('have.length', 4)

        //check that first element in the dropdown has no text
        cy.get('#country').find('option').eq(0).should('not.have.text')

        //verify that the third element has text Austria
        cy.get('#country').find('option').eq(3).should('have.text', 'Austria')

        //verify that all dropdown elements are in place
        cy.get('#country').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['', 'object:3', 'object:4', 'object:5'])
        })

    });

    it('check email format', () => {

        //using not allowed characters 
        cy.get('input[type="email"]').type('////')
        cy.get('span').contains('Invalid email address')

        //clearing input to see error msg
        cy.get('input[type="email"]').clear()
        cy.get('span').contains('Email is required.')

        //using wrong type of format
        cy.get('input[type="email"]').type('email.com')
        cy.get('span').contains('Invalid email address')

    });
})


describe('test suite for functional tests', () => {
    it(' verify only mandatory fields are filled in + validations', () => {

        inputValidData()

        //clearing optional fields
        cy.get('#name').clear()
        cy.get('input[type="date"]').clear()
        cy.get('#birthday').clear()

        //asserting that there is no errors
        cy.get('input[type="submit"]').eq(1).should('be.enabled')
        cy.get('span').contains('Email is required.').should('not.be.visible')
        cy.get('span').contains('Invalid email address').should('not.be.visible')
        cy.get('input[type="submit"]').eq(1).click()

        //asserting that submit button takes user to correct destination
        cy.url().should('contain', '/upload_file.html') 

    });

    it('check mandatory fields are absent + validations', () => {
        inputValidData()
        cy.get('#country').select('')

        //clearing optional fields
        cy.get('#name').clear()
        cy.get('input[type="date"]').clear()
        cy.get('#birthday').clear()
        cy.get('input[type="checkbox"]').eq(1).uncheck()

        //asserting that there is no errors
        cy.get('input[type="submit"]').eq(1).should('be.disabled')
        cy.get('h2').click
        cy.get('span').contains('Email is required.').should('not.be.visible')
        cy.get('span').contains('Invalid email address').should('not.be.visible')

    });

    it('If city is already chosen and country is updated, then city choice should be removed', () => {
        inputValidData('Ramana')

        //chosing another country
        cy.get('#country').select('Austria')

        //asserting that city has been disselected
        cy.get('#city').should('not.be.checked')
        //asserting that there is no errors
        cy.get('input[type="submit"]').eq(1).should('be.disabled')
        cy.get('h2').click
        cy.get('span').contains('Email is required.').should('not.be.visible')
        cy.get('span').contains('Invalid email address').should('not.be.visible')

    });


})

function inputValidData() {
    cy.log('All fields will be filled')
    cy.get('#name').type('ramanTester')
    cy.get('input[type="email"]').type('ramana@gmail.com')
    cy.get('#country').select('Estonia')
    cy.get('#city').select('Tallinn')
    cy.get('input[type="date"]').eq(0).type('2023-07-09')
    cy.get('#birthday').type('1914-01-01')
    cy.get('input[type="checkbox"]').eq(0).check()
    cy.get('input[type="checkbox"]').eq(1).check()
}

