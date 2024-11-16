import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-1 pt-16"> {/* Add pt-16 to account for fixed header */}
          <AppSidebar />
        <Header />

          <main className="flex-1">
            <SidebarTrigger />
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}