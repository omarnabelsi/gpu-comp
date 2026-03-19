"use client";
import { useState } from "react";
import { bem } from "@/lib/bem";
export function ProjectInterestForm({ projectId, projectTitle }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    async function onSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setStatus("");
        const response = await fetch("/api/project-interests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, projectId }),
        });
        setLoading(false);
        if (!response.ok) {
            setStatus("Could not submit request.");
            return;
        }
        setName("");
        setEmail("");
        setStatus(`Interest sent for ${projectTitle}.`);
    }
    return (<form onSubmit={onSubmit} className={bem("components-forms-project-interest-form__c1")} style={{ borderRadius: "20px 4px 20px 4px" }}>
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" className={bem("components-forms-project-interest-form__c2")}/>
      <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Your email" className={bem("components-forms-project-interest-form__c3")}/>
      {status ? <p className={bem("components-forms-project-interest-form__c4")}>{status}</p> : null}
      <button type="submit" disabled={loading} className={bem("components-forms-project-interest-form__c5")}>
        {loading ? "Sending..." : "Request Project Demo"}
      </button>
    </form>);
}
