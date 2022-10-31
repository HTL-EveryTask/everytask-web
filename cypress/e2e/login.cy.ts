describe("Login as new User", () => {
  it("passes", () => {
    // go to register page and register a new user
    cy.visit("/register");
    cy.get("input").clear();
    cy.get("input[id='username']").type("test");
    cy.get("input[id='email']").type("newEmail@mail.com");
    cy.get("input[id='password']").type("MyPassword.");
    cy.get("input[id='confirmPassword']").type("MyPassword.");
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/login");

    // go to login page and login as new user
    cy.visit("/login");
    cy.get("input").clear();
    cy.get("input[id='email']").type("newEmail@mail.com");
    cy.get("input[id='password']").type("MyPassword.");
    cy.get("button[type='submit']").click();
    cy.url().should("include", "/home");
  });
});
