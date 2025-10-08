import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Filter,
  Star,
  Play,
  Grid3X3,
  List,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export const TemplatesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = [
    "All", "Social Media", "Marketing", "Events", "Business", "Education", "Personal"
  ];

  const templates = [
    {
      id: 1,
      title: "Instagram Post - Fashion",
      category: "Social Media",
      size: "1080x1080",
      image: "bg-gradient-to-br from-pink-400 to-purple-600",
      rating: 4.8,
      uses: 1520,
      isPro: false
    },
    {
      id: 2,
      title: "Business Presentation Banner",
      category: "Business",
      size: "1200x400",
      image: "bg-gradient-to-br from-blue-400 to-cyan-600",
      rating: 4.9,
      uses: 2340,
      isPro: true
    },
    {
      id: 3,
      title: "Event Poster - Concert",
      category: "Events",
      size: "600x800",
      image: "bg-gradient-to-br from-orange-400 to-red-600",
      rating: 4.7,
      uses: 890,
      isPro: false
    },
    {
      id: 4,
      title: "Instagram Story - Travel",
      category: "Social Media",
      size: "1080x1920",
      image: "bg-gradient-to-br from-green-400 to-blue-600",
      rating: 4.8,
      uses: 3210,
      isPro: false
    },
    {
      id: 5,
      title: "LinkedIn Banner - Professional",
      category: "Business",
      size: "1584x396",
      image: "bg-gradient-to-br from-indigo-400 to-purple-600",
      rating: 4.9,
      uses: 1840,
      isPro: true
    },
    {
      id: 6,
      title: "YouTube Thumbnail - Gaming",
      category: "Social Media",
      size: "1280x720",
      image: "bg-gradient-to-br from-red-400 to-pink-600",
      rating: 4.6,
      uses: 2780,
      isPro: false
    },
    {
      id: 7,
      title: "Product Launch Flyer",
      category: "Marketing",
      size: "600x800",
      image: "bg-gradient-to-br from-yellow-400 to-orange-600",
      rating: 4.8,
      uses: 1560,
      isPro: true
    },
    {
      id: 8,
      title: "Workshop Banner",
      category: "Education",
      size: "1200x400",
      image: "bg-gradient-to-br from-teal-400 to-green-600",
      rating: 4.7,
      uses: 920,
      isPro: false
    }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Templates</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/editor">
              <Button variant="hero">Create Custom</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Design Templates</h1>
          <p className="text-muted-foreground">
            Choose from our collection of professionally designed templates
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className={`group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              <CardContent className={`p-0 ${viewMode === "list" ? "flex flex-1" : ""}`}>
                <div className={`${template.image} relative overflow-hidden ${
                  viewMode === "list" ? "w-48 h-32" : "h-48"
                } rounded-t-lg ${viewMode === "list" ? "rounded-l-lg rounded-tr-none" : ""}`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  
                  {/* Overlay buttons */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary">
                        <Play className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Link to={`/editor?template=${template.id}`}>
                        <Button size="sm" variant="hero">
                          Use Template
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Top badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                    {template.isPro && (
                      <Badge variant="default" className="text-xs bg-gradient-primary">
                        PRO
                      </Badge>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm">
                    <Star className="h-3 w-3 fill-current text-yellow-400" />
                    <span>{template.rating}</span>
                  </div>
                </div>
                
                <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {template.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{template.size}</span>
                    <span>{template.uses.toLocaleString()} uses</span>
                  </div>
                  
                  {viewMode === "list" && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline">
                        Preview
                      </Button>
                      <Link to={`/editor?template=${template.id}`}>
                        <Button size="sm" variant="hero">
                          Use Template
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No templates found matching your criteria.</p>
            <Button variant="outline" className="mt-4" onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};