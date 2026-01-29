import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField, Box, Typography, Paper } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import SendIcon from '@mui/icons-material/Send'
import server from '../environment';


const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState(false); // FIX: Changed from [] to false

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([])

    let [message, setMessage] = useState("");

    let [newMessages, setNewMessages] = useState(3);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([])

    // FIX: Add dependency array
    useEffect(() => {
        console.log("HELLO")
        getPermissions();
    }, [])

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
            console.log("SET STATE HAS ", video, audio);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [video, audio])
    
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

    // FIX: Replace addStream with addTrack
    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            // Remove old senders
            const senders = connections[id].getSenders();
            senders.forEach(sender => connections[id].removeTrack(sender));

            // Add new tracks
            stream.getTracks().forEach(track => {
                connections[id].addTrack(track, stream);
            });

            connections[id].createOffer().then((description) => {
                console.log(description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            for (let id in connections) {
                // Remove old senders
                const senders = connections[id].getSenders();
                senders.forEach(sender => connections[id].removeTrack(sender));

                // Add new tracks
                window.localStream.getTracks().forEach(track => {
                    connections[id].addTrack(track, window.localStream);
                });

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }

    // FIX: Replace addStream with addTrack
    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            // Remove old senders
            const senders = connections[id].getSenders();
            senders.forEach(sender => connections[id].removeTrack(sender));

            // Add new tracks
            stream.getTracks().forEach(track => {
                connections[id].addTrack(track, stream);
            });

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()
        })
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }

    // FIX: Replace onaddstream with ontrack
    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // FIX: Use ontrack instead of onaddstream
                    connections[socketListId].ontrack = (event) => {
                        console.log("RECEIVED TRACK:", event.track.kind);
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.streams[0] } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.streams[0],
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    // FIX: Replace addStream with addTrack
                    if (window.localStream !== undefined && window.localStream !== null) {
                        window.localStream.getTracks().forEach(track => {
                            connections[socketListId].addTrack(track, window.localStream);
                        });
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        window.localStream.getTracks().forEach(track => {
                            connections[socketListId].addTrack(track, window.localStream);
                        });
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            window.localStream.getTracks().forEach(track => {
                                connections[id2].addTrack(track, window.localStream);
                            });
                        } catch (e) { 
                            console.log(e);
                        }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => {
        setVideo(!video);
    }
    
    let handleAudio = () => {
        setAudio(!audio)
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screen])
    
    let handleScreen = () => {
        setScreen(!screen);
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    // eslint-disable-next-line no-unused-vars
    let openChat = () => {
        setModal(true);
        setNewMessages(0);
    }
    
    // eslint-disable-next-line no-unused-vars
    let closeChat = () => {
        setModal(false);
    }
    
    // eslint-disable-next-line no-unused-vars
    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");
    }

    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }

    return (
        <div>

            {askForUsername === true ?

                <Box sx={{ 
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem'
                }}>
                    <Paper elevation={8} sx={{
                        padding: { xs: '2rem', md: '3rem' },
                        borderRadius: '24px',
                        maxWidth: '500px',
                        width: '100%',
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <Typography variant="h4" sx={{ 
                            fontWeight: 800,
                            marginBottom: '1rem',
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Join Meeting Lobby
                        </Typography>
                        
                        <Typography variant="body1" sx={{ 
                            color: '#636e72',
                            marginBottom: '2rem',
                            fontSize: '1rem'
                        }}>
                            Enter your name to join the video call
                        </Typography>

                        <Box sx={{ 
                            marginBottom: '2rem',
                            background: '#000',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                        }}>
                            <video 
                                ref={localVideoref} 
                                autoPlay 
                                muted
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '300px',
                                    objectFit: 'cover'
                                }}
                            ></video>
                        </Box>

                        <TextField 
                            value={username} 
                            onChange={e => setUsername(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && connect()}
                            placeholder="Enter your name"
                            variant="outlined"
                            fullWidth
                            sx={{
                                marginBottom: '1.5rem',
                                '& .MuiOutlinedInput-root': {
                                    fontSize: '1.1rem',
                                    '& fieldset': {
                                        borderColor: '#dfe6e9',
                                        borderWidth: '2px'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#ff6b6b',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#ff6b6b',
                                    },
                                }
                            }}
                        />
                        
                        <Button 
                            variant="contained" 
                            onClick={connect}
                            fullWidth
                            disabled={!username.trim()}
                            sx={{
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                                padding: '1rem',
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                borderRadius: '12px',
                                textTransform: 'none',
                                boxShadow: '0 8px 25px rgba(255, 107, 107, 0.35)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #ee5a6f 0%, #ff6b6b 100%)',
                                    boxShadow: '0 12px 35px rgba(255, 107, 107, 0.5)',
                                    transform: 'translateY(-2px)',
                                },
                                '&:disabled': {
                                    background: '#ccc',
                                    boxShadow: 'none'
                                }
                            }}
                        >
                            Join Now
                        </Button>
                    </Paper>
                </Box> :


                <div className={styles.meetVideoContainer}>

                    {showModal ? <div className={styles.chatRoom}>

                        <div className={styles.chatContainer}>
                            <Box sx={{ 
                                background: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
                                padding: '1rem',
                                borderRadius: '20px 20px 0 0',
                                marginBottom: '1rem',
                                marginTop: '-1rem',
                                marginLeft: '-1rem',
                                marginRight: '-1rem',
                                
                            }}>
                                <Typography variant="h6" sx={{ 
                                    color: '#fff',
                                    fontWeight: 700,
                                    textAlign: 'center'
                                }}>
                                    Chat
                                </Typography>
                            </Box>

                            <div className={styles.chattingDisplay}>

                                {messages.length !== 0 ? messages.map((item, index) => {

                                    console.log(messages)
                                    const isMe = item.sender === username;
                                    return (
                                        <Box 
                                            key={index}
                                            sx={{ 
                                                marginBottom: '1rem',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: isMe ? 'flex-end' : 'flex-start',
                                                
                                            }}
                                        >
                                            <Typography sx={{ 
                                                fontWeight: 600,
                                                fontSize: '0.85rem',
                                                color: '#636e72',
                                                marginBottom: '0.25rem'
                                            }}>
                                                {item.sender}
                                            </Typography>
                                            <Paper sx={{ 
                                                padding: '0.75rem 1rem',
                                                background: isMe 
                                                    ? 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)' 
                                                    : '#f0f0f0',
                                                color: isMe ? '#fff' : '#2d3436',
                                                borderRadius: isMe 
                                                    ? '12px 12px 2px 12px' 
                                                    : '12px 12px 12px 2px',
                                                maxWidth: '80%',
                                                wordWrap: 'break-word',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                
                                                
                                            }}>
                                                <Typography sx={{ fontSize: '0.95rem' }}>
                                                    {item.data}
                                                </Typography>
                                            </Paper>
                                        </Box>
                                    )
                                }) : <Box sx={{ 
                                    textAlign: 'center',
                                    padding: '2rem',
                                    color: '#999',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100px'
                                }}>
                                    <ChatIcon sx={{ fontSize: '3rem', marginBottom: '1rem' }} />
                                    <Typography>No messages yet. Start the conversation!</Typography>
                            
                                </Box>}


                            </div>

                            <div className={styles.chattingArea}>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                                    <TextField 
                                        value={message} 
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Type a message"
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        maxRows={3}
                                        
                                        
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '& fieldset': {
                                                    borderColor: '#dfe6e9',
                                                },
                                                '&:hover fieldset': {
                                                    borderColor: '#636e72',
                                                },
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#2d3436',
                                                },
                                            }
                                        }}
                                    />
                                    <IconButton 
                                        onClick={sendMessage}
                                        disabled={!message.trim()}
                                        sx={{
                                            background: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)',
                                            color: '#fff',
                                            padding: '0.75rem',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
                                            },
                                            '&:disabled': {
                                                background: '#ccc',
                                                color: '#999'
                                            }
                                        }}
                                    >
                                        <SendIcon />
                                    </IconButton>
                                </Box>
                            </div>


                        </div>
                    </div> : <></>}


                    <div className={styles.buttonContainers}>
                        <IconButton 
                            onClick={handleVideo}
                            sx={{
                                backgroundColor: video ? 'rgba(255, 255, 255, 0.25)' : 'rgba(231, 76, 60, 0.9)',
                                color: '#fff',
                                margin: '0 0.5rem',
                                padding: '1rem',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                    backgroundColor: video ? 'rgba(255, 255, 255, 0.35)' : 'rgba(231, 76, 60, 1)',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                }
                            }}
                        >
                            {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton 
                            onClick={handleEndCall}
                            sx={{
                                backgroundColor: '#e74c3c',
                                color: '#fff',
                                margin: '0 0.5rem',
                                padding: '1.2rem',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: '#c0392b',
                                    transform: 'scale(1.15) translateY(-3px)',
                                    boxShadow: '0 8px 20px rgba(231, 76, 60, 0.5)'
                                }
                            }}
                        >
                            <CallEndIcon  />
                        </IconButton>
                        <IconButton 
                            onClick={handleAudio}
                            sx={{
                                backgroundColor: audio ? 'rgba(255, 255, 255, 0.25)' : 'rgba(231, 76, 60, 0.9)',
                                color: '#fff',
                                margin: '0 0.5rem',
                                padding: '1rem',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                    backgroundColor: audio ? 'rgba(255, 255, 255, 0.35)' : 'rgba(231, 76, 60, 1)',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                }
                            }}
                        >
                            {audio === true ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        {screenAvailable === true ?
                            <IconButton 
                                onClick={handleScreen}
                                sx={{
                                    backgroundColor: screen ? 'rgba(46, 213, 115, 0.9)' : 'rgba(255, 255, 255, 0.25)',
                                    color: '#fff',
                                    margin: '0 0.5rem',
                                    padding: '1rem',
                                    transition: 'all 0.3s ease',
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': {
                                        backgroundColor: screen ? 'rgba(46, 213, 115, 1)' : 'rgba(255, 255, 255, 0.35)',
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                    }
                                }}
                            >
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton> : <></>}

                        <Badge badgeContent={newMessages} max={999} color='error'>
                            <IconButton 
                                onClick={() => setModal(!showModal)}
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                    color: '#fff',
                                    margin: '0 0.5rem',
                                    padding: '1rem',
                                    transition: 'all 0.3s ease',
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.35)',
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                    }
                                }}
                            >
                                <ChatIcon />
                            </IconButton>
                        </Badge>

                    </div>


                    <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted></video>

                    <div className={styles.conferenceView}>
                        {videos.map((video) => (
                            <div key={video.socketId}>
                                <video
                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                        }
                                    }}
                                    autoPlay
                                    playsInline
                                >
                                </video>
                            </div>

                        ))}

                    </div>

                </div>

            }

        </div>
    )
}

