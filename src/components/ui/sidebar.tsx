import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, User, Image, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/posts", label: "Posts", icon: Image },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-16 bg-white border-r flex flex-col items-center py-8">
      <div className="w-8 h-8 bg-primary rounded-lg mb-8"></div>
      <nav className="flex-1">
        <ul className="space-y-4">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors",
                    location.pathname === link.href && "bg-primary/10 text-primary"
                  )}
                >
                  <Icon size={20} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;