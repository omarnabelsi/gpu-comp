"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { bem } from "@/lib/bem";
export function LoginForm({ callbackUrl }) {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError("");
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            callbackUrl,
        });
        setLoading(false);
        if (result?.error) {
            setError("Invalid email or password");
            return;
        }
        router.push(callbackUrl);
        router.refresh();
    }
    return (<form onSubmit={handleSubmit} className={bem("components-forms-login-form__c1")} style={{ borderRadius: "20px 4px 20px 4px" }}>
      <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email" className={bem("components-forms-login-form__c2")}/>
      <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" className={bem("components-forms-login-form__c3")}/>
      {error ? <p className={bem("components-forms-login-form__c4")}>{error}</p> : null}
      <button type="submit" disabled={loading} className={bem("components-forms-login-form__c5")}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>);
}
