import React from "react";

import Modal from "@/components/ui/Modal";
import WithdrawForm from "@/components/WithdrawForm";

export default async function Page() {
  return (
    <Modal>
      <WithdrawForm />
    </Modal>
  );
}
