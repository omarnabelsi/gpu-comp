"use client";
import { useState } from "react";
import { RichTextEditor } from "@/components/forms/rich-text-editor";
import { bem } from "@/lib/bem";
export function NewsManager({ initialItems, canEdit }) {
    const [items, setItems] = useState(initialItems);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState("");
    const [status, setStatus] = useState("");
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
        setTitle("");
        setContent("");
        setEditingId("");
        setStatus("News item saved.");
    }
    async function deleteItem(id) {
        const response = await fetch(`/api/news/${id}`, { method: "DELETE" });
        if (!response.ok) {
            setStatus("Could not delete news item.");
            return;
        }
        setItems(items.filter((item) => item.id !== id));
    }
    function editItem(item) {
        setEditingId(item.id);
        setTitle(item.title);
        setContent(item.content);
    }
    return (<div className={bem("components-dashboard-news-manager__c1")}>
      {canEdit ? (<form onSubmit={saveItem} className={bem("components-dashboard-news-manager__c2")} style={{ borderRadius: "18px 3px 18px 3px" }}>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Title" className={bem("components-dashboard-news-manager__c3")}/>
          <RichTextEditor value={content} onChange={setContent}/>
          <button className={bem("components-dashboard-news-manager__c4")}>{editingId ? "Update News" : "Create News"}</button>
          {status ? <p className={bem("components-dashboard-news-manager__c5")}>{status}</p> : null}
        </form>) : null}
      <div className={bem("components-dashboard-news-manager__c6")}>
        {items.map((item) => (<div key={item.id} className={bem("components-dashboard-news-manager__c7")} style={{ borderRadius: "16px 3px 16px 3px" }}>
            <h3 className={bem("components-dashboard-news-manager__c8")}>{item.title}</h3>
            <div className={bem("components-dashboard-news-manager__c9")} dangerouslySetInnerHTML={{ __html: item.content.slice(0, 220) }}/>
            {canEdit ? (<div className={bem("components-dashboard-news-manager__c10")}>
                <button type="button" onClick={() => editItem(item)} className={bem("components-dashboard-news-manager__c11")}>
                  Edit
                </button>
                <button type="button" onClick={() => deleteItem(item.id)} className={bem("components-dashboard-news-manager__c12")}>
                  Delete
                </button>
              </div>) : null}
          </div>))}
      </div>
    </div>);
}
