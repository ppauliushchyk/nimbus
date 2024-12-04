"use client";

import { Transaction } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { readTransactions } from "@/actions/transaction";

export default function TransactionTable() {
  const { ref, inView } = useInView();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([] as Transaction[]);

  async function load() {
    const result = await readTransactions(transactions.length);

    setTransactions([...transactions, ...result]);
    setLoading(false);
  }

  useEffect(() => {
    if (inView) {
      setLoading(true);
      load();
    }
  }, [inView]);

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-borderless mb-0">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Amount</th>
                <th scope="col">Type</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{item.id}</th>
                  <td>{item.amount}</td>
                  <td>{item.type}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td className="text-center text-body-tertiary" colSpan={3}>
                    No transactions were found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {loading && (
            <div className="spinner-border text-primary mt-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}

          <div ref={ref} />
        </div>
      </div>
    </div>
  );
}
