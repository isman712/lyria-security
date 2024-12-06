import { useEffect, useState } from 'react'
import Camara from './components/Camara'
import GestionCamaras from './components/GestionCamaras'
import Menu from './components/menu'
import { themeChange } from 'theme-change'


function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')
  const [streams, setStreams] = useState([])
  const [recording, setRecording] = useState(false)


useEffect(() => {
  themeChange(false)
}, [])

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

  const startRecording = () => {
    setRecording(true)
  }

  const stopRecording = () => {
    setRecording(false)
  }
  return (
    <>
      <div className="MenuContect">
        <div className="Menu bg-base-200">
          <div className="bwgg1">
            <Menu></Menu>
          </div>
          <div className="bwgg2">
            <dialog id="my_modal_2" className="modal">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Ajustes</h3>

                <div className="DivLiberCaer">
                  <label htmlFor="">Cambiar tema</label>
                  <select className="select select-primary w-full max-w-xs" data-choose-theme>
                    <option disabled selected>Seleccionar tema</option>
                    <option value="dark">Dark</option>
                    <option value="corporate">Corporate</option>
                    <option value="dracula">Dracula</option>
                    <option value="night">Night</option>
                  </select>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
            <div className="divider"></div>
            {recording ? (
              <button className="btn btn-secondary botonase" onClick={stopRecording}>
                Detener grabación
              </button>
            ) : (
              <button className="btn btn-secondary botonase" onClick={startRecording}>
                Iniciar grabación
              </button>
            )}
            <button
              className="btn btn-primary botonase"
              onClick={() => document.getElementById('my_modal_2').showModal()}
            >
              Ajustes
            </button>
          </div>
        </div>

        <main className="content">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {streams.map((stream, index) => (
              <Camara key={index} stream={stream} recording={recording} />
            ))}
          </div>
        </main>
      </div>
    </>
  )
}

export default App
