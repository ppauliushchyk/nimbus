import { faker } from "@faker-js/faker";

const sizes = [
  [375, 667],
  [768, 1024],
  [1024, 768],
];

describe("app", () => {
  sizes.forEach((size) => {
    describe(`${size[0]}x${size[1]} screen`, () => {
      beforeEach(() => {
        cy.viewport(size[0], size[1]);
      });

      it("renders basic structure", () => {
        cy.visit("http://localhost:3000/");

        cy.get(".container").should("be.visible");

        cy.get("h1").should("be.visible").should("have.text", "Login");
        cy.get("input[name='id']").should("be.visible");
        cy.get(".btn-primary")
          .should("be.visible")
          .should("have.text", "Login");

        cy.get("span")
          .should("be.visible")
          .should("have.text", "Or register a new account");

        cy.get(".btn-secondary")
          .should("be.visible")
          .should("have.text", "Register");
      });

      it("handles successful login", () => {
        cy.visit("http://localhost:3000/");

        cy.fixture("account.json").then((account) => {
          cy.get("input[name='id']").type(account.id);

          cy.get(".btn-primary").click();

          cy.url().should("include", "/dashboard");
        });
      });

      it("handles failed login", () => {
        cy.visit("http://localhost:3000/");

        cy.get("input[name='id']").type(faker.string.uuid());

        cy.get(".btn-primary").click();

        cy.get(".alert-danger").should("be.visible");
      });
    });
  });
});
