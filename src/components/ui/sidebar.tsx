import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

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
          "fixed left-0 top-0 bottom-0 w-64 bg-white border-r flex flex-col py-8 transition-transform duration-300 z-40",
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
  <div className="flex-1 w-full overflow-y-auto">{children}</div>
);

interface SidebarGroupProps {
  children: React.ReactNode;
}

const SidebarGroup = ({ children }: SidebarGroupProps) => (
  <div className="px-4 py-2">{children}</div>
);

interface SidebarGroupLabelProps {
  children: React.ReactNode;
}

const SidebarGroupLabel = ({ children }: SidebarGroupLabelProps) => (
  <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wider">{children}</h3>
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
  <nav className="space-y-1">{children}</nav>
);

interface SidebarMenuItemProps {
  children: React.ReactNode;
}

const SidebarMenuItem = ({ children }: SidebarMenuItemProps) => (
  <div>{children}</div>
);

interface SidebarMenuButtonProps {
  children: React.ReactNode;
  asChild?: boolean;
}

const SidebarMenuButton = ({ children }: SidebarMenuButtonProps) => (
  <div className="w-full rounded-md hover:bg-gray-100 transition-colors">
    {children}
  </div>
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