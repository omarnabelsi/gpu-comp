"use client";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Modal } from "@/components/ui/modal";
import { RichTextEditor } from "@/components/forms/rich-text-editor";
import { bem } from "@/lib/bem";

export function NewsManager({ initialItems, canEdit }) {
    const [items, setItems] = useState(initialItems);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState("");
    const [pendingDeleteId, setPendingDeleteId] = useState("");
    const [status, setStatus] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    function openModal() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
        if (!editingId) {
            resetForm();
        }
    }

    function resetForm() {
        setTitle("");
        setContent("");
        setEditingId("");
        setStatus("");
    }

    async function saveItem(event) {
        event.preventDefault();
        const response = await fetch(editingId ? `/api/news/${editingId}` : "/api/news", {
            method: editingId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
        });
        if (!response.ok) {
            setStatus("Could not save news item.");
            return;
        }
        const saved = await response.json();
        setItems(editingId ? items.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...items]);
        resetForm();
        setIsModalOpen(false);
        setStatus("News item saved.");
    }

    async function deleteItem(id) {
        const response = await fetch(`/api/news/${id}`, { method: "DELETE" });
        if (!response.ok) {
            setStatus("Could not delete news item.");
            return;
        }
        setItems(items.filter((item) => item.id !== id));
        setPendingDeleteId("");
    }

    function editItem(item) {
        setEditingId(item.id);
        setTitle(item.title);
        setContent(item.content);
        setIsModalOpen(true);
    }

    return (<div className={bem("components-dashboard-news-manager__c1")}>
      {canEdit ? (
        <div className="project-header-row">
          <button type="button" className="create-project-trigger" onClick={openModal}>
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Create News
          </button>
        </div>
      ) : null}

      <Modal
        open={isModalOpen}
        title={editingId ? "Edit News" : "Create News Item"}
        onClose={closeModal}
        widthClass="max-w-lg"
        scrollable
      >
        <form onSubmit={saveItem} className="project-form-container">
          <div className="project-form-field">
            <label className="project-form-label">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter news title"
              className="project-form-input"
            />
          </div>

          <div className="project-form-field">
            <label className="project-form-label">Content</label>
            <RichTextEditor value={content} onChange={setContent}/>
          </div>

          <button type="submit" className="project-form-submit">
            {editingId ? "Update News" : "Create News"}
          </button>

          {status ? <p className="project-form-status">{status}</p> : null}
        </form>
      </Modal>

      <div className={bem("components-dashboard-news-manager__c6")}>
        {items.map((item) => (<div key={item.id} className={bem("components-dashboard-news-manager__c7")} style={{ borderRadius: "16px 3px 16px 3px" }}>
            <h3 className={bem("components-dashboard-news-manager__c8")}>{item.title}</h3>
            <div className={bem("components-dashboard-news-manager__c9")} dangerouslySetInnerHTML={{ __html: item.content.slice(0, 220) }}/>
            {canEdit ? (<div className={bem("components-dashboard-news-manager__c10")}>
                <button type="button" onClick={() => editItem(item)} className={bem("components-dashboard-news-manager__c11")}>
                  Edit
                </button>
                <button type="button" onClick={() => setPendingDeleteId(item.id)} className={bem("components-dashboard-news-manager__c12")}>
                  Delete
                </button>
              </div>) : null}
          </div>))}
      </div>
      <ConfirmationDialog
        open={Boolean(pendingDeleteId)}
        message="Are you sure you want to delete this?"
        confirmText="Confirm"
        cancelText="Cancel"
        onCancel={() => setPendingDeleteId("")}
        onConfirm={() => deleteItem(pendingDeleteId)}
      />
    </div>);
}
