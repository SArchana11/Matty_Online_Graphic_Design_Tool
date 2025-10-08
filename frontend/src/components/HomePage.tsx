
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Layout, 
  Image, 
  Download, 
  Users, 
  Zap,
  ArrowRight,
  Play,
  CheckCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import toast from "react-hot-toast";

export const HomePage = () => {
  const { authUser, setAuthUser } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("chat-user");
    setAuthUser(null);
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const features = [
    {
      icon: Layout,
      title: "Drag & Drop Editor",
      description: "Intuitive canvas editor with powerful design tools"
    },
    {
      icon: Palette,
      title: "Rich Design Tools",
      description: "Text styling, shapes, colors, and professional layouts"
    },
    {
      icon: Image,
      title: "Image Support",
      description: "Upload and edit images with filters and effects"
    },
    {
      icon: Download,
      title: "Export Options",
      description: "Download your designs as PNG, PDF, or SVG"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share and collaborate on designs with your team"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Smooth performance with real-time preview"
    }
  ];

  const templates = [
    {
      title: "Social Media Post",
      category: "Social",
      size: "1080x1080",
      image: "bg-gradient-to-br from-pink-400 to-purple-600"
    },
    {
      title: "Business Banner",
      category: "Marketing",
      size: "1200x400",
      image: "bg-gradient-to-br from-blue-400 to-cyan-600"
    },
    {
      title: "Event Poster",
      category: "Events",
      size: "600x800",
      image: "bg-gradient-to-br from-orange-400 to-red-600"
    },
    {
      title: "Instagram Story",
      category: "Social",
      size: "1080x1920",
      image: "bg-gradient-to-br from-green-400 to-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo clickable → Home */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Palette className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MATTY
            </span>
          </Link>
          
          {/* Nav Buttons */}
          <div className="flex items-center space-x-4">
            {authUser ? (
              <>
                <Link to="/editor">
                  <Button variant="ghost">Editor</Button>
                </Link>
                <Link to="/templates">
                  <Button variant="ghost">Templates</Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/templates">
                  <Button variant="ghost">Templates</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline">Register</Button>
                </Link>
                <Link to="/login">
                  <Button variant="hero">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            ✨ New: AI-Powered Design Suggestions
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Create Stunning{" "}
            <span className="bg-gradient-hero bg-clip-text text-transparent animate-gradient">
              Visual Designs
            </span>
            <br />
            In Minutes
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Professional design platform for creating posters, banners, and social media visuals. 
            No design experience required.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to={authUser ? "/editor" : "/login"}>
              <Button variant="gradient" size="lg" className="px-8">
                <Play className="h-5 w-5 mr-2" />
                Start Creating
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-muted-foreground">Designs Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">15K+</div>
              <div className="text-muted-foreground">Happy Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100+</div>
              <div className="text-muted-foreground">Templates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Create
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools and features designed to make design accessible to everyone
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="glass hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start with Beautiful Templates
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from hundreds of professionally designed templates
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {templates.map((template, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-0">
                  <div className={`h-48 ${template.image} rounded-t-lg relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge variant="secondary" className="mb-2">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{template.title}</h3>
                    <p className="text-sm text-muted-foreground">{template.size}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/templates">
              <Button variant="outline" size="lg">
                View All Templates
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Creating?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who trust DesignStudio for their visual content needs
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="secondary" size="lg" className="px-8">
              Start Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button variant="glass" size="lg" className="px-8">
              Schedule Demo
            </Button>
          </div>
          
          <div className="flex items-center justify-center mt-8 text-white/80">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>No credit card required</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Palette className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  MATTY
                </span>
              </div>
              <p className="text-muted-foreground">
                Create stunning visual designs with our intuitive platform.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground">Features</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">Templates</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">Pricing</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground">About</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">Blog</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">Contact</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground">Help Center</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">Community</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground">Status</a>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 DesignStudio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
