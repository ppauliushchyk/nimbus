import React from "react";

import Modal from "../../../src/components/ui/Modal";

const sizes = [
  [375, 667],
  [768, 1024],
  [1024, 768],
];

describe("Modal", () => {
  sizes.forEach((size) => {
    describe(`${size[0]}x${size[1]} screen`, () => {
      beforeEach(() => {
        cy.viewport(size[0], size[1]);
      });

      it("renders basic structure with children", () => {
        cy.mount(
          <Modal>
            <p>TEST CONTENT</p>
          </Modal>
        );

        cy.get(".modal")
          .should("be.visible")
          .should("have.attr", "aria-modal", "true")
          .should("have.class", "show");

        cy.get(".modal-dialog").should("be.visible");

        cy.get(".modal-content").should("be.visible");

        cy.get(".modal-body")
          .should("be.visible")
          .should("contain", "TEST CONTENT");
      });

      it("handles arbitrary children", () => {
        cy.mount(
          <Modal>
            <div className="custom-child">CUSTOM CHILD CONTENT</div>
          </Modal>
        );

        cy.get(".custom-child")
          .should("be.visible")
          .should("contain", "CUSTOM CHILD CONTENT");
      });

      it("renders without children", () => {
        cy.mount(<Modal />);

        cy.get(".modal-body").should("be.empty");
      });
    });
  });
});
