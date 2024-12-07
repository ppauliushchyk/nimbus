import React from "react";

import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

export default function Page() {
  return (
    <div className="container">
      <div className="row py-4 justify-content-center align-items-center vh-100">
        <div className="col-12 col-md-6 col-lg-4 mx-auto">
          <LoginForm />

          <div className="d-flex align-items-center gap-2 my-3">
            <hr className="flex-grow-1 m-0" />

            <span className="fs-7 text-body-tertiary">
              Or register a new account
            </span>

            <hr className="flex-grow-1 m-0" />
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
