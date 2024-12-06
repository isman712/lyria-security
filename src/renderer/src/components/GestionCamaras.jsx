import React, { useState, useEffect } from 'react'
import Camara from './CaramaList'

function SistemaDeSeguridad() {
  const [streams, setStreams] = useState([])
  const [recording, setRecording] = useState(false)

  useEffect(() => {
    const obtenerCamaras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoDevices = devices.filter((device) => device.kind === 'videoinput')

        const streamsArray = []
        for (const device of videoDevices) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: device.deviceId }
            })
            streamsArray.push(stream)
          } catch (error) {
            console.warn(`No se pudo acceder a la cámara ${device.label}:`, error)
          }
        }

        setStreams(streamsArray)
      } catch (error) {
        console.error('Error al obtener las cámaras:', error)
      }
    }

    obtenerCamaras()

    return () => {
      streams.forEach((stream) => stream.getTracks().forEach((track) => track.stop()))
    }
  }, [])


  return (
    <div>
      <h1>Sistema de Seguridad</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {streams.map((stream, index) => (
          <Camara key={index} stream={stream}  />
        ))}
      </div>
    </div>
  )
}

export default SistemaDeSeguridad
