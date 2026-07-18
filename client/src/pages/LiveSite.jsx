import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { buildSrcDoc } from '../utils/srcdoc'

function LiveSite  () {
    const { id } = useParams()
    const [html,setHtml]=useState("")
    const [error,setError]=useState("")
    const iframeRef = useRef(null)

    useEffect(() => {
      const handleGetWebsite = async () => {
        try {
          const result = await axios.get(
            `${serverUrl}/api/website/get-by-slug/${id}`)
          setHtml(result.data.latestCode || "")
        } catch (error) {
          console.log(error);
          setError("site not found")    
        }
      };
      handleGetWebsite();
    }, [id]);

    useEffect(() => {
      if (!iframeRef.current || !html) return;
      const blob = new Blob([buildSrcDoc(html)], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;
      return () => URL.revokeObjectURL(url);
    }, [html]);

    if(error){
      return <div className="h-screen flex items-center justify-center bg-black text-white">
          {error}
      </div>
    }

    return (
      <iframe ref={iframeRef} title='Live Site' className='w-screen h-screen border-none '
      sandbox='allow-scripts allow-same-origin allow-forms allow-popups' />
    )
}

export default LiveSite