import React from "react";

import Copy from "../../../src/components/ui/Copy";

const sizes = [
  [375, 667],
  [768, 1024],
  [1024, 768],
];

describe("Copy", () => {
  sizes.forEach((size) => {
    describe(`${size[0]}x${size[1]} screen`, () => {
      beforeEach(() => {
        cy.viewport(size[0], size[1]);
      });

      it("renders a button without children", () => {
        cy.mount(<Copy />);

        cy.get("button").should("be.visible").should("have.text", "");
      });

      it("renders a button with children", () => {
        cy.mount(<Copy>TEST CHILDREN</Copy>);

        cy.get("button")
          .should("be.visible")
          .should("have.text", "TEST CHILDREN");
      });

      it("renders a button with children and a specified value", () => {
        cy.mount(<Copy value="TEST VALUE">TEST CHILDREN</Copy>);

        cy.get("button")
          .should("be.visible")
          .should("have.text", "TEST CHILDREN");
      });
    });
  });
});
