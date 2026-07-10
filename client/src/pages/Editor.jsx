import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { serverUrl } from "../config";
import {
  Code,
  Code2,
  MessageCircle,
  MessageSquare,
  Monitor,
  Send,
  X,
  Trash2,
  Rocket,
  Check,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Editor from "@monaco-editor/react";
import { sanitizeSrcDoc } from "../utils/srcdoc";


function WebsiteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [website, setWebsite] = useState(null);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const iframeRef = useRef(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const thinkingSteps = [
    "Understanding your request...",
    "Planning layout changes...",
    "Improving responsiveness...",
    "Applying final touches...",
    "Finalizing update...",
  ];

  const formatCode = (value) =>
    value
      ? value.replace(/>\s*</g, ">\n<").replace(/\s{2,}/g, " ").trim()
      : "";

  const handleUpdate = async () => {
    if (!prompt) return;
    setUpdateLoading(true);
    const text = prompt;
    setPrompt("");
    setMessages((m) => [...m, { role: "user", content: prompt }]);
    try {
      const result = await axios.post(
        `${serverUrl}/api/website/update/${id}`,
        { prompt: text },
        { withCredentials: true },
      );
      console.log(result);
      setUpdateLoading(false);
      setMessages((m) => [...m, { role: "ai", content: result.data.message }]);
      setCode(formatCode(result.data.code));
    } catch (error) {
      setUpdateLoading(false);
      console.log(error);
    }
  };

const handleDeploy = async () => {
  try {
    const result = await axios.get(`${serverUrl}/api/website/deploy/${website._id}`, { withCredentials: true })
    window.open(result.data.url, "_blank");
    setWebsite(prev => ({ ...prev, deployed: true, deployedUrl: result.data.url }))

  } catch (error) {
    console.log(error)
  }
}

  const handleCopy = async () => {
    if (website?.deployedUrl) {
      await navigator.clipboard.writeText(website.deployedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${serverUrl}/api/website/${id}`, { withCredentials: true });
      navigate('/dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!updateLoading) return;
    const i = setInterval(() => {
      setThinkingIndex((i) => (i + 1) % thinkingSteps.length);
    }, 1200);

    return () => clearInterval(i);
  }, [updateLoading]);

  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/website/get-by-id/${id}`,
          { withCredentials: true },
        );
        console.log(result);
        setWebsite(result.data);

        setCode(formatCode(result.data.latestCode));
        setMessages(result.data.conversation);
      } catch (error) {
        console.log(error);
        setError(error?.response?.data?.message || "Failed to load website");
      }
    };
    handleGetWebsite();
  }, [id]);

  useEffect(() => {
    if (!iframeRef.current || !code) return;
    const previewCode = sanitizeSrcDoc(code)
    const blob = new Blob([previewCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [code]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-400">
        {error}
      </div>
    );
  }

  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-black text-white overflow-hidden">
      {/* Sidebar - Chat */}
      <aside className="hidden lg:flex w-95 flex-col border-r border-white/10 bg-black/80">
        <Header />

        {/* chat */}
        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages?.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] ${
                  m.role === "user" ? "ml-auto" : "mr-auto"
                }`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed 
                        ${
                          m.role === "user"
                            ? "bg-white text-black"
                            : "bg-white/5 border border-white/10 text-zinc-200"
                        }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {updateLoading && (
              <div className="max-w-[85%] mr-auto">
                <div className="px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic">
                  {thinkingSteps[thinkingIndex]}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/10">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              <input
                placeholder="Describe Changes..."
                className="flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none"
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
              />
              <button
                className="px-4 py-3 rounded-2xl bg-white text-black"
                disabled={updateLoading}
                type="submit"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </>
      </aside>

      {/* Main Content - Preview */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80">
          <span className="text-xs text-zinc-400">Live Preview </span>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg 
              bg-white/10 border border-white/20 text-sm font-semibold 
              hover:bg-white/20 transition"
            >
              Dashboard
            </button>
            {website.deployed ? (
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg 
                         bg-emerald-500/20 border border-emerald-500/30 text-sm font-semibold 
                         text-emerald-400 hover:bg-emerald-500/30 transition"
              >
                {copied ? <Check size={16} /> : <Check size={16} />}
                {copied ? "Copied!" : "Link Copied"}
              </button>
            ) : (
              <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg 
              bg-linear-to-r from-indigo-500 to-purple-500 text-sm font-semibold 
              hover:scale-105 transition"
              onClick={handleDeploy}>
                <Rocket size={16} />
                Deploy
              </button>
            )}

            <button className="p-2 lg:hidden" onClick={() => setShowChat(true)}>
              <MessageSquare size={18} />
            </button>
            <button className="p-2" onClick={() => setShowCode(true)}>
              <Code2 size={18} />
            </button>
            <button className="p-2" onClick={() => setShowFullPreview(true)}>
              <Monitor size={18} />
            </button>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="p-2 hover:bg-red-500/20 rounded-lg transition"
            >
              <Trash2 size={18} className="text-red-400" />
            </button>
          </div>
        </div>

        <iframe ref={iframeRef} title="Editor preview" sandbox='allow-scripts allow-same-origin allow-forms'
         className="flex-1 w-full bg-white"/>
      </div>

      {/* Mobile Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed inset-0 z-9999 bg-black flex flex-col"
          >
            <Header onclose={()=>setShowChat(false)}/>
            {/* chat */}
            <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages?.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] ${
                  m.role === "user" ? "ml-auto" : "mr-auto"
                }`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed 
                        ${
                          m.role === "user"
                            ? "bg-white text-black"
                            : "bg-white/5 border border-white/10 text-zinc-200"
                        }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {updateLoading && (
              <div className="max-w-[85%] mr-auto">
                <div className="px-4 py-2.5 rounded-2xl text-xs bg-white/5 border border-white/10 text-zinc-400 italic">
                  {thinkingSteps[thinkingIndex]}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/10">
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
            >
              <input
                placeholder="Describe Changes..."
                className="flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none"
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
              />
              <button
                className="px-4 py-3 rounded-2xl bg-white text-black"
                disabled={updateLoading}
                type="submit"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        </>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Editor Panel */}
      <AnimatePresence>
        {showCode && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            className="fixed inset-y-0 right-0 z-[9999] w-full lg:w-[45%] bg-[#1e1e1e] flex flex-col"
          >
            <div className="h-12 px-4 flex justify-between items-center border-b border-white/10 bg-[#1e1e1e]">
              <span className="text-sm font-medium">index.html</span>
              <button onClick={() => setShowCode(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <Editor
                height="100%"
                width="100%"
                theme="vs-dark"
                value={code}
                language="html"
                onChange={(v) => setCode(v || "")}
                options={{
                  automaticLayout: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  lineNumbers: "on",
                  fontSize: 14,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Preview Modal */}
      <AnimatePresence>
        {showFullPreview && (
          <motion.div className="fixed inset-0 z-9999 bg-black">
            <iframe title="Full preview" className="w-full h-full bg-white" srcDoc={sanitizeSrcDoc(code)}
            sandbox='allow-scripts allow-same-origin allow-forms' />
            <button
              onClick={() => setShowFullPreview(false)}
              className="absolute top-4 right-10 p-2 bg-black/70 rounded-lg"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-2">Delete Website?</h3>
              <p className="text-sm text-zinc-400 mb-6">
                This action cannot be undone. The website will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  function Header({ onclose }) {
    return (
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
        <span className="font-semibold truncate">{website.title}</span>
        {onclose && <button onClick={onclose}><X size={18} color="white"/></button>}
      </div>
    );
  }
}

export default WebsiteEditor;