import { ArrowLeft, Rocket, Share2, Check } from 'lucide-react'
import { motion } from 'framer-motion'   // ✅ use framer-motion instead of motion/react
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { buildSrcDoc } from '../utils/srcdoc'

function Dashboard() {
  const { userData } = useSelector(state => state.user)
  const navigate = useNavigate()
  const [websites, setWebsites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState(null)

  const handleDeploy = async (websiteId) => {
    try {
      const result = await axios.get(`${serverUrl}/api/website/deploy/${websiteId}`, { withCredentials: true })
      window.open(`${result.data.url}`, '_blank')
      setWebsites((prev) =>
        prev.map((w) =>
          w._id === websiteId
            ? { ...w, deployed: true, deployedUrl: result.data.url }
            : w
        )
      )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const handleGetAllWebsites = async () => {
      try {
        setLoading(true)
        setError("")
        const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true })
        setWebsites(Array.isArray(result.data) ? result.data : [])
      } catch (error) {
        console.log(error)
        setError(error.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }
    handleGetAllWebsites()
  }, [])

  const handleCopy = async (e, site) => {
    e.stopPropagation() // prevent redirect
    await navigator.clipboard.writeText(site.deployedUrl)
    setCopiedId(site._id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className='min-h-screen bg-black text-white'>
      <div className='sticky top-0 z-40 bg-black/50 backdrop-blur-xl p-4 text-2xl font-bold border-b border-white/10'>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-white/10 transition" onClick={() => navigate("/")}><ArrowLeft size={16} /></button>
            <h1>Dashboard</h1>
          </div>
          <button className='bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition' onClick={() => navigate("/generate")}>
            + New Website
          </button>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-10'>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className='text-sm text-zinc-400 mb-1'>Welcome Back</p>
          <h1 className='text-3xl font-bold'>{userData?.name || 'User'}</h1>
        </motion.div>

        {loading && (
          <div className='mt-24 text-center text-zinc-400'>Loading Your Websites...</div>
        )}
        {error && !loading && (
          <div className='mt-24 text-center text-red-400'>{error}</div>
        )}
        {!loading && !error && websites.length === 0 && (
          <div className="mt-24 text-center text-zinc-400">You have no website</div>
        )}
        {!loading && !error && websites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {websites.map((w, i) => {
              const copied = copiedId === w._id
              return (
                <motion.div
                  key={w._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-[#101010] shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition hover:border-white/20 hover:bg-[#141414]"
                >
                  {/* Preview area clickable */}
                  <div
                    className="block w-full text-left cursor-pointer"
                    onClick={() => navigate(`/editor/${w._id}`)}
                  >
                    <div className="relative h-[180px] bg-[#d9d9d9] overflow-hidden border-b border-black/10">
                      <iframe
                        title={w.title || 'Website preview'}
                        srcDoc={buildSrcDoc(w.latestCode || '')}
                        className="absolute inset-0 h-[150%] w-[150%] scale-[0.65] origin-top-left pointer-events-none bg-white"
                        sandbox="allow-scripts allow-forms allow-popups"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="text-[14px] font-semibold leading-snug line-clamp-2">
                          {w.title || 'Untitled website'}
                        </h2>
                        <p className="mt-1.5 text-[11px] text-zinc-400">
                          Last updated {w.updatedAt ? new Date(w.updatedAt).toLocaleDateString() : 'recently'}
                        </p>
                      </div>
                    </div>

                    {w.deployed ? (
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleCopy(e, w)}
                        className={`mt-auto flex w-full items-center justify-center gap-2
                          rounded-xl px-4 py-2 text-sm font-medium transition-all
                          ${
                            copied
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                          }`}
                      >
                        {copied ? (
                          <>
                            <Check />
                            Link Copied
                          </>
                        ) : (
                          <>
                            <Share2 size={14} />
                            Share Link
                          </>
                        )}
                      </motion.button>
                    ) : (
                      <button
                        className="mt-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.01]"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeploy(w._id)
                        }}
                        type="button"
                      >
                        <Rocket size={18} />
                        <span>Deploy</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
