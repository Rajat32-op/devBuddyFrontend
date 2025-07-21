import { useEffect, useState } from "react";
import { User } from "lucide-react";

import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

import PostCard from "../components/PostCard";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ScrollToTopButton from "../components/ScrollToTop";

const Home = () => {
  const [posts] = useState([
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        username: "sarahdev",
        avatar: "/placeholder.svg",
      },
      content: {
        type: "code",
        text: "Just finished implementing a React custom hook for API calls!",
        code: `const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading };
};`,
        language: "javascript"
      },
      likes: 24,
      comments: 8,
      timestamp: "2 hours ago",
      tags: ["React", "JavaScript", "Hooks"]
    },
    {
      id: 2,
      user: {
        name: "Alex Rodriguez",
        username: "alexcodes",
        avatar: "/placeholder.svg",
      },
      content: {
        type: "image",
        text: "My new coding setup is finally complete! 🚀",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&h=300&fit=crop"
      },
      likes: 56,
      comments: 12,
      timestamp: "4 hours ago",
      tags: ["Setup", "Workspace"]
    },
    {
      id: 3,
      user: {
        name: "Maya Patel",
        username: "mayapy",
        avatar: "/placeholder.svg",
      },
      content: {
        type: "code",
        text: "Clean Python function for data processing",
        code: `def process_data(data_list):
    """Process and clean data efficiently"""
    return [
        item.strip().lower()
        for item in data_list
        if item and len(item.strip()) > 0
    ]

# Usage example
clean_data = process_data(raw_input)`,
        language: "python"
      },
      likes: 18,
      comments: 5,
      timestamp: "6 hours ago",
      tags: ["Python", "DataProcessing"]
    }
  ]);
  const [error,setError]=useState(null);
  const [message,setMessage]=useState(null);
  const handleNewPost = async (e) => {
    e.preventDefault();
    const newpost={
      caption:e.target.elements.caption.value,
      image:e.target.elements.image.value||'',
      codeSnippet:e.target.elements.codeSnippet.value||''
    }
    try{
      const response=await fetch('http://localhost:3000/add-post',{
        method:'POST',
        credentials:'include',
        body:JSON.stringify(newpost),
        headers: { 'Content-Type': 'application/json' }
      });
      if(response.status!=200){
        setError('could not create post');
        setTimeout(()=>{setError(null)},3000);
      }
      else{
        setMessage('Posted successfully');
        e.target.elements.caption.value="";
        setTimeout(()=>{setMessage(null)},3000);
      }
    }
    catch(err){
      console.log(err);
      setError('could not create post');
        setTimeout(()=>{setError(null)},2000);
    }
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-background text-white">
      <Navbar />
      {error && (
  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-red-500 text-white px-4 py-2 rounded shadow-md transition-all duration-300">
    {error}
  </div>
)}
      {message && (
  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-green-500 text-white px-4 py-2 rounded shadow-md transition-all duration-300">
    {message}
  </div>
)}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <Sidebar />
          </div>

          {/* Main Feed */}
          <form onSubmit={handleNewPost} className="col-span-1 lg:col-span-2 space-y-6">
            {/* Create Post */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <textarea
                  name="caption"
                  required
                    placeholder="Share your code or thoughts with the community..."
                    className="flex-1 min-h-[60px] resize-none bg-transparent border border-zinc-500 rounded px-3 py-2 text-white"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <input type='file' id="image" name="image" className="hidden"/>
                    <label htmlFor="image" className="px-3 py-1 text-sm border border-zinc-500 rounded hover:bg-zinc-800">📷 Image</label>
                    <input type='file' id="codeSnippet" name="codeSnippet" className="hidden"/>
                    <label htmlFor="codeSnippet" className="px-3 py-1 text-sm border border-zinc-500 rounded hover:bg-zinc-800">💻 Code</label>
                  </div>
                  <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">
                    Post
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-6 overflow-x-auto">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </form>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="space-y-6">
              {/* Trending Tags */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Trending Tags</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Python", "JavaScript", "WebDev", "AI", "OpenSource"].map((tag) => (
                      <span key={tag} className="px-2 py-1 text-xs border border-zinc-600 rounded bg-zinc-800 text-white">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Suggested Friends */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold">Suggested Connections</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "John Doe", username: "johncodes", mutualFriends: 3 },
                      { name: "Lisa Wang", username: "lisadev", mutualFriends: 5 },
                      { name: "Mike Johnson", username: "mikejs", mutualFriends: 2 }
                    ].map((suggestion) => (
                      <div key={suggestion.username} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {suggestion.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{suggestion.name}</p>
                            <p className="text-xs text-zinc-400">
                              {suggestion.mutualFriends} mutual connections
                            </p>
                          </div>
                        </div>
                        <button className="text-sm border border-zinc-600 px-2 py-1 rounded hover:bg-zinc-800">
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};

export default Home;