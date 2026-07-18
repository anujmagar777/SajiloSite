import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'
import { buildSrcDoc } from '../utils/srcdoc'


function LiveSite  () {
    const { id } = useParams()
    const [html,setHtml]=useState("")
    const [error,setError]=useState("")
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

  if(error){
    return <div className="h-screen flex items-center justify-center bg-black text-white">
        {error}
    </div>
  }

  return (
    <iframe title='Live Site' className='w-screen h-screen border-none '
    sandbox='allow-scripts allow-same-origin allow-forms' srcDoc={buildSrcDoc(html)} />
  )
}

export default LiveSite