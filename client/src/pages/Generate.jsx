import React, { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import axios from 'axios'
import { serverUrl } from '../App'

const PHASES = [
  "Analyzing your idea...",
  "Designing the layout & structure...",
  "Writing HTML & CSS...",
  "Adding animation & interactions...",
  "Final quality check...",
];

function Generate() {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [error, setError] = useState("")

  const handleGenerateWebsite = async () => {
    setLoading(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/website/generate`,
        { prompt },
        { withCredentials: true }
      )
      console.log(result)
      setProgress(100)
      setLoading(false)
      navigate(`/editor/${result.data.websiteId}`)
    } catch (error) {
      setLoading(false)
      setError(error.response?.data?.message || "Something went wrong")
      console.log(error)
    }
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
      <div className='sticky top-0 z-40 bg-black/50 backdrop-blur-xl p-4 text-2xl font-bold border-b border-white/10'>
        <div className="max-w-7xl mx-auto px-6 h-16 flex item-center justify-between">
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
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-6 py-16'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className='text-4xl md:text-5xl font-bold mb-5 leading-tight'>
            Build Website with
            <span className='block bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent'>
              Real AI Power
            </span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto ">
            This process may take several minutes.
          </p>
        </motion.div>

        <div className="mb-14">
          <h1 className='text-xl font-semibold mb-2'>Describe your website</h1>
          <div className="relative">
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              placeholder="Describe your website in detail..."
              className='w-full h-56 p-6 rounded-3xl bg-black/60 border-white/10 outline-none resize-none text-sm leading-relaxed focus:ring-3 focus:ring-white/20'
            />
          </div>

          {error && <p className='text-red-400 text-sm mt-4'>{error}</p>}
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerateWebsite}
            disabled={!prompt.trim() || loading}
            className={`px-14 py-4 rounded-2xl font-semibold text-lg ${
              prompt.trim() && !loading
                ? "bg-white text-black"
                : "bg-white/20 text-zinc-400 cursor-not-allowed"
            }`}
          >
            Generate Website
          </motion.button>
        </div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-xl mx-auto mt-12"
          >
            <div className="flex justify-between mb-2 text-xs text-zinc-400">
              <span>{PHASES[phaseIndex]}</span>
              <span>{progress}%</span>
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-white to-zinc-400"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.8 }}
              />
            </div>

            <div className="mt-4 text-xs text-zinc-400 text-center">
              Estimated time remaining:{" "}
              <span className="text-white font-semibold">
                ~8-12 minutes
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Generate
