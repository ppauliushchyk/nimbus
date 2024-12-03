import React from "react";

import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

export default function Page() {
  return (
    <div className="container">
      <div className="row py-4">
        <div className="col-12 col-md-6 mx-auto">
          <LoginForm />

          <hr className="my-4" />

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
