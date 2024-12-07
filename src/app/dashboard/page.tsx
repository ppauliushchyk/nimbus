import { TransactionType } from "@prisma/client";
import { DateTime } from "luxon";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { MdNorthEast, MdSouthEast } from "react-icons/md";

import { readBalanceAsync } from "@/actions/transaction";
import Trigger from "@/components/Trigger";
import { Copy } from "@/components/ui/Copy";
import { readAccountAsync } from "@/lib/dal";
import prisma from "@/lib/prisma";

function readIcon(type: TransactionType) {
  switch (type) {
    case "UserMoneyIn": {
      return <MdNorthEast className="text-green" />;
    }

    case "UserMoneyOut": {
      return <MdSouthEast className="text-red" />;
    }

    default: {
      return null;
    }
  }
}

function Type({ children }: { children: TransactionType }) {
  return readIcon(children);
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ limit: string }>;
}) {
  const { limit } = await searchParams;

  const account = await readAccountAsync();

  if (!account) {
    notFound();
  }

  const transactions = await prisma.transaction.findMany({
    orderBy: { updatedAt: "desc" },
    skip: 0,
    take: parseInt(limit || "0", 10),
    where: { accountId: account.id },
  });

  const count = await prisma.transaction.count({
    where: { accountId: account.id },
  });

  const balance = await readBalanceAsync();

  return (
    <div className="row">
      <div className="col-12 col-md-4 mx-auto">
        <div className="position-sticky top-0 pt-3">
          <div className="card shadow rounded-4 text-bg-primary mb-4">
            <div className="card-body">
              <div className="fs-7 mb-3">
                <div className="text-truncate opacity-50">Account</div>

                <Copy className="mw-100">{account.id}</Copy>
              </div>

              <div className="fs-7 text-truncate opacity-50">Balance</div>

              <div className="fs-2 fw-bold text-truncate">
                {new Intl.NumberFormat("en-US", {
                  currency: "USD",
                  style: "currency",
                }).format(balance)}
              </div>
            </div>
          </div>

          <div className="d-flex gap-3 px-3">
            <Link
              className="btn btn-outline-dark flex-grow-1"
              href="/dashboard/deposit"
            >
              Deposit
            </Link>

            <Link
              className="btn btn-outline-dark flex-grow-1"
              href="/dashboard/withdraw"
            >
              Withdraw
            </Link>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-8">
        <div className="table-responsive">
          <table className="table table-borderless table-hover align-middle mb-0">
            <thead>
              <tr>
                <th
                  aria-label="Transaction type"
                  className="pe-0"
                  scope="col"
                  style={{ width: 16 }}
                />

                <th className="fw-light text-body-tertiary" scope="col">
                  Amount
                </th>

                <th className="fw-light text-body-tertiary" scope="col">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((item) => (
                <tr key={item.id}>
                  <td className="rounded-start pe-0">
                    <div className="d-flex align-items-center justify-content-end">
                      <Type>{item.type}</Type>
                    </div>
                  </td>

                  <td className="fw-medium">
                    {new Intl.NumberFormat("en-US", {
                      currency: "USD",
                      style: "currency",
                    }).format(item.amount)}
                  </td>

                  <td className="text-body-tertiary rounded-end">
                    {DateTime.fromJSDate(item.createdAt).toLocaleString(
                      DateTime.DATE_MED,
                    )}
                  </td>
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

          <Trigger max={count} path="/dashboard" />
        </div>
      </div>
    </div>
  );
}
