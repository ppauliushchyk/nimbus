import React, { ReactNode } from "react";

import LogoutForm from "@/components/LogoutForm";

export default function Layout({
  children,
  modal,
}: Readonly<{ children: ReactNode; modal: ReactNode }>) {
  return (
    <main>
      <div className="container mb-3">
        <nav className="navbar justify-content-end py-3">
          <LogoutForm />
        </nav>
      </div>

      <div className="container mb-3">{children}</div>

      {modal}
    </main>
  );
}
