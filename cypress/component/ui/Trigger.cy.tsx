import {
  AppRouterContext,
  AppRouterInstance,
} from "next/dist/shared/lib/app-router-context.shared-runtime";
import * as Router from "next/navigation";
import React from "react";

import Trigger from "../../../src/components/ui/Trigger";

const sizes = [
  [375, 667],
  [768, 1024],
  [1024, 768],
];

describe("Trigger", () => {
  sizes.forEach((size) => {
    describe(`${size[0]}x${size[1]} screen`, () => {
      beforeEach(() => {
        cy.viewport(size[0], size[1]);
      });

      it("renders basic structure", () => {
        const router = {} as unknown as AppRouterInstance;

        cy.stub(Router, "useRouter").returns(router);

        cy.mount(
          <AppRouterContext.Provider value={router}>
            <Trigger max={100} path="/" />
          </AppRouterContext.Provider>
        );

        cy.get(".spinner-border").should("not.exist");
      });
    });
  });
});
