import React, { ReactNode } from "react";

import LogoutForm from "@/components/LogoutForm";
import { verifySessionAsync } from "@/lib/dal";

export default async function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { id } = await verifySessionAsync();

  return (
    <>
      <div className="container">
        <nav className="navbar bg-body-tertiary sticky-top p-3 rounded-3 mt-3">
          <span className="navbar-text">
            ID:
            {" "}
            <b>{id.toString()}</b>
          </span>

          <LogoutForm />
        </nav>
      </div>

      <div className="container py-3">{children}</div>
    </>
  );
}
