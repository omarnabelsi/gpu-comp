"use client";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Modal } from "@/components/ui/modal";
import { ImageUploadInput } from "@/components/forms/image-upload-input";
import { bem } from "@/lib/bem";

export function ProjectManager({ initialItems, canEdit }) {
    const [items, setItems] = useState(initialItems);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [longDescription, setLongDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [specs, setSpecs] = useState('{"memory":"16GB","cores":"12000"}');
    const [performanceData, setPerformanceData] = useState('{"gaming4k":"120 FPS"}');
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
        setDescription("");
        setLongDescription("");
        setImageUrl("");
        setSpecs('{"memory":"16GB","cores":"12000"}');
        setPerformanceData('{"gaming4k":"120 FPS"}');
        setEditingId("");
        setStatus("");
    }

    async function saveItem(event) {
        event.preventDefault();
        const response = await fetch(editingId ? `/api/projects/${editingId}` : "/api/projects", {
            method: editingId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, longDescription, imageUrl, specs, performanceData }),
        });
        if (!response.ok) {
            setStatus("Could not save project. Check JSON fields.");
            return;
        }
        const saved = await response.json();
        setItems(editingId ? items.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...items]);
        resetForm();
        setIsModalOpen(false);
        setStatus("Project saved.");
    }

    async function deleteItem(id) {
        const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
        if (!response.ok) {
            setStatus("Could not delete project.");
            return;
        }
        setItems(items.filter((item) => item.id !== id));
        setPendingDeleteId("");
    }

    function editItem(item) {
        setEditingId(item.id);
        setTitle(item.title);
        setDescription(item.description);
        setLongDescription(item.longDescription);
        setImageUrl(item.imageUrl);
        setSpecs(JSON.stringify(item.specs, null, 2));
        setPerformanceData(JSON.stringify(item.performanceData, null, 2));
        setIsModalOpen(true);
    }

    return (<div className={bem("components-dashboard-project-manager__c1")}>
      {canEdit ? (
        <div className="project-header-row">
          <button type="button" className="create-project-trigger" onClick={openModal}>
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Create Project
          </button>
        </div>
      ) : null}

      <Modal
        open={isModalOpen}
        title={editingId ? "Edit Project" : "Create New Project"}
        onClose={closeModal}
        widthClass="max-w-lg"
        scrollable
      >
        <form onSubmit={saveItem} className="project-form-container">
          <div className="project-form-field">
            <label className="project-form-label">Project Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter project title"
              className="project-form-input"
            />
          </div>

          <div className="project-form-field">
            <label className="project-form-label">Image</label>
            <ImageUploadInput value={imageUrl} onChange={setImageUrl} section="PROJECTS"/>
          </div>

          <div className="project-form-field">
            <label className="project-form-label">Short Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Brief project description"
              rows={2}
              className="project-form-textarea"
            />
          </div>

          <div className="project-form-field">
            <label className="project-form-label">Long Description</label>
            <textarea
              value={longDescription}
              onChange={(event) => setLongDescription(event.target.value)}
              placeholder="Detailed project description"
              rows={3}
              className="project-form-textarea"
            />
          </div>

          <div className="project-form-field">
            <label className="project-form-label">Specs (JSON)</label>
            <textarea
              value={specs}
              onChange={(event) => setSpecs(event.target.value)}
              placeholder='{"memory":"16GB","cores":"12000"}'
              rows={3}
              className="project-form-textarea"
              style={{ fontFamily: "monospace" }}
            />
          </div>

          <div className="project-form-field">
            <label className="project-form-label">Performance Data (JSON)</label>
            <textarea
              value={performanceData}
              onChange={(event) => setPerformanceData(event.target.value)}
              placeholder='{"gaming4k":"120 FPS"}'
              rows={3}
              className="project-form-textarea"
              style={{ fontFamily: "monospace" }}
            />
          </div>

          <button type="submit" className="project-form-submit">
            {editingId ? "Update Project" : "Create Project"}
          </button>

          {status ? <p className="project-form-status">{status}</p> : null}
        </form>
      </Modal>

      <div className={bem("components-dashboard-project-manager__c10")}>
        {items.map((item) => (<div key={item.id} className={bem("components-dashboard-project-manager__c11")} style={{ borderRadius: "16px 3px 16px 3px" }}>
            <h3 className={bem("components-dashboard-project-manager__c12")}>{item.title}</h3>
            <p className={bem("components-dashboard-project-manager__c13")}>{item.description}</p>
            {canEdit ? (<div className={bem("components-dashboard-project-manager__c14")}>
                <button type="button" onClick={() => editItem(item)} className={bem("components-dashboard-project-manager__c15")}>
                  Edit
                </button>
                <button type="button" onClick={() => setPendingDeleteId(item.id)} className={bem("components-dashboard-project-manager__c16")}>
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
