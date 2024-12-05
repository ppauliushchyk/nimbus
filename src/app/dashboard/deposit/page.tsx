import React from "react";

import DepositForm from "@/components/DepositForm";

export default async function Page() {
  return (
    <div className="row">
      <div className="col">
        <DepositForm />
      </div>
    </div>
  );
}
