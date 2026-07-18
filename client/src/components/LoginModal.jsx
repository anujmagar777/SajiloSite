import React from 'react'
import {AnimatePresence, motion} from 'motion/react'
import { auth, provider } from '../firebase';
import { signInWithRedirect } from 'firebase/auth';
import {serverUrl} from '../config.js'

function LoginModal({open, onClose}) {
  const handleGoogleAuth=()=>{
    signInWithRedirect(auth, provider)
  }
  return (
    <AnimatePresence>
       {open && 
        <motion.div
             className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-xl px-4"
             initial={{opacity:0}}
             animate={{opacity:1}}
             exit={{opacity:0}}
             onClick={onClose}>

            <motion.div 
              initial={{scale:0.98, opacity:0, y:20}}
              animate={{scale:1, opacity:1, y:0}}
              exit={{scale:0.98, opacity:0, y:10}}
              className='relative w-full max-w-md p-1 rounded-2xl bg-linear-to-r from-purple-800/12 to-transparent'
              onClick={(e)=>e.stopPropagation()}
            >

              <div className='relative rounded-2xl bg-[#071017] border border-white/6 p-6 overflow-visible shadow-2xl'>
                {/* Left decorative glow */}
                <motion.div 
                  animate={{ opacity: [0.12, 0.24, 0.12]}}
                  transition={{ duration: 6, repeat: Infinity }}
                  className='absolute -top-6 -left-6 w-40 h-40 bg-purple-500/12 blur-3xl pointer-events-none'
                />

                {/* Right decorative glow */}
                <motion.div
                  animate={{ opacity: [0.08, 0.18, 0.08]}}
                  transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                  className='absolute -bottom-6 -right-6 w-36 h-36 bg-blue-500/10 blur-3xl pointer-events-none'
                />

                <button onClick={onClose} className='absolute top-5 right-5 z-20 text-zinc-400 hover:text-white transition text-lg'>
                  ✕
                </button>

                <div className='relative flex items-center justify-center text-center'>
                  <div className='relative flex flex-col items-center gap-3 px-6 py-6 text-center'>
                    <h1 className='inline-block mb-0 px-4 py-1.5 rounded-full bg-white/6 border border-white/8 text-xs text-zinc-200 shadow-sm'>AI-powered website builder</h1>

                    <h2 className='text-3xl font-semibold leading-tight text-white mt-2'>
                      <span className='mr-2'>Welcome to</span>
                      <span className='bg-clip-text text-transparent bg-linear-to-r from-purple-400 to-blue-400'>SajiloSite</span>
                    </h2>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGoogleAuth}
                      className='mt-4 w-full inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black font-semibold shadow-lg overflow-hidden'
                      >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail" alt="Google Logo" className='w-5 h-5 mr-3' />
                      Continue with Google
                    </motion.button>

                  <div className='flex items-center gap-3 my-6'>
                    <div className='flex-1 h-1 bg-white/80'></div>
                    <span className='text-xs text-white/70 tracking-wide whitespace-nowrap'>Secure Login</span>
                    <div className='flex-1 h-1 bg-white/80'></div>
                  </div>
                  <p className='text-xs text-zinc-400 mt-4'>
                     By continuing, you agree to our <a href="#" className='text-blue-400 hover:underline'>Terms of Service</a> and <a href="#" className='text-blue-400 hover:underline'>Privacy Policy</a>. 
                  </p>            
                  </div>
                </div>
              </div>
            </motion.div>

        </motion.div>}
        
    </AnimatePresence>

  )
}

export default LoginModal