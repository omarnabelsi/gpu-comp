"use client";
import { useState } from "react";
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
    const [status, setStatus] = useState("");
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
        setTitle("");
        setDescription("");
        setLongDescription("");
        setImageUrl("");
        setEditingId("");
        setStatus("Project saved.");
    }
    async function deleteItem(id) {
        const response = await fetch(`/api/projects/${id}`, { method: "DELETE" });
        if (!response.ok) {
            setStatus("Could not delete project.");
            return;
        }
        setItems(items.filter((item) => item.id !== id));
    }
    function editItem(item) {
        setEditingId(item.id);
        setTitle(item.title);
        setDescription(item.description);
        setLongDescription(item.longDescription);
        setImageUrl(item.imageUrl);
        setSpecs(JSON.stringify(item.specs, null, 2));
        setPerformanceData(JSON.stringify(item.performanceData, null, 2));
    }
    return (<div className={bem("components-dashboard-project-manager__c1")}>
      {canEdit ? (<form onSubmit={saveItem} className={bem("components-dashboard-project-manager__c2")} style={{ borderRadius: "18px 3px 18px 3px" }}>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Project title" className={bem("components-dashboard-project-manager__c3")}/>
          <ImageUploadInput value={imageUrl} onChange={setImageUrl} section="PROJECTS"/>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Short description" rows={3} className={bem("components-dashboard-project-manager__c4")}/>
          <textarea value={longDescription} onChange={(event) => setLongDescription(event.target.value)} placeholder="Long description" rows={4} className={bem("components-dashboard-project-manager__c5")}/>
          <textarea value={specs} onChange={(event) => setSpecs(event.target.value)} placeholder="Specs JSON" rows={3} className={bem("components-dashboard-project-manager__c6")}/>
          <textarea value={performanceData} onChange={(event) => setPerformanceData(event.target.value)} placeholder="Performance JSON" rows={3} className={bem("components-dashboard-project-manager__c7")}/>
          <button className={bem("components-dashboard-project-manager__c8")}>{editingId ? "Update Project" : "Create Project"}</button>
          {status ? <p className={bem("components-dashboard-project-manager__c9")}>{status}</p> : null}
        </form>) : null}
      <div className={bem("components-dashboard-project-manager__c10")}>
        {items.map((item) => (<div key={item.id} className={bem("components-dashboard-project-manager__c11")} style={{ borderRadius: "16px 3px 16px 3px" }}>
            <h3 className={bem("components-dashboard-project-manager__c12")}>{item.title}</h3>
            <p className={bem("components-dashboard-project-manager__c13")}>{item.description}</p>
            {canEdit ? (<div className={bem("components-dashboard-project-manager__c14")}>
                <button type="button" onClick={() => editItem(item)} className={bem("components-dashboard-project-manager__c15")}>
                  Edit
                </button>
                <button type="button" onClick={() => deleteItem(item.id)} className={bem("components-dashboard-project-manager__c16")}>
                  Delete
                </button>
              </div>) : null}
          </div>))}
      </div>
    </div>);
}
