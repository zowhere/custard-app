import type { Metadata } from "next";
import { AppSidebar } from "@/components/appSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Custard - Loyalty Programs for Small Businesses | Increase Customer Retention by 40%",
  description: "Transform one-time customers into loyal brand advocates with Custard. Enterprise-level loyalty programs designed for small businesses. Increase repeat purchases by 40%, boost customer lifetime value, and reduce acquisition costs. Join 500+ businesses on our waitlist.",
  openGraph: {
    title: "Custard - Loyalty Programs for Small Businesses | Increase Customer Retention by 40%",
    description: "Transform one-time customers into loyal brand advocates with Custard. Enterprise-level loyalty programs designed for small businesses.",
    images: ["/og-home.jpg"],
  },
  alternates: {
    canonical: "https://custard-app.vercel.app/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset"/>
      <SidebarInset>
      {children}
      </SidebarInset>
      
    </SidebarProvider>
  );
}
