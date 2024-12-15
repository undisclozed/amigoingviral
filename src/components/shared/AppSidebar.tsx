import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, User, BarChart2, Settings } from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import SidebarContent from "@/components/ui/sidebar";
import SidebarGroup from "@/components/ui/sidebar";
import SidebarGroupContent from "@/components/ui/sidebar";
import SidebarGroupLabel from "@/components/ui/sidebar";
import SidebarMenu from "@/components/ui/sidebar";
import SidebarMenuItem from "@/components/ui/sidebar";
import SidebarMenuButton from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    title: "Analytics",
    path: "/analytics",
    icon: BarChart2,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-2 ${
                        location.pathname === item.path
                          ? "text-primary"
                          : "text-gray-600"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}