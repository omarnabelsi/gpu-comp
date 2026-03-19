"use client";
import Link from "next/link";
import { useState } from "react";
import { bem } from "@/lib/bem";
export function MobileNav({ links, isLoggedIn }) {
    const [open, setOpen] = useState(false);
    return (<div className={bem("components-layout-mobile-nav__c1")}>
      <button type="button" onClick={() => setOpen(!open)} className={bem("components-layout-mobile-nav__c2")} style={{ borderRadius: "12px 2px 12px 2px" }}>
        <span className={bem("components-layout-mobile-nav__c3")}>Open menu</span>
        <div className={bem("components-layout-mobile-nav__c4")}>
          <span className={bem("components-layout-mobile-nav__c8", open ? "components-layout-mobile-nav__c9" : "components-layout-mobile-nav__c10")}/>
          <span className={bem("components-layout-mobile-nav__c8", open ? "components-layout-mobile-nav__c11" : "components-layout-mobile-nav__c10")}/>
          <span className={bem("components-layout-mobile-nav__c8", open ? "components-layout-mobile-nav__c12" : "components-layout-mobile-nav__c10")}/>
        </div>
      </button>
      <div className={bem("components-layout-mobile-nav__c13", open ? "components-layout-mobile-nav__c14" : "components-layout-mobile-nav__c15")}>
        <nav className={bem("components-layout-mobile-nav__c5")}>
          {links.map((link) => (<Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={bem("components-layout-mobile-nav__c6")}>
              {link.label}
            </Link>))}
          <Link href={isLoggedIn ? "/dashboard" : "/login"} onClick={() => setOpen(false)} className={bem("components-layout-mobile-nav__c7")}>
            {isLoggedIn ? "Dashboard" : "Login"}
          </Link>
        </nav>
      </div>
    </div>);
}
