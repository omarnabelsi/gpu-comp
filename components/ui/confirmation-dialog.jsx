"use client";

import { Modal } from "@/components/ui/modal";

export function ConfirmationDialog({ open, title = "Confirm Action", message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel }) {
    return (
        <Modal open={open} title={title} onClose={onCancel}>
            <p className="dashboard-modal-text">{message}</p>
            <div className="dashboard-modal-actions">
                <button type="button" className="premium-btn premium-btn-secondary premium-control" onClick={onCancel}>
                    {cancelText}
                </button>
                <button type="button" className="premium-btn premium-control border-rose-400/70 bg-rose-500/20 text-rose-200" onClick={onConfirm}>
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
}
