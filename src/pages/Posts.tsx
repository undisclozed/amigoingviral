import { AppSidebar } from "@/components/shared/AppSidebar";
import { useState } from "react";

const Posts = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex w-full">
        <AppSidebar onCollapse={setIsCollapsed} />
        <div className={`flex-1 ${isCollapsed ? 'pl-24' : 'pl-72'} p-6 transition-all duration-300`}>
          <div className="max-w-7xl mx-auto space-y-6">
            <header className="border-b bg-white mb-8">
              <div className="mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xl">Posts</span>
                  </div>
                </div>
              </div>
            </header>
            {/* Post analytics content will go here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;