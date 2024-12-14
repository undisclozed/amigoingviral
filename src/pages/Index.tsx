import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Index = () => {
  return (
    <div className="min-h-screen bg-white px-6">
      {/* Header */}
      <header className="flex justify-between items-center py-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg"></div>
          <span className="font-semibold text-xl">Stats</span>
        </div>
        <Button variant="outline" className="font-medium">
          Login
        </Button>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto mt-20">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2">
          Know How Your Post is Doing —{" "}
          <span className="bg-primary-light px-2">Fast</span>
        </h1>

        {/* Search Input */}
        <div className="relative mt-12">
          <Input
            type="text"
            placeholder="@yourusername"
            className="w-full pl-4 pr-12 py-6 text-lg border-2 rounded-lg"
          />
          <Button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
            size="icon"
            variant="ghost"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        <Button className="w-full bg-[#001F0E] hover:bg-[#001F0E]/90 text-white mt-6 py-6 text-lg">
          See your analytics
        </Button>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 p-6 bg-[#FDF8FF]">
          <div className="max-w-xl mx-auto">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <a href="#" className="opacity-60 hover:opacity-100">
                  Terms
                </a>
                <a href="#" className="opacity-60 hover:opacity-100">
                  Privacy
                </a>
              </div>
              <span className="text-sm text-gray-500">©stats 2024</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;