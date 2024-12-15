import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/auth/LoginForm";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Play } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showDemoDialog, setShowDemoDialog] = useState(false);
  const [creatorSearch, setCreatorSearch] = useState("");

  const handleCreatorSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would search for creators
    console.log("Searching for:", creatorSearch);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg"></div>
              <span className="font-bold text-xl">ViewStats</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setShowLoginDialog(true)}>Log in</Button>
              <Button onClick={() => setShowLoginDialog(true)}>Sign up free</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <LoginForm onSuccess={() => {
            setShowLoginDialog(false);
            navigate("/dashboard");
          }} />
        </DialogContent>
      </Dialog>

      {/* Demo Dialog */}
      <Dialog open={showDemoDialog} onOpenChange={setShowDemoDialog}>
        <DialogContent className="sm:max-w-4xl">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Platform Highlights</h2>
            <div className="aspect-video bg-gray-100 rounded-lg">
              {/* Demo video or screenshots would go here */}
              <div className="h-full flex items-center justify-center text-gray-500">
                Demo Content
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section with Creator Search */}
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 py-20">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Track Your Social Media Growth
              <span className="block text-primary mt-2">Like Never Before</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Get detailed analytics and insights for your Instagram account. Track engagement, growth, and understand what content performs best.
            </p>
            
            {/* Creator Search Bar */}
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleCreatorSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search for popular Instagram creators..."
                    value={creatorSearch}
                    onChange={(e) => setCreatorSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
            </div>

            <div className="flex justify-center gap-4">
              <Button size="lg" onClick={() => setShowLoginDialog(true)}>
                Start tracking for free
              </Button>
              <Button size="lg" variant="outline" onClick={() => setShowDemoDialog(true)}>
                <Play className="mr-2 h-4 w-4" />
                View demo
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 py-20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Growth Analytics</h3>
              <p className="text-gray-600">Track your follower growth and engagement rates over time</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Content Performance</h3>
              <p className="text-gray-600">Understand which posts perform best and why</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Competitor Analysis</h3>
              <p className="text-gray-600">Compare your performance with competitors</p>
            </div>
          </div>

          {/* Footer */}
        <footer className="border-t mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Features</li>
                  <li>Pricing</li>
                  <li>API</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>About</li>
                  <li>Blog</li>
                  <li>Careers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Documentation</li>
                  <li>Support</li>
                  <li>Terms</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Connect</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Twitter</li>
                  <li>LinkedIn</li>
                  <li>Instagram</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
              © 2024 ViewStats. All rights reserved.
            </div>
          </div>
        </footer>
        </div>
      </main>
    </div>
  );
};

export default Index;
