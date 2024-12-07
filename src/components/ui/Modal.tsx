import React, { ReactNode } from "react";

export default function Modal({ children }: { children?: ReactNode }) {
  return (
    <>
      <div
        aria-modal="true"
        className="modal show d-block"
        role="dialog"
        tabIndex={-1}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content rounded-3 shadow">
            <div className="modal-body p-4">{children}</div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop show" />
    </>
  );
}

Modal.defaultProps = {
  children: undefined,
};
