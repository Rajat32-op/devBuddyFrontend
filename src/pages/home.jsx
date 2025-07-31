import { useRef, useEffect, useState, use } from "react";
import { User, X } from "lucide-react";

import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ScrollToTopButton from "../components/ScrollToTop";

import { useUser } from "../providers/getUser.jsx";
import { Prism } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";


const Home = () => {

  const languages = [
    "JavaScript", "Python", "C++", "Java", "C", "Go", "TypeScript", "Ruby", "PHP",
    "React", "swift", "Kotlin", "Rust", "Dart", "Scala", "Perl", "Haskell",
    "Lua", "Shell", "HTML", "CSS", "SQL", "R"
  ];

  const messageRef = useRef(null);

  const [enterCode, setEnterCode] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("JavaScript");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [images, setImages] = useState([]);
  const [posting, setPosting] = useState(false);

  const [codes, setCodes] = useState([]);
  const [codeLang, setCodeLang] = useState([]);

  const { user, loading, fetchUser } = useUser();

  const handleImageChange = (e) => {
    const file = Array.from(e.target.files);
    if (file.length + images.length > 7) {
      setError('You can only upload up to 7 images');
      setTimeout(() => { setError(null) }, 2000);
      return;
    }
    setImages([...images, ...file]);
  }



  const handleNewPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('caption', e.target.elements.caption.value);
    formData.append('codeSnippet', codes);
    formData.append('language', codeLang);
    images.forEach(file => {
      formData.append('images', file);
    });
    try {
      setPosting(true);
      const response = await fetch('http://localhost:3000/add-post', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      setPosting(false);
      if (response.status != 200) {
        setError('could not create post');
        setTimeout(() => { setError(null) }, 2000);
      }
      else {
        setMessage('Posted successfully');
        e.target.reset();
        setImages([]);
        setCodeLang([]);
        setCodes([]);
        setCodeSnippet("");
        setSelectedLanguage("JavaScript");
        e.target.elements.caption.value = "";
        fetchUser();
        if (messageRef.current) {
          clearTimeout(messageRef.current);
        }
        messageRef.current = setTimeout(() => { setMessage(null) }, 2000);
      }
    }
    catch (err) {
      setError('could not create post');
      setTimeout(() => { setError(null) }, 2000);
    }
  }

  return (
    <>
      <div className={enterCode ? "blur-sm pointer-events-none select-none min-h-screen" : "min-h-screen w-full overflow-x-hidden bg-background text-white"}>
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
        <div className="max-w-7xl z-0 mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 hidden lg:block">
              <Sidebar />
            </div>

            {/* Main Feed */}
            <form onSubmit={handleNewPost} className="col-span-1 lg:col-span-2 space-y-6" encType="multipart/form-data">
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
                  <div className="flex md:justify-between items-center">
                    <div className="flex space-x-2">
                      <input onChange={handleImageChange} disabled={posting} type='file' id="image" name="image" accept="image/png, image/jpeg" className="hidden" />
                      <label htmlFor="image" className="px-3 py-1 text-sm border border-zinc-500 rounded bg-zinc-800 cursor-pointer">📷 Image</label>
                      <input id="codeSnippet" disabled={posting} name="codeSnippet" className="hidden" />
                      <label onClick={() => { setEnterCode(true) }} disabled={enterCode} htmlFor="codeSnippet" className="px-3 py-1 text-sm border border-zinc-500 rounded bg-zinc-800 cursor-pointer">💻 Code</label>
                    </div>
                    <div className="flex space-x-4 sm:space-x-2">
                      <button onClick={() => { setImages([]); setCodes([]); setCodeLang([]); }} disabled={posting} type="reset" className="px-1 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded">Discard Post</button>
                      <button type="submit" disabled={posting} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">
                        Post
                      </button>
                    </div>
                  </div>
                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} className="w-full h-auto rounded" />
                          <button
                            type="button"
                            onClick={() => setImages(images.filter((_, i) => i !== index))}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {codes.length > 0 && (
                    <div className="mt-2">
                      {codes.map((code, index) => (
                        <div key={index}
                        title={code}
                        className="flex items-center my-1"
                        >

                          <div
                            className="cursor-pointer px-2 py-1 bg-zinc-800 rounded text-xs truncate max-w-full flex-1"
                            
                            onClick={() => {
                              setEnterCode(true);
                              setCodeSnippet(code);
                              setSelectedLanguage(codeLang[index]);
                              setCodeLang(codeLang.filter((_, i) => i !== index))
                              setCodes(codes.filter((_, i) => i !== index));
                            }}
                          >

                            <pre className="inline">{code.replace(/\s+/g, ' ').slice(0, 80)}{code.length > 80 ? '...' : ''}</pre>
                            </div>
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                setCodes(codes.filter((_, i) => i !== index));
                                setCodeLang(codeLang.filter((_, i) => i !== index));
                              }}
                              className="ml-2 h-5 w-5 text-red-500 hover:text-red-700 flex-shrink-0"
                            >
                            <X className="w-full h-full"></X>
                            </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Posts Feed */}
              <div className="space-y-6 overflow-x-auto">
                {/* {posts.map((post) => (
                <PostCard key={post.id} post={post} />
                ))} */}
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
      {enterCode && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4">
            <h2 className="text-xl font-semibold">Add Your Code Snippet</h2>

            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="Write your code here..."
              rows={6}
              className="w-full border rounded p-2 font-mono resize-none"
            />

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Language</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => { setEnterCode(false); setCodeSnippet(""); setSelectedLanguage("") }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Discard
              </button>
              <button
                onClick={() => {
                  setEnterCode(false); setCodes([...codes, codeSnippet]); setCodeLang([...codeLang, selectedLanguage]);
                  setCodeSnippet(""); setSelectedLanguage("");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;