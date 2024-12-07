import React from "react";

import Input from "../../../src/components/ui/Input";

const sizes = [
  [375, 667],
  [768, 1024],
  [1024, 768],
];

describe("Input", () => {
  sizes.forEach((size) => {
    describe(`${size[0]}x${size[1]} screen`, () => {
      beforeEach(() => {
        cy.viewport(size[0], size[1]);
      });

      it("renders label and input", () => {
        cy.mount(<Input label="TEST LABEL" name="test_name" />);

        cy.get(".input-group").should("be.visible");

        cy.get(".form-floating").should("be.visible");

        cy.get("input")
          .should("be.visible")
          .should("have.attr", "type", "text")
          .should("have.attr", "id", "test_name__input")
          .should("have.attr", "name", "test_name");

        cy.get("label").should("be.visible").should("have.text", "TEST LABEL");

        cy.get(".form-text").should("not.exist");
      });

      it("renders description", () => {
        cy.mount(
          <Input
            description="TEST DESCRIPTION"
            label="TEST LABEL"
            name="test_name"
          />
        );

        cy.get(".form-text")
          .should("be.visible")
          .should("have.text", "TEST DESCRIPTION");
      });

      it("renders errors", () => {
        const errors = ["Error 1", "Error 2"];

        cy.mount(<Input errors={errors} label="TEST LABEL" name="test_name" />);

        cy.get(".invalid-feedback").should("have.length", errors.length);

        errors.forEach((error, index) => {
          cy.get(".invalid-feedback")
            .eq(index)
            .should("be.visible")
            .should("have.text", error);
        });
      });

      it("handles className prop", () => {
        cy.mount(
          <Input className="custom-class" label="TEST LABEL" name="test_name" />
        );

        cy.get(".input-group").should("have.class", "custom-class");
      });

      it("updates label when label prop changes", () => {
        cy.mount(<Input label="TEST LABEL" name="test_name" />);

        cy.get("label").should("have.text", "TEST LABEL");

        cy.mount(<Input label="UPDATED LABEL" name="test_name" />);

        cy.get("label").should("have.text", "UPDATED LABEL");
      });
    });
  });
});
