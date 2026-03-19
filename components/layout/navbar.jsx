import Link from "next/link";
import { auth } from "@/lib/auth";
import { Container } from "@/components/ui/container";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { bem } from "@/lib/bem";
const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/news", label: "News" },
    { href: "/contact", label: "Contact" },
];
export async function Navbar() {
    const session = await auth();
    return (<header className={bem("components-layout-navbar__c1")}>
      <Container className={bem("components-layout-navbar__c2")}>
        <Link href="/" className={bem("components-layout-navbar__c3")}>
          GPU Pulse
        </Link>
        <nav className={bem("components-layout-navbar__c4")}>
          {links.map((link) => (<Link key={link.href} href={link.href} className={bem("components-layout-navbar__c5")}>
              {link.label}
            </Link>))}
        </nav>
        <div className={bem("components-layout-navbar__c6")}>
          {session?.user ? (<>
              <Link href="/dashboard" className={bem("components-layout-navbar__c7")}>
                Dashboard
              </Link>
              <SignOutButton />
            </>) : (<Link href="/login" className={bem("components-layout-navbar__c8")}>
              Login
            </Link>)}
        </div>
        <MobileNav links={links} isLoggedIn={Boolean(session?.user)}/>
      </Container>
    </header>);
}
