import React, { useState, useEffect, useRef } from 'react'

function Camara({ stream, recording }) {
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const videoRef = useRef(null)

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  useEffect(() => {
    let recorder

    const startRecording = () => {
      if (stream && !mediaRecorderRef.current) {
        chunksRef.current = []

        recorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
        mediaRecorderRef.current = recorder

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data)
          } else {
            console.error('El fragmento de video está vacío.')
          }
        }

        recorder.onstop = async () => {
          console.log('Grabación detenida. Guardando el archivo...')
          if (chunksRef.current.length > 0) {
            await saveRecording(chunksRef.current, `video_${new Date().toISOString()}.webm`)
          } else {
            console.error('No se grabaron fragmentos de video.')
          }

          setTimeout(() => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
              mediaRecorderRef.current.stop()
            }
          }, 300000)
        }

        recorder.start()
      }
    }

    const stopRecording = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }

    if (recording) {
      startRecording()
    } else {
      stopRecording()
    }

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [recording, stream])

  const saveRecording = async (recordedChunks, fileName) => {
    try {
      if (!Array.isArray(recordedChunks) || recordedChunks.length === 0) {
        throw new Error('recordedChunks no es un array válido o está vacío.')
      }

      const videoBlob = new Blob(recordedChunks, { type: 'video/webm' })

      const arrayBuffer = await videoBlob.arrayBuffer()

      const safeFileName = fileName.replace(/[\\/:*?"<>|]/g, '-')

      const filePath = await window.electron.saveVideo(arrayBuffer, safeFileName)
      console.log(`Archivo guardado en: ${filePath}`)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Archivo guardado en: ${filePath}`,
        showConfirmButton: false,
        timer: 1500
      })
    } catch (error) {
      console.error('Error al guardar el archivo:', error)
    }
  }

  return (
    <div className="CamaraView">
      <video autoPlay muted ref={videoRef} width="350px" height="180px"></video>
    </div>
  )
}

export default Camara
