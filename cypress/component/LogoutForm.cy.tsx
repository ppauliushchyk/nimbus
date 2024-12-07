import React from "react";

import LogoutForm from "../../src/components/LogoutForm";

const sizes = [
  [375, 667],
  [768, 1024],
  [1024, 768],
];

describe("LogoutForm", () => {
  sizes.forEach((size) => {
    describe(`${size[0]}x${size[1]} screen`, () => {
      beforeEach(() => {
        cy.viewport(size[0], size[1]);
      });

      it("renders basic structure", () => {
        cy.mount(<LogoutForm />);

        cy.get(".btn-light").should("be.visible").should("have.text", "Logout");
      });
    });
  });
});
