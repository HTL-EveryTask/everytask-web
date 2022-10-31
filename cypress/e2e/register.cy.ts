describe("New User", () => {
  it("passes", () => {
    cy.visit("/register");

    cy.get("input").clear();

    cy.get("input[id='username']").type("test");
    cy.get("input[id='email']").type("nayonyx@gmail.com");
    cy.get("input[id='password']").type("MyPassword.");
    cy.get("input[id='confirmPassword']").type("MyPassword.");
    cy.get("button[type='submit']").click();

    cy.url().should("include", "/login");
  });
});

describe("Existing User", () => {
  it("fails", () => {
    cy.visit("/register");

    cy.get("input").clear();

    cy.get("input[id='username']").type("test");
    cy.get("input[id='email']").type("nayonyx@gmail.com");
    cy.get("input[id='password']").type("MyPassword.");
    cy.get("input[id='confirmPassword']").type("MyPassword.");
    cy.get("button[type='submit']").click();

    cy.url().should("include", "/register");
  });
});
