import React, { useState, useEffect } from 'react'
import { ArrowLeft, Sparkles, Copy, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import axios from 'axios'
import { serverUrl } from '../App'

const PHASES = [
  "Analyzing your idea...",
  "Designing the layout & structure...",
  "Writing HTML & CSS...",
  "Adding animations & interactions...",
  "Final quality check...",
];

const EXAMPLE_PROMPTS = [
  {
    title: "Portfolio Website",
    icon: "💼",
    prompt: "A modern portfolio website for a freelance graphic designer with a hero section, about me, projects gallery with hover effects, skills section, and contact form. Use a dark theme with purple accents."
  },
  {
    title: "Restaurant Website",
    icon: "🍽️",
    prompt: "An elegant restaurant website for 'Bella Italia' Italian restaurant. Include hero section with parallax effect, menu section with categories, about us, reservation form, gallery, and contact info. Use warm colors and elegant typography."
  },
  {
    title: "SaaS Landing Page",
    icon: "🚀",
    prompt: "A modern SaaS landing page for a project management tool called 'TaskFlow'. Include hero section with CTA, features grid with icons, pricing tables, testimonials carousel, FAQ section, and footer. Use blue gradient theme."
  },
  {
    title: "E-commerce Store",
    icon: "🛍️",
    prompt: "A modern e-commerce website for a sustainable fashion brand. Include hero banner, product grid with hover effects, categories, featured products, newsletter signup, and footer. Use earthy tones and clean design."
  },
  {
    title: "Agency Website",
    icon: "🎨",
    prompt: "A creative digital agency website with bold typography. Include hero section with animated text, services section, portfolio showcase with filter, team section, client logos, and contact form. Use dark theme with vibrant accents."
  },
  {
    title: "Fitness Website",
    icon: "💪",
    prompt: "A modern fitness studio website for 'Iron Peak Gym'. Include hero section with call-to-action, class schedule, trainer profiles, membership plans, transformation gallery, and contact section. Use energetic orange and black theme."
  }
];

function Generate() {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [error, setError] = useState("")
  const [copiedIndex, setCopiedIndex] = useState(null)

  const handleGenerateWebsite = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true)
    setError("")
    try {
      const result = await axios.post(
        `${serverUrl}/api/website/generate`,
        { prompt: prompt.trim() },
        { withCredentials: true }
      )
      console.log(result)
      setProgress(100)
      setLoading(false)
      navigate(`/editor/${result.data.websiteId}`)
    } catch (error) {
      setLoading(false)
      setError(error.response?.data?.message || "Something went wrong. Please try again.")
      console.log(error)
    }
  }

  const handleExampleClick = (examplePrompt) => {
    setPrompt(examplePrompt)
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  useEffect(() => {
    if (!loading) {
      setPhaseIndex(0)
      setProgress(0)
      return
    }

    let value = 0
    let phase = 0

    const interval = setInterval(() => {
      const increment =
        value < 20 ? Math.random() * 1.5 :
        value < 60 ? Math.random() * 1.2 :
        Math.random() * 0.6

      value += increment
      if (value >= 93) value = 93

      phase = Math.min(
        Math.floor((value / 100) * PHASES.length),
        PHASES.length - 1
      )

      setProgress(Math.floor(value))
      setPhaseIndex(phase)
    }, 1200)

    return () => clearInterval(interval)
  }, [loading])

  return (
    <div className='min-h-screen bg-linear-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white'>
      {/* Header */}
      <div className='sticky top-0 z-40 bg-black/50 backdrop-blur-xl border-b border-white/10'>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className='text-lg font-semibold'>
              Sajilo<span className='text-zinc-400'>Site</span>
            </h1>
          </div>
          {!loading && (
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-sm text-zinc-400 hover:text-white transition"
            >
              Dashboard
            </button>
          )}
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-6 py-16'>
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 mb-6">
            <Sparkles size={16} className="text-yellow-400" />
            <span>AI-Powered Website Generation</span>
          </div>
          <h1 className='text-4xl md:text-6xl font-bold mb-5 leading-tight'>
            Create Your Dream Website
            <span className='block bg-linear-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent mt-2'>
              In Minutes, Not Days
            </span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Describe your ideal website and watch AI bring it to life with modern design, 
            smooth animations, and production-ready code.
          </p>
        </motion.div>

        {/* Main Input Section */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-zinc-300">
                Describe your website
              </label>
              <span className="text-xs text-zinc-500">
                Be as detailed as possible for best results
              </span>
            </div>
            <div className="relative group">
              <textarea
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
                placeholder="Example: A modern portfolio website for a photographer with a dark theme, image gallery with lightbox, about section, and contact form..."
                className='w-full h-48 p-6 rounded-2xl bg-black/60 border-2 border-white/10 
                         outline-none resize-none text-sm leading-relaxed 
                         focus:ring-0 focus:border-white/30 transition-all
                         placeholder:text-zinc-600'
              />
              <div className="absolute bottom-4 right-4 text-xs text-zinc-500">
                {prompt.length > 0 && `${prompt.length} characters`}
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='text-red-400 text-sm mt-3 flex items-center gap-2'
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                {error}
              </motion.p>
            )}

            <div className="mt-6 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerateWebsite}
                disabled={!prompt.trim() || loading}
                className={`px-12 py-4 rounded-2xl font-semibold text-base flex items-center gap-2 ${
                  prompt.trim() && !loading
                    ? "bg-white text-black hover:shadow-lg hover:shadow-white/20"
                    : "bg-white/10 text-zinc-500 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Website
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Example Prompts */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Need Inspiration?</h3>
              <p className="text-sm text-zinc-400">Click on any example to use it as your prompt</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {EXAMPLE_PROMPTS.map((example, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => handleExampleClick(example.prompt)}
                  className="group relative p-5 rounded-2xl bg-white/5 border border-white/10 
                           hover:border-white/20 hover:bg-white/8 cursor-pointer
                           transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{example.icon}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(example.prompt, index)
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition opacity-0 group-hover:opacity-100"
                    >
                      {copiedIndex === index ? (
                        <Check size={14} className="text-green-400" />
                      ) : (
                        <Copy size={14} className="text-zinc-400" />
                      )}
                    </button>
                  </div>
                  <h4 className="font-semibold text-sm mb-2">{example.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {example.prompt}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading Progress */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mt-16"
          >
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="flex justify-between mb-3 text-sm">
                <span className="text-zinc-300 font-medium">{PHASES[phaseIndex]}</span>
                <span className="text-white font-semibold">{progress}%</span>
              </div>

              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-linear-to-r from-violet-500 to-blue-500"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.8 }}
                />
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-400">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span>This usually takes </span>
                <span className="text-white font-semibold">2-4 minutes</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Generate