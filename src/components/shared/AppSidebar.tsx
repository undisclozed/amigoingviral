import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, User, BarChart2, Settings, Menu, BarChart, TestTube2 } from "lucide-react";
import { useState, useEffect } from "react";

const items = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Post Analytics",
    path: "/posts",
    icon: BarChart,
  },
  {
    title: "Test",
    path: "/test",
    icon: TestTube2,
  },
  {
    title: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

interface AppSidebarProps {
  onCollapse?: (collapsed: boolean) => void;
}

export function AppSidebar({ onCollapse }: AppSidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    onCollapse?.(isCollapsed);
  }, [isCollapsed, onCollapse]);

  return (
    <>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-4 z-50 bg-primary rounded-lg p-2 text-white hover:bg-primary/90 transition-colors"
      >
        <Menu size={20} />
      </button>

      <aside 
        className={`fixed left-0 top-0 bottom-0 bg-white border-r flex flex-col py-8 transition-all duration-300 z-40 
          ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        <div className="flex-1 w-full overflow-y-auto pt-14">
          <div className="px-4 py-2">
            <nav className="space-y-1">
              {items.map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? "text-primary bg-primary/10"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">{item.title}</span>}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}