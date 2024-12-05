import Link from "next/link";
import React from "react";

import { readBalanceAsync } from "@/actions/transaction";
import Trigger from "@/components/Trigger";
import { readAccountAsync } from "@/lib/dal";
import prisma from "@/lib/prisma";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ limit: string }>;
}) {
  const { limit } = await searchParams;

  const { id } = await readAccountAsync();

  const transactions = await prisma.transaction.findMany({
    orderBy: { updatedAt: "desc" },
    skip: 0,
    take: parseInt(limit || "0", 10),
    where: { accountId: id },
  });

  const count = await prisma.transaction.count({ where: { accountId: id } });

  const balance = await readBalanceAsync();

  return (
    <>
      <div className="row mb-3">
        <div className="col-auto mx-auto text-center">
          <span className="text-body-secondary">Balance</span>
          <h2>{new Intl.NumberFormat("en-US").format(balance)}</h2>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-auto mx-auto">
          <div className="d-flex gap-3">
            <Link className="btn btn-primary" href="/dashboard/deposit">
              Deposit
            </Link>

            <Link className="btn btn-light" href="/dashboard/withdraw">
              Withdraw
            </Link>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
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
                        <td>
                          {new Intl.NumberFormat("en-US").format(item.amount)}
                        </td>
                        <td>{item.type}</td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td
                          className="text-center text-body-tertiary"
                          colSpan={3}
                        >
                          No transactions were found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <Trigger max={count} path="/dashboard" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
