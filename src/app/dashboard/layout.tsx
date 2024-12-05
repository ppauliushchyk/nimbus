import React, { ReactNode } from "react";

import LogoutForm from "@/components/LogoutForm";
import { verifySessionAsync } from "@/lib/dal";

export default async function Layout({
  children,
  modal,
}: Readonly<{ children: ReactNode; modal: ReactNode }>) {
  const { id } = await verifySessionAsync();

  return (
    <>
      <div className="container sticky-top pt-3">
        <nav className="navbar bg-body-tertiary p-3 rounded-3">
          <span className="navbar-text">
            ID:
            {" "}
            <b>{id.toString()}</b>
          </span>

          <LogoutForm />
        </nav>
      </div>

      <div className="container py-3">{children}</div>

      {modal}
    </>
  );
}
