import { useEffect, useState } from 'react'
import axios from 'axios'
import { serverUrl } from '../config'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { auth } from '../firebase'
import { getRedirectResult } from 'firebase/auth'

function useGetCurrentUser() {

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const initAuth = async () => {
            try {
                const redirectResult = await getRedirectResult(auth)
                if (redirectResult?.user) {
                    const { data } = await axios.post(`${serverUrl}/api/auth/google`, {
                        name: redirectResult.user.displayName,
                        email: redirectResult.user.email,
                        avatar: redirectResult.user.photoURL,
                        uid: redirectResult.user.uid
                    }, { withCredentials: true })
                    dispatch(setUserData(data.user))
                    setLoading(false)
                    return
                }
            } catch (error) {
                console.error("Redirect sign-in error:", error)
            }

            try {
                const result = await axios.get(`${serverUrl}/api/user/me`, 
                    {withCredentials: true})
                dispatch(setUserData(result.data))
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        initAuth()
    }, [])

    return { loading }

}

export default useGetCurrentUser