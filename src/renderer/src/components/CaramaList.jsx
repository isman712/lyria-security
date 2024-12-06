import React, { useState, useEffect, useRef } from 'react'

function CamaraList({ stream }) {

  const videoRef = useRef(null)

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])


  return (
    <div className="CamaraView">
      <video autoPlay muted ref={videoRef} width="350px" height="180px"></video>
    </div>
  )
}

export default CamaraList
