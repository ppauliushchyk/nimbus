import React, { Suspense } from "react";

import CreateTransactionForm from "@/components/CreateTransactionForm";
import TransactionTable from "@/components/TransactionTable";

export default async function Page() {
  return (
    <>
      <div className="row">
        <div className="col">
          <CreateTransactionForm />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <Suspense fallback={<>Loading</>}>
            <TransactionTable />
          </Suspense>
        </div>
      </div>
    </>
  );
}
