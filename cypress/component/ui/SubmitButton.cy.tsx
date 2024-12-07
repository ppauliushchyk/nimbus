import React from "react";
import * as ReactDom from "react-dom";

import SubmitButton from "../../../src/components/ui/SubmitButton";

const sizes = [
  [375, 667],
  [768, 1024],
  [1024, 768],
];

describe("SubmitButton", () => {
  sizes.forEach((size) => {
    describe(`${size[0]}x${size[1]} screen`, () => {
      beforeEach(() => {
        cy.viewport(size[0], size[1]);
      });

      it("renders basic structure", () => {
        cy.mount(<SubmitButton>Submit</SubmitButton>);

        cy.get("button")
          .should("be.visible")
          .should("have.text", "Submit")
          .should("not.be.disabled");
      });

      it("renders with pending state", () => {
        cy.mount(<SubmitButton>Submit</SubmitButton>);

        cy.stub(ReactDom, "useFormStatus").returns({ pending: true });

        cy.get("button").should("be.visible").should("be.disabled");

        cy.get(".spinner-border").should("be.visible");
      });

      it("handles custom class name", () => {
        cy.mount(<SubmitButton className="custom-class">Submit</SubmitButton>);

        cy.get("button").should("have.class", "custom-class");
      });
    });
  });
});
