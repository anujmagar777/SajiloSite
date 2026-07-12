import {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import {AnimatePresence, motion} from 'motion/react'
import LoginModal from '../components/LoginModal.jsx'
import { auth } from '../firebase'
import { onAuthStateChanged, getRedirectResult, signOut } from 'firebase/auth'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../config'
import { setUserData } from '../redux/userSlice'
import { Sparkles, ArrowRight, Zap, Shield, Globe } from 'lucide-react'

function Home() {

    const hightlights = [
            'AI Generated Websites',
            'Fully Responsive',
            'Production Ready',
    ]

        const [openLogin, setOpenLogin] = useState(false)
        const {userData}    = useSelector(state => state.user)
        const dispatch = useDispatch()
        const [openProfile, setOpenProfile] = useState(false)
        const [websites, setWebsites] = useState(null)
        const [user, setUser] = useState(null)
        const [authReady, setAuthReady] = useState(false)

        const displayName = userData?.name || user?.displayName || user?.email
        const fallbackAvatarUrl = displayName
            ? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&size=128`
            : null
        const avatarUrl = userData?.avatar || user?.photoURL || fallbackAvatarUrl
        const [avatarSrc, setAvatarSrc] = useState(avatarUrl)
        const navigate = useNavigate()

        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser)
                setAuthReady(true)
                if (currentUser) {
                    setOpenLogin(false)
                }
            })

            getRedirectResult(auth)
                .then((result) => {
                    if (result?.user) {
                        setUser(result.user)
                        setOpenLogin(false)
                    }
                })
                .catch((error) => {
                    console.log('Google redirect result error:', error)
                })

            return () => unsubscribe()
        }, [])

        useEffect(() => {
            setAvatarSrc(avatarUrl)
        }, [avatarUrl])

        const handleSignOut = async () => {
            try {
                await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            } catch (error) {
                console.log('Logout request failed:', error)
            } finally {
                await signOut(auth)
                setUser(null)
                dispatch(setUserData(null))
                setOpenProfile(false)
            }
        }

        const isAuthenticated = authReady && (user || userData)
        const profileName = userData?.name || user?.displayName || 'User'
        const profileEmail = userData?.email || user?.email || ''
        let authAction = null

        if (isAuthenticated) {
            authAction = (
                <div className='relative'>
                    <button
                        className='flex items-center'
                        onClick={() => setOpenProfile(!openProfile)}
                        aria-label='Open profile menu'
                    >
                        {avatarSrc ? (
                            <img
                                src={avatarSrc}
                                className='w-9 h-9 rounded-full border border-white/20 object-cover'
                                alt='User avatar' referrerPolicy='no-referrer'
                                onError={() => {
                                    if (avatarSrc !== fallbackAvatarUrl) {
                                        setAvatarSrc(fallbackAvatarUrl)
                                    }
                                }}
                            />
                        ) : null}
                    </button>
                    <AnimatePresence>
                        {openProfile && (
                            <motion.div
                                initial={{opacity: 0, y: -10, scale: 0.98}}
                                animate={{opacity: 1, y: 0, scale: 1}}
                                exit={{opacity: 0, y: -10, scale: 0.98}}
                                className='absolute right-0 mt-3 w-64 rounded-2xl bg-black/90 backdrop-blur-lg border border-white/10 shadow-2xl overflow-hidden'
                            >
                                <div className='px-4 py-3 border-b border-white/10'>
                                    <p className='text-sm font-medium truncate'>{profileName}</p>
                                    {profileEmail ? (
                                        <p className='text-xs text-zinc-400 truncate'>{profileEmail}</p>
                                    ) : null}
                                </div>
                                <div className='py-2'>
                                    <button
                                        className='block px-4 py-2 text-sm text-zinc-200 hover:bg-white/10'
                                        onClick={() => {navigate('/dashboard')
                                           
                                        }}
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        className='w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10'
                                        onClick={handleSignOut}
                                    >
                                        Logout
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )
        } else if (!userData) {
            authAction = (
                <button
                    className='px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 text-xs'
                    onClick={() =>userData?navigate("/dashboard"):setOpenLogin(true)}
                >
                    {userData?"Go to dashboard":"Get Started"}
                </button>
            )
        }

  useEffect(()=>{
    if (!userData) return;
    const handleGetAllWebsites = async () => {
      try {
        
        const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true })
        setWebsites(result.data|| [])
      }catch (error) {
        console.log(error)
         
      }}
      handleGetAllWebsites()
  },[userData])
     

  return (
    <div className='relative min-h-screen bg-[#050505] text-white overflow-hidden'>
        {/* Background Effects */}
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),transparent_45%)]' />
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(139,92,246,0.08),transparent_40%)]' />
        
        {/* Navigation */}
        <motion.div
        initial= {{y: -40, opacity: 0}}
        animate = {{y: 0, opacity: 1}}
        transition={{duration: 0.5}}
        className = 'fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10'>
            <div className='max-w-6xl mx-auto px-6 py-4 flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <button 
                        onClick={() => navigate('/')}
                        className='text-sm font-semibold tracking-wide uppercase text-zinc-200 hover:text-white transition'
                    >
                        SajiloSite
                    </button>
                </div>
                <div className='flex items-center gap-4'>
                    {authAction}
                </div>
            </div>
        </motion.div>

        {/* Hero Section */}
        <section className = 'pt-44 pb-28 px-6 text-center relative'>
            <motion.div
            initial = {{opacity:0, y:30}}
            animate = {{opacity:1, y:0}}
            transition={{duration: 0.6}}
            className='max-w-5xl mx-auto'
            >
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 mb-8"
                >
                    <Sparkles size={16} className="text-yellow-400" />
                    <span>Powered by Advanced AI</span>
                </motion.div>
                
                <h1 className='text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-[1.1]'>
                    Build Stunning Websites
                    <span className='block bg-linear-to-r from-violet-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent mt-2'>with AI</span>
                </h1>
                
                <motion.p 
                initial = {{opacity:0, y:20}}
                animate = {{opacity:1, y:0}}
                transition={{duration: 0.6, delay: 0.2}}
                className='mt-6 max-w-2xl mx-auto text-zinc-400 text-base sm:text-lg leading-relaxed'>
                    Describe your idea and let AI generate a modern, responsive, production-ready website in minutes.
                </motion.p>
                
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{duration: 0.5, delay: 0.3}}
                    className='mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center'
                >
                    <button
                        onClick={() => (userData ? navigate('/dashboard') : setOpenLogin(true))}
                        className='px-8 py-4 rounded-full bg-white text-black font-semibold hover:scale-[1.02] transition flex items-center gap-2 shadow-lg shadow-white/20'
                    >
                        {userData ? 'Go to Dashboard' : user ? 'Signed In' : 'Get Started'}
                        {!userData && <ArrowRight size={18} />}
                    </button>
                    {userData && (
                        <button
                            onClick={() => navigate('/generate')}
                            className='px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition flex items-center gap-2'
                        >
                            <Sparkles size={18} />
                            Create New Website
                        </button>
                    )}
                </motion.div>
            </motion.div>
        </section>

        {/* Features Section */}
        {!userData && (
            <section className='max-w-6xl mx-auto px-6 pb-28'>
                <div className = 'grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {hightlights.map((h, index) => (
                        <motion.div
                            key={h}
                            initial = {{opacity:0, y:40}}
                            whileInView={{opacity:1, y:0}}
                            transition={{ delay: index * 0.1 }}
                            className='rounded-2xl bg-white/5 border border-white/10 p-7 hover:border-white/20 hover:bg-white/8 transition-all duration-300'
                        > 
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                                {index === 0 && <Zap size={24} className="text-yellow-400" />}
                                {index === 1 && <Globe size={24} className="text-blue-400" />}
                                {index === 2 && <Shield size={24} className="text-green-400" />}
                            </div>
                            <h1 className='text-xl font-semibold mb-3'>{h}</h1>   
                            <p className= 'text-sm text-zinc-400 leading-relaxed'>
                                {index === 0 && "Advanced AI creates professional websites with modern design, smooth animations, and clean code."}
                                {index === 1 && "Every website is fully responsive and looks perfect on mobile, tablet, and desktop devices."}
                                {index === 2 && "Generate production-ready code that's optimized, accessible, and ready to deploy."}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>
        )}
        
        {/* Recent Websites Section */}
        {userData && websites?.length>0 && (
            <section className='max-w-7xl mx-auto px-6 pb-32'>
                <div className="flex items-center justify-between mb-6">
                    <h3 className='text-2xl font-semibold'>Your Websites</h3>
                    
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3  gap-6'>
                    {websites.slice(0, 3).map((w,i) => (
                        <motion.div
                          key={w._id}
                          whileHover={{y: -6}}
                          onClick={() => navigate(`/editor/${w._id}`)}
                          className='cursor-pointer rounded-2xl bg-white/5 border
                         border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300'
                        >
                            <div className='h-40 bg-black relative overflow-hidden'>
                                <iframe
                                srcDoc={w.latestCode }
                                className='w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white'
                                />
                            </div>
                            <div className='p-4'>
                                <h2 className="text-[14px] font-semibold leading-snug line-clamp-2">
                              {w.title || 'Untitled website'}
                            </h2>
                            <p className="mt-1.5 text-[11px] text-zinc-400">
                              Last updated {w.updatedAt ? new Date(w.updatedAt).toLocaleDateString() : 'recently'}
                            </p>
                            </div>
                        </motion.div>
                    ))}
                    
                </div>       
            </section>
        )}  

        {/* CTA Section for logged-in users */}
        {userData && (
            <section className='max-w-4xl mx-auto px-6 pb-32'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="rounded-3xl bg-gradient-to-br from-violet-500/10 to-blue-500/10 border border-white/10 p-12 text-center"
                >
                    <Sparkles size={48} className="text-yellow-400 mx-auto mb-4" />
                    <h3 className='text-3xl font-bold mb-4'>Ready to Create Something Amazing?</h3>
                    <p className='text-zinc-400 mb-8 max-w-xl mx-auto'>
                        Transform your ideas into beautiful, functional websites with the power of AI.
                    </p>
                    <button
                        onClick={() => navigate('/generate')}
                        className='px-8 py-4 rounded-full bg-white text-black font-semibold hover:scale-[1.02] transition inline-flex items-center gap-2'
                    >
                        Start Building Now
                        <ArrowRight size={18} />
                    </button>
                </motion.div>
            </section>
        )}

        <footer className = 'border-t border-white/10 py-10 text-center text-sm text-zinc-500' >
            &copy;{new Date().getFullYear()} SajiloSite. Built with AI.
        </footer>

        <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
    </div>
  )
}

export default Home