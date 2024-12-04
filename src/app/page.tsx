import React from "react";

import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

export default function Page() {
  return (
    <div className="container">
      <div className="row py-4 justify-content-center align-items-center vh-100">
        <div className="col-12 col-md-6 mx-auto">
          <LoginForm />

          <hr className="my-5" />

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
