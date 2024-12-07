"use client";

import { TransactionType } from "@prisma/client";
import { FaArrowDown } from "@react-icons/all-files/fa/FaArrowDown";
import { FaArrowUp } from "@react-icons/all-files/fa/FaArrowUp";
import React from "react";

function readIcon(type: TransactionType) {
  switch (type) {
    case "UserMoneyIn": {
      return <FaArrowUp className="text-green" />;
    }

    case "UserMoneyOut": {
      return <FaArrowDown className="text-red" />;
    }

    default: {
      return null;
    }
  }
}

export default function TransactionTypeIcon({
  children,
}: {
  children: TransactionType;
}) {
  return readIcon(children);
}
