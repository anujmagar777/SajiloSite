import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App'

function LiveSite  () {
    const { id } = useParams()
    const [error,setError]=useState(false)

    return (
      <>
        {error && (
          <div className="h-screen flex items-center justify-center bg-black text-white">
            Website not found
          </div>
        )}
        <iframe
          title='Live Site'
          className='w-screen h-screen border-none'
          sandbox='allow-scripts allow-same-origin allow-forms allow-popups'
          src={`${serverUrl}/api/website/preview/${id}`}
          onError={() => setError(true)}
        />
      </>
    )
}

export default LiveSite