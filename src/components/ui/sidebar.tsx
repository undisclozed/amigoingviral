import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, User, Image, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/posts", label: "Posts", icon: Image },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-primary rounded-lg p-2 text-white"
      >
        <Menu size={20} />
      </button>

      <aside 
        className={cn(
          "fixed left-0 top-0 bottom-0 w-16 bg-white border-r flex flex-col items-center py-8 transition-transform duration-300 z-40",
          isMobile && !isOpen && "-translate-x-full",
          isMobile && isOpen && "translate-x-0"
        )}
      >
        {children}
      </aside>
    </>
  );
};

interface SidebarContentProps {
  children: React.ReactNode;
}

const SidebarContent = ({ children }: SidebarContentProps) => (
  <div className="flex-1 w-full">{children}</div>
);

interface SidebarGroupProps {
  children: React.ReactNode;
}

const SidebarGroup = ({ children }: SidebarGroupProps) => (
  <div className="px-2 py-2">{children}</div>
);

interface SidebarGroupLabelProps {
  children: React.ReactNode;
}

const SidebarGroupLabel = ({ children }: SidebarGroupLabelProps) => (
  <h3 className="mb-2 px-2 text-xs font-semibold tracking-tight">{children}</h3>
);

interface SidebarGroupContentProps {
  children: React.ReactNode;
}

const SidebarGroupContent = ({ children }: SidebarGroupContentProps) => (
  <div className="space-y-1">{children}</div>
);

interface SidebarMenuProps {
  children: React.ReactNode;
}

const SidebarMenu = ({ children }: SidebarMenuProps) => (
  <nav>{children}</nav>
);

interface SidebarMenuItemProps {
  children: React.ReactNode;
}

const SidebarMenuItem = ({ children }: SidebarMenuItemProps) => (
  <div className="px-2">{children}</div>
);

interface SidebarMenuButtonProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const SidebarMenuButton = ({ children, asChild }: SidebarMenuButtonProps) => (
  <div className="w-full">{children}</div>
);

interface SidebarProviderProps {
  children: React.ReactNode;
}

const SidebarProvider = ({ children }: SidebarProviderProps) => (
  <div className="min-h-screen flex w-full">
    {children}
  </div>
);

export default Sidebar;
export { 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider 
};