import { ArrowLeft, Rocket, Share2, Check, Search, Grid, List, Trash2, Clock, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'   
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
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
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid") // grid or list
  const [sortBy, setSortBy] = useState("updatedAt") // updatedAt, title, createdAt
  const [deleteConfirm, setDeleteConfirm] = useState(null)

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

  const handleDelete = async (websiteId) => {
    try {
      await axios.delete(`${serverUrl}/api/website/${websiteId}`, { withCredentials: true })
      setWebsites(prev => prev.filter(w => w._id !== websiteId))
      setDeleteConfirm(null)
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

  // Filter and sort websites
  const filteredAndSortedWebsites = useMemo(() => {
    let filtered = websites

    // Search filter
    if (searchQuery.trim()) {
      filtered = websites.filter(w => 
        (w.title || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "updatedAt") {
        return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)
      } else if (sortBy === "title") {
        return (a.title || '').localeCompare(b.title || '')
      } else if (sortBy === "createdAt") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      }
      return 0
    })

    return filtered
  }, [websites, searchQuery, sortBy])

  return (
    <div className='min-h-screen bg-black text-white'>
      {/* Header */}
      <div className='sticky top-0 z-40 bg-black/50 backdrop-blur-xl border-b border-white/10'>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-white/10 transition" onClick={() => navigate("/")}>
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <button 
            className='bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:scale-105 transition flex items-center gap-2'
            onClick={() => navigate("/generate")}
          >
            <Sparkles size={16} />
            New Website
          </button>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-6 py-10'>
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className='text-sm text-zinc-400 mb-1'>Welcome Back</p>
          <h1 className='text-3xl font-bold'>{userData?.name || 'User'}</h1>
        </motion.div>

        {/* Stats */}
        {!loading && !error && websites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-3xl font-bold text-white">{websites.length}</p>
              <p className="text-sm text-zinc-400 mt-1">Total Websites</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-3xl font-bold text-white">{websites.filter(w => w.deployed).length}</p>
              <p className="text-sm text-zinc-400 mt-1">Deployed</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-3xl font-bold text-white">{websites.filter(w => !w.deployed).length}</p>
              <p className="text-sm text-zinc-400 mt-1">In Progress</p>
            </div>
          </motion.div>
        )}

        {/* Search and Filters */}
        {!loading && !error && websites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="text"
                  placeholder="Search websites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 
                           text-sm outline-none focus:border-white/30 transition"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm 
                         outline-none focus:border-white/30 transition cursor-pointer text-white"
                style={{ colorScheme: 'dark' }}
              >
                <option value="updatedAt" className="bg-gray-900 text-white">Last Updated</option>
                <option value="createdAt" className="bg-gray-900 text-white">Recently Created</option>
                <option value="title" className="bg-gray-900 text-white">Name (A-Z)</option>
              </select>

              {/* View Mode */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-xl border transition ${
                    viewMode === "grid"
                      ? "bg-white/10 border-white/20"
                      : "bg-white/5 border-white/10 hover:bg-white/8"
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-xl border transition ${
                    viewMode === "list"
                      ? "bg-white/10 border-white/20"
                      : "bg-white/5 border-white/10 hover:bg-white/8"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <div className='mt-24 text-center text-zinc-400'>Loading Your Websites...</div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className='mt-24 text-center text-red-400'>{error}</div>
        )}

        {/* Empty State */}
        {!loading && !error && websites.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-24 text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-6">
              <Grid size={32} className="text-zinc-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No websites yet</h3>
            <p className="text-zinc-400 mb-6">Create your first AI-powered website to get started</p>
            <button
              onClick={() => navigate("/generate")}
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition"
            >
              Create Your First Website
            </button>
          </motion.div>
        )}

        {/* No Search Results */}
        {!loading && !error && websites.length > 0 && filteredAndSortedWebsites.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-24 text-center"
          >
            <Search size={48} className="text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-zinc-400">Try adjusting your search query</p>
          </motion.div>
        )}

        {/* Websites Grid/List */}
        {!loading && !error && filteredAndSortedWebsites.length > 0 && (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }>
            {filteredAndSortedWebsites.map((w, i) => {
              const copied = copiedId === w._id
              return (
                <motion.div
                  key={w._id || i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  className={
                    viewMode === "grid"
                      ? "overflow-hidden rounded-2xl border border-white/10 bg-[#101010] shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition hover:border-white/20 hover:bg-[#141414]"
                      : "p-4 rounded-2xl border border-white/10 bg-[#101010] shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition hover:border-white/20 hover:bg-[#141414]"
                  }
                >
                  {viewMode === "grid" ? (
                    <>
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
                            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="min-w-0 flex-1">
                            <h2 className="text-sm font-semibold leading-snug line-clamp-2">
                              {w.title || 'Untitled website'}
                            </h2>
                            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-zinc-400">
                              <Clock size={12} />
                              <span>Updated {w.updatedAt ? new Date(w.updatedAt).toLocaleDateString() : 'recently'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {w.deployed ? (
                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => handleCopy(e, w)}
                              className={`flex-1 flex items-center justify-center gap-2
                                rounded-xl px-3 py-2 text-xs font-medium transition-all
                                ${
                                  copied
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                                }`}
                            >
                              {copied ? (
                                <>
                                  <Check size={14} />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Share2 size={14} />
                                  Copy Link
                                </>
                              )}
                            </motion.button>
                          ) : (
                            <button
                              className="flex-1 flex items-center justify-center gap-2 rounded-xl 
                                       bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-2 
                                       text-xs font-semibold text-white transition hover:scale-[1.02]"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeploy(w._id)
                              }}
                              type="button"
                            >
                              <Rocket size={14} />
                              <span>Deploy</span>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteConfirm(w._id)
                            }}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition"
                          >
                            <Trash2 size={14} className="text-zinc-400 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* List View */
                    <div className="flex items-center gap-4">
                      <div
                        className="w-32 h-20 rounded-lg overflow-hidden bg-[#d9d9d9] flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/editor/${w._id}`)}
                      >
                        <iframe
                          title={w.title || 'Website preview'}
                          srcDoc={buildSrcDoc(w.latestCode || '')}
                          className="w-full h-full pointer-events-none bg-white"
                          sandbox="allow-scripts allow-forms allow-popups"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold truncate">{w.title || 'Untitled website'}</h3>
                        <p className="text-xs text-zinc-400 mt-1">
                          Updated {w.updatedAt ? new Date(w.updatedAt).toLocaleDateString() : 'recently'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {w.deployed ? (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => handleCopy(e, w)}
                            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                              copied
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                            }`}
                          >
                            {copied ? <Check size={14} /> : <Share2 size={14} />}
                          </motion.button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeploy(w._id)
                            }}
                            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-2 text-xs font-semibold text-white transition hover:scale-105"
                          >
                            <Rocket size={14} />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteConfirm(w._id)
                          }}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition"
                        >
                          <Trash2 size={14} className="text-zinc-400 hover:text-red-400" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
            onClick={() => setDeleteConfirm(null)}
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
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
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
  )
}

export default Dashboard
