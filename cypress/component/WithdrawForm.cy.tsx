import {
  AppRouterContext,
  AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import * as Router from "next/navigation";
import React from "react";

import WithdrawForm from "../../src/components/WithdrawForm";

const sizes = [
  [375, 667],
  [768, 1024],
  [1024, 768],
];

describe("WithdrawForm", () => {
  sizes.forEach((size) => {
    describe(`${size[0]}x${size[1]} screen`, () => {
      beforeEach(() => {
        cy.viewport(size[0], size[1]);
      });

      it("renders basic structure", () => {
        const router = {
          back: cy.stub().as("router:back"),
        } as unknown as AppRouterInstance;

        cy.stub(Router, "useRouter").returns(router);

        cy.mount(
          <AppRouterContext.Provider value={router}>
            <WithdrawForm />
          </AppRouterContext.Provider>
        );

        cy.get("h2").should("be.visible").should("have.text", "Withdraw funds");

        cy.get("input[name='amount']").should("be.visible");

        cy.get(".btn-primary")
          .should("be.visible")
          .should("have.text", "Withdraw");

        cy.get(".btn-secondary")
          .should("be.visible")
          .should("have.text", "Cancel");
      });

      it("handles cancel button", () => {
        const router = {
          back: cy.stub().as("router:back"),
        } as unknown as AppRouterInstance;

        cy.stub(Router, "useRouter").returns(router);

        cy.mount(
          <AppRouterContext.Provider value={router}>
            <WithdrawForm />
          </AppRouterContext.Provider>
        );

        cy.get(".btn-secondary").click();

        cy.get("@router:back").should("be.called");
      });
    });
  });
});
