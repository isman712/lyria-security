import React, { useState, useEffect, useRef } from 'react';

const WebRTCComponent = () => {
    const [peerConnection, setPeerConnection] = useState(null);
    const [localDescription, setLocalDescription] = useState(null);
    const [remoteDescription, setRemoteDescription] = useState(null);
    const [iceConnectionState, setIceConnectionState] = useState(null);
    const [signalingState, setSignalingState] = useState(null);

    const localStream = useRef(null);  // Para guardar el stream local (por ejemplo, la cámara)
    const remoteStream = useRef(null); // Para guardar el stream remoto

    // Referencias para los elementos de video
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // Función para obtener el stream de la cámara y el micrófono
    useEffect(() => {
        const getLocalStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                localStream.current = stream;
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error('Error al acceder a la cámara o micrófono: ', err);
            }
        };

        getLocalStream();

        return () => {
            // Limpiar el stream cuando el componente se desmonte
            if (localStream.current) {
                localStream.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // Crear y configurar la RTCPeerConnection
    useEffect(() => {
        const pc = new RTCPeerConnection();
        setPeerConnection(pc);

        // Manejar los cambios en el estado de la conexión ICE
        pc.oniceconnectionstatechange = () => {
            setIceConnectionState(pc.iceConnectionState);
        };

        // Manejar los cambios en el estado de señalización
        pc.onsignalingstatechange = () => {
            setSignalingState(pc.signalingState);
        };

        // Manejar la llegada de la pista remota (video/audio)
        pc.ontrack = (event) => {
            if (remoteStream.current) {
                remoteStream.current.srcObject = event.streams[0];
            }
        };

        // Si el stream local está disponible, agregar las pistas al peer connection
        if (localStream.current) {
            localStream.current.getTracks().forEach(track => {
                pc.addTrack(track, localStream.current);
            });
        }

        return () => {
            // Limpiar la conexión cuando el componente se desmonte
            pc.close();
        };
    }, [localStream]);

    // Función para manejar la oferta
    const handleOffer = async (offer) => {
        try {
            console.log('Estableciendo la descripción remota con la oferta');
            await peerConnection.setRemoteDescription(offer);
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            setLocalDescription(answer);

            // Aquí envías la respuesta al otro peer, normalmente a través de WebSocket o Signal Server
            sendToPeer(answer);
        } catch (error) {
            console.error('Error manejando la oferta:', error);
        }
    };

    // Función para manejar la respuesta
    const handleAnswer = async (answer) => {
        try {
            console.log('Estableciendo la descripción remota con la respuesta');
            await peerConnection.setRemoteDescription(answer);
        } catch (error) {
            console.error('Error manejando la respuesta:', error);
        }
    };

    // Función para manejar la señalización
    const sendToPeer = (message) => {
        console.log('Enviando mensaje a otro peer:', message);
        // Aquí debes enviar el mensaje de señalización al otro peer (ej. a través de WebSocket)
    };

    // Función para iniciar la conexión (crear oferta)
    const startConnection = async () => {
        try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            setLocalDescription(offer);
            sendToPeer(offer); // Enviar la oferta al otro peer
        } catch (error) {
            console.error('Error al iniciar la conexión:', error);
        }
    };

    return (
        <div>
            <h2>WebRTC Peer Connection</h2>
            <div>
                <button onClick={startConnection}>Iniciar Conexión</button>
                <p>ICE Connection State: {iceConnectionState}</p>
                <p>Signaling State: {signalingState}</p>
                <h3>Tu video (Local)</h3>
                <video ref={localVideoRef} autoPlay muted></video> {/* El video local no debe tener sonido */}
                <h3>Video del otro usuario (Remoto)</h3>
                <video ref={remoteVideoRef} autoPlay></video>
            </div>
        </div>
    );
};

export default WebRTCComponent;
