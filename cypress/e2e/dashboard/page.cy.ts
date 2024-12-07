const sizes = [
  [375, 667],
  [768, 1024],
  [1024, 768],
];

describe("dashboard", () => {
  sizes.forEach((size) => {
    describe(`${size[0]}x${size[1]} screen`, () => {
      beforeEach(() => {
        cy.viewport(size[0], size[1]);

        cy.visit("/");

        cy.fixture("account.json").then((account) => {
          cy.get("input[name='id']").type(account.id);
          cy.get(".btn-primary").click();

          cy.url().should("include", "/dashboard");
        });
      });

      it("renders basic structure", () => {
        cy.get(".container").should("be.visible");

        cy.get("[data-cy='account-card']").should("be.visible");

        cy.get("a[href='/dashboard/deposit']").should("be.visible");
        cy.get("a[href='/dashboard/withdraw']").should("be.visible");

        cy.get("table").should("be.visible");
      });

      it("handles deposit modal open", () => {
        cy.intercept("POST", "/dashboard/deposit").as("route:deposit");

        cy.get("[data-cy='balance']")
          .should("be.visible")
          .then((element) => {
            const current = element.text().replace("$", "").replace(",", "");

            cy.get("a[href='/dashboard/deposit']").click();

            cy.url().should("include", "/dashboard/deposit");

            cy.get(".modal").should("be.visible");
            cy.get("h2")
              .should("be.visible")
              .should("have.text", "Deposit funds");

            cy.get(".modal input[name='amount']").type("10");
            cy.get(".modal button[type='submit']").click();

            cy.wait("@route:deposit").then(() => {
              cy.url().should("include", "/dashboard");

              cy.get("[data-cy='balance']")
                .should("be.visible")
                .should(
                  "include.text",
                  new Intl.NumberFormat("en-US").format(
                    Math.abs(parseInt(current, 10) + 10)
                  )
                );
            });
          });
      });

      it("handles withdraw modal open", () => {
        cy.intercept("POST", "/dashboard/withdraw").as("route:withdraw");

        cy.get("[data-cy='balance']")
          .should("be.visible")
          .then((element) => {
            const current = element.text().replace("$", "").replace(",", "");

            cy.get("a[href='/dashboard/withdraw']").click();

            cy.url().should("include", "/dashboard/withdraw");

            cy.get(".modal").should("be.visible");
            cy.get("h2")
              .should("be.visible")
              .should("have.text", "Withdraw funds");

            cy.get(".modal input[name='amount']").type("10");
            cy.get(".modal button[type='submit']").click();

            cy.wait("@route:withdraw").then(() => {
              cy.url().should("include", "/dashboard");

              cy.scrollTo(0, 0);

              cy.get("[data-cy='balance']")
                .should("be.visible")
                .should(
                  "include.text",
                  new Intl.NumberFormat("en-US").format(
                    Math.abs(parseInt(current, 10) - 10)
                  )
                );
            });
          });
      });

      it("handles balance refresh", () => {
        cy.intercept("/api/balance").as("api:balance");

        cy.get("[data-cy='balance']")
          .should("be.visible")
          .then((element) => {
            const current = element.text().replace("$", "").replace(",", "");

            cy.request("POST", "/api/deposit", { amount: "10" });

            cy.wait("@api:balance", { timeout: 20000 }).then(() => {
              cy.get("[data-cy='balance']")
                .should("be.visible")
                .should(
                  "include.text",
                  new Intl.NumberFormat("en-US").format(
                    Math.abs(parseInt(current, 10) + 10)
                  )
                );
            });
          });
      });
    });
  });
});
