const sizes = [
  [375, 667],
  [768, 1024],
  [1024, 768],
];

describe("deposit", () => {
  sizes.forEach((size) => {
    describe(`${size[0]}x${size[1]} screen`, () => {
      beforeEach(() => {
        cy.viewport(size[0], size[1]);

        cy.visit("/");

        cy.fixture("account.json").then((account) => {
          cy.get("input[name='id']").type(account.id);
          cy.get(".btn-primary").click();

          cy.url().should("include", "/dashboard");

          cy.visit("/dashboard/deposit");
        });
      });

      it("renders basic structure", () => {
        cy.get("h2").should("be.visible").should("have.text", "Deposit funds");

        cy.get("input[name='amount']").should("be.visible");

        cy.get(".btn-primary")
          .should("be.visible")
          .should("have.text", "Deposit");

        cy.get(".btn-secondary")
          .should("be.visible")
          .should("have.text", "Cancel");
      });

      it("handles cancel button", () => {
        cy.get(".btn-secondary").click();

        cy.url().should("include", "/");
      });

      it("handles successfully deposit", () => {
        cy.fixture("transaction/valid.json").then((deposit) => {
          cy.get("input[name='amount']").type(deposit.amount);

          cy.get(".btn-primary").click();

          cy.url().should("include", "/dashboard");
        });
      });

      it("handles empty values", () => {
        cy.get(".btn-primary").click();

        cy.get(".invalid-feedback")
          .should("be.visible")
          .should("have.text", "Invalid");
      });

      it("handles invalid values", () => {
        cy.fixture("transaction/invalid.json").then((deposit) => {
          cy.get("input[name='amount']").type(deposit.amount);

          cy.get(".btn-primary").click();

          cy.get(".invalid-feedback")
            .should("be.visible")
            .should("have.text", "Invalid");
        });
      });
    });
  });
});
