import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
import { Container } from "@/components/ui/container";
import { bem } from "@/lib/bem";
export default async function LoginPage({ searchParams }) {
    const params = await searchParams;
    const callbackUrl = params.callbackUrl || "/dashboard";
    return (<Container className={bem("app-login-page__c1")}>
      <div className={bem("app-login-page__c2")}>
        <h1 className={bem("app-login-page__c3")}>Dashboard Login</h1>
        <p className={bem("app-login-page__c4")}>
          New here?{" "}
          <Link href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`} className={bem("app-login-page__c5")}>
            Create an account
          </Link>
        </p>
        <LoginForm callbackUrl={callbackUrl}/>
      </div>
    </Container>);
}
