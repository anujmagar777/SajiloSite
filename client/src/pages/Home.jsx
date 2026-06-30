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
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),transparent_45%)]' />
        <motion.div
        initial= {{y: -40, opacity: 0}}
        animate = {{y: 0, opacity: 1}}
        transition={{duration: 0.5}}
        className = 'fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10'>
            <div className='max-w-6xl mx-auto px-6 py-4 flex justify-between items-center'>
                <div className='text-sm font-semibold tracking-wide uppercase text-zinc-200'>
                    SajiloSite
                </div>
                <div className='flex items-center gap-4'>
                    {authAction}
                </div>
            </div>
        </motion.div>

        <section className = 'pt-44 pb-28 px-6 text-center'>
            <motion.h1
            initial = {{opacity:0, y:30}}
            animate = {{opacity:1, y:0}}
            transition={{duration: 0.6}}
            className='text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight'>
                Build Stunning Websites
                <span className='block bg-linear-to-r from-violet-300 to-blue-300 bg-clip-text text-transparent'>with AI</span>
            </motion.h1>
            <motion.p 
            initial = {{opacity:0, y:20}}
            animate = {{opacity:1, y:0}}
            transition={{duration: 0.6, delay: 0.1}}
            className='mt-6 max-w-2xl mx-auto text-zinc-400 text-base sm:text-lg'>
                Describe your idea and let AI generate a modern, responsive, production-ready website.
            </motion.p>
            
            <motion.button
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.2}}
                className='px-10 py-3.5 rounded-full bg-white text-black font-semibold hover:scale-[1.02] transition mt-10'
                onClick={() => (userData ? navigate('/dashboard') : setOpenLogin(true))}
            >
                {userData ? 'Go to dashboard' : user ? 'Signed In' : 'Get Started'}
            </motion.button>
        </section>
{!userData &&  <section className='max-w-6xl mx-auto px-6 pb-28'>
            <div className = 'grid grid-cols-1 md:grid-cols-3 gap-6'>
                {hightlights.map((h)=>(
                    <motion.div
                        key={h}
                        initial = {{opacity:0, y:40}}
                        whileInView={{opacity:1, y:0}}
                        className='rounded-2xl bg-white/5 border border-white/10 p-7'
                    > 
                    <h1 className='text-xl font-semibold mb-3'>{h}</h1>   

                    <p className= 'text-sm text-zinc-400'>
                            SajiloSite builds real websites - clean code, animations, responsive design, and more.
                    </p>
                    </motion.div>
                ))}
            </div>
        </section>}
       

{userData && websites?.length>0 && (
    <section className='max-w-7xl mx-auto px-6 pb-32'>
        <h3 className='text-2xl font-semibold mb-6'>Your Websites</h3>

        <div className='grid grid-cols-1 md:grid-cols-3  gap-6'>
            {websites.slice(0, 3).map((w,i) => (
                <motion.div
                  key={w._id}
                  whileHover={{y: -6}}
                  onClick={() => navigate(`/editor/${w._id}`)}
                  className='cursor-pointer rounded-2xl bg-white/5 border
                 border-white/10 overflow-hidden '
                >
                    <div className='h-40 bg-black'>
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
        <footer className = 'border-t border-white/10 py-10 text-center text-sm text-zinc-500' >
            &copy;{new Date().getFullYear()} SajiloSite
        </footer>

                <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />
    </div>
  )
}

export default Home