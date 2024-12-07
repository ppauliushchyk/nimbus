import React from "react";

import DepositForm from "@/components/DepositForm";
import Modal from "@/components/ui/Modal";

export default function Page() {
  return (
    <Modal>
      <DepositForm />
    </Modal>
  );
}
