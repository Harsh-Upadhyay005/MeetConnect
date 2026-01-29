import React, { useEffect, useRef, useState, useCallback } from 'react'
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
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import server from '../environment';


const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" },
        { "urls": "stun:stun1.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent() {

    const socketRef = useRef();
    const socketIdRef = useRef();
    const localVideoref = useRef();
    const videoRef = useRef([]);
    const isAdmin = useRef(false);

    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);
    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);
    const [screen, setScreen] = useState(false);
    const [showModal, setModal] = useState(false);
    const [screenAvailable, setScreenAvailable] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [newMessages, setNewMessages] = useState(0);
    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState("");
    const [meetingId, setMeetingId] = useState("");
    const [copySuccess, setCopySuccess] = useState(false);
    const [videos, setVideos] = useState([]);

    // Helper functions - defined first
    const silence = useCallback(() => {
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        ctx.resume();
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
    }, []);

    const black = useCallback(({ width = 640, height = 480 } = {}) => {
        const canvas = Object.assign(document.createElement("canvas"), { width, height });
        canvas.getContext('2d').fillRect(0, 0, width, height);
        const stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false });
    }, []);

    const getPermissions = useCallback(async () => {
        try {
            const userMediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            if (userMediaStream) {
                setVideoAvailable(true);
                setAudioAvailable(true);
                window.localStream = userMediaStream;

                if (localVideoref.current) {
                    localVideoref.current.srcObject = userMediaStream;
                }

                console.log('Video and Audio permissions granted');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            }
        } catch (error) {
            console.error('Error getting permissions:', error);
            setVideoAvailable(false);
            setAudioAvailable(false);
        }
    }, []);

    // Initialize meeting ID and permissions
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlMeetingId = urlParams.get('meeting');

        if (urlMeetingId) {
            setMeetingId(urlMeetingId);
            isAdmin.current = false;
        } else {
            const generatedId = Math.random().toString(36).substring(2, 15);
            setMeetingId(generatedId);
            isAdmin.current = true;
        }

        getPermissions();
    }, [getPermissions]);

    const addMessage = useCallback((data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    }, []);

    const gotMessageFromServer = useCallback((fromId, message) => {
        const signal = JSON.parse(message);

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }));
                            }).catch(e => console.log(e));
                        }).catch(e => console.log(e));
                    }
                }).catch(e => console.log(e));
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
            }
        }
    }, []);

    const connectToSocketServer = useCallback(() => {
        socketRef.current = io.connect(server_url, { secure: false });

        socketRef.current.on('signal', gotMessageFromServer);

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', meetingId);
            socketIdRef.current = socketRef.current.id;

            socketRef.current.on('chat-message', addMessage);

            socketRef.current.on('user-left', (id) => {
                console.log('User left:', id);
                if (connections[id]) {
                    connections[id].close();
                    delete connections[id];
                }
                setVideos((videos) => videos.filter((video) => video.socketId !== id));
            });

            socketRef.current.on('user-joined', (id, clients) => {
                console.log('User joined. My ID:', id, 'All clients:', clients);

                clients.forEach((socketListId) => {
                    if (socketListId === socketIdRef.current) return;

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

                    // ICE candidate handler
                    connections[socketListId].onicecandidate = (event) => {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
                        }
                    };

                    // Track handler (replaces deprecated onaddstream)
                    connections[socketListId].ontrack = (event) => {
                        console.log("RECEIVED TRACK:", event.track.kind, "from", socketListId);

                        const videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("UPDATING EXISTING VIDEO");
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.streams[0] } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            console.log("CREATING NEW VIDEO");
                            const newVideo = {
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

                    // Add local stream tracks
                    if (window.localStream) {
                        window.localStream.getTracks().forEach(track => {
                            console.log(`Adding local ${track.kind} track to peer ${socketListId}`);
                            connections[socketListId].addTrack(track, window.localStream);
                        });
                    } else {
                        console.warn('No local stream available, creating black silence');
                        const blackSilenceStream = new MediaStream([black(), silence()]);
                        window.localStream = blackSilenceStream;
                        window.localStream.getTracks().forEach(track => {
                            connections[socketListId].addTrack(track, window.localStream);
                        });
                    }
                });

                // Create offers if I just joined
                if (id === socketIdRef.current) {
                    for (const id2 in connections) {
                        if (id2 === socketIdRef.current) continue;

                        console.log('Creating offer for:', id2);

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }));
                                })
                                .catch(e => console.log(e));
                        }).catch(e => console.log(e));
                    }
                }
            });
        });
    }, [meetingId, gotMessageFromServer, addMessage, black, silence]);

    const getUserMediaSuccess = useCallback((stream) => {
        try {
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
            }
        } catch (e) { console.log(e); }

        window.localStream = stream;
        localVideoref.current.srcObject = stream;

        for (const id in connections) {
            if (id === socketIdRef.current) continue;

            // Remove old tracks
            const senders = connections[id].getSenders();
            senders.forEach(sender => {
                if (sender.track) {
                    connections[id].removeTrack(sender);
                }
            });

            // Add new tracks
            stream.getTracks().forEach(track => {
                console.log(`Adding ${track.kind} track to peer ${id}`);
                connections[id].addTrack(track, stream);
            });

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                    })
                    .catch(e => console.log(e));
            });
        }

        stream.getTracks().forEach(track => {
            track.onended = () => {
                setVideo(false);
                setAudio(false);

                try {
                    const tracks = localVideoref.current.srcObject.getTracks();
                    tracks.forEach(track => track.stop());
                } catch (e) { console.log(e); }

                const blackSilenceStream = new MediaStream([black(), silence()]);
                window.localStream = blackSilenceStream;
                localVideoref.current.srcObject = window.localStream;

                for (const id in connections) {
                    const senders = connections[id].getSenders();
                    senders.forEach(sender => {
                        if (sender.track) {
                            connections[id].removeTrack(sender);
                        }
                    });

                    window.localStream.getTracks().forEach(track => {
                        connections[id].addTrack(track, window.localStream);
                    });

                    connections[id].createOffer().then((description) => {
                        connections[id].setLocalDescription(description)
                            .then(() => {
                                socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                            })
                            .catch(e => console.log(e));
                    });
                }
            };
        });
    }, [black, silence]);

    const getUserMedia = useCallback(() => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .catch((e) => console.log(e));
        } else {
            try {
                const tracks = localVideoref.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            } catch (e) { }
        }
    }, [video, audio, videoAvailable, audioAvailable, getUserMediaSuccess]);

    useEffect(() => {
        if (video !== undefined && audio !== undefined && !askForUsername) {
            getUserMedia();
        }
    }, [video, audio, askForUsername, getUserMedia]);

    const getDisplayMediaSuccess = useCallback((stream) => {
        try {
            if (window.localStream) {
                window.localStream.getTracks().forEach(track => track.stop());
            }
        } catch (e) { console.log(e); }

        window.localStream = stream;
        localVideoref.current.srcObject = stream;

        for (const id in connections) {
            if (id === socketIdRef.current) continue;

            const senders = connections[id].getSenders();
            senders.forEach(sender => {
                if (sender.track) {
                    connections[id].removeTrack(sender);
                }
            });

            stream.getTracks().forEach(track => {
                connections[id].addTrack(track, stream);
            });

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
                    })
                    .catch(e => console.log(e));
            });
        }

        stream.getTracks().forEach(track => {
            track.onended = () => {
                setScreen(false);
                getUserMedia();
            };
        });
    }, [getUserMedia]);

    const getDisplayMedia = useCallback(() => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDisplayMediaSuccess)
                    .catch((e) => console.log(e));
            }
        }
    }, [screen, getDisplayMediaSuccess]);

    useEffect(() => {
        if (screen !== undefined && screen === true) {
            getDisplayMedia();
        }
    }, [screen, getDisplayMedia]);

    const getMedia = useCallback(() => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }, [videoAvailable, audioAvailable, connectToSocketServer]);

    const handleVideo = () => {
        setVideo(!video);
    };

    const handleAudio = () => {
        setAudio(!audio);
    };

    const handleScreen = () => {
        setScreen(!screen);
    };

    const handleEndCall = () => {
        try {
            const tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        } catch (e) { }

        for (const id in connections) {
            connections[id].close();
        }
        connections = {};

        window.location.href = "/";
    };

    const sendMessage = () => {
        if (message.trim()) {
            socketRef.current.emit('chat-message', message, username);
            setMessage("");
        }
    };

    const connect = () => {
        setAskForUsername(false);
        getMedia();
    };

    const copyMeetingId = () => {
        const meetingUrl = `${window.location.origin}${window.location.pathname}?meeting=${meetingId}`;
        navigator.clipboard.writeText(meetingUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    return (
        <div>
            {askForUsername === true ? (
                <Box sx={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: { xs: '1rem', md: '2rem' }
                }}>
                    <Paper elevation={8} sx={{
                        padding: { xs: '1.5rem', sm: '2rem', md: '3rem' },
                        borderRadius: '24px',
                        maxWidth: '600px',
                        width: '100%',
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <Typography variant="h4" sx={{
                            fontWeight: 800,
                            marginBottom: '1rem',
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            {isAdmin.current ? 'Create Meeting' : 'Join Meeting'}
                        </Typography>

                        <Typography variant="body1" sx={{
                            color: '#636e72',
                            marginBottom: '2rem',
                            fontSize: { xs: '0.9rem', sm: '1rem' }
                        }}>
                            {isAdmin.current
                                ? 'Share the meeting link with others to invite them'
                                : 'Enter your name to join the video call'
                            }
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
                                playsInline
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '300px',
                                    objectFit: 'cover'
                                }}
                            ></video>
                        </Box>

                        {isAdmin.current && (
                            <Box sx={{
                                marginBottom: '1.5rem',
                                padding: '1rem',
                                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                flexDirection: { xs: 'column', sm: 'row' }
                            }}>
                                <Typography sx={{
                                    flex: 1,
                                    fontWeight: 600,
                                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                                    wordBreak: 'break-all'
                                }}>
                                    Meeting ID: {meetingId}
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<ContentCopyIcon />}
                                    onClick={copyMeetingId}
                                    sx={{
                                        background: copySuccess
                                            ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                        padding: { xs: '0.5rem 1rem', sm: '0.5rem 1.5rem' },
                                        minWidth: { xs: '100%', sm: 'auto' }
                                    }}
                                >
                                    {copySuccess ? 'Copied!' : 'Copy Link'}
                                </Button>
                            </Box>
                        )}

                        <TextField
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && username.trim() && connect()}
                            placeholder="Enter your name"
                            variant="outlined"
                            fullWidth
                            sx={{
                                marginBottom: '1.5rem',
                                '& .MuiOutlinedInput-root': {
                                    fontSize: { xs: '0.95rem', sm: '1.1rem' },
                                    '& fieldset': {
                                        borderColor: '#dfe6e9',
                                        borderWidth: '2px'
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#667eea',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#667eea',
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
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                padding: { xs: '0.875rem', sm: '1rem' },
                                fontSize: { xs: '1rem', sm: '1.1rem' },
                                fontWeight: 700,
                                borderRadius: '12px',
                                textTransform: 'none',
                                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.35)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                    boxShadow: '0 12px 35px rgba(102, 126, 234, 0.5)',
                                    transform: 'translateY(-2px)',
                                },
                                '&:disabled': {
                                    background: '#ccc',
                                    boxShadow: 'none'
                                }
                            }}
                        >
                            {isAdmin.current ? 'Start Meeting' : 'Join Now'}
                        </Button>
                    </Paper>
                </Box>
            ) : (
                <div className={styles.meetVideoContainer}>
                    {showModal && (
                        <div className={styles.chatRoom}>
                            <div className={styles.chatContainer}>
                                <Box sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                                        textAlign: 'center',
                                        fontSize: { xs: '1rem', sm: '1.25rem' }
                                    }}>
                                        Chat
                                    </Typography>
                                </Box>

                                <div className={styles.chattingDisplay}>
                                    {messages.length !== 0 ? messages.map((item, index) => {
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
                                                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                                    color: '#636e72',
                                                    marginBottom: '0.25rem'
                                                }}>
                                                    {item.sender}
                                                </Typography>
                                                <Paper sx={{
                                                    padding: { xs: '0.6rem 0.875rem', sm: '0.75rem 1rem' },
                                                    background: isMe
                                                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                        : '#f0f0f0',
                                                    color: isMe ? '#fff' : '#2d3436',
                                                    borderRadius: isMe
                                                        ? '12px 12px 2px 12px'
                                                        : '12px 12px 12px 2px',
                                                    maxWidth: '80%',
                                                    wordWrap: 'break-word',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                }}>
                                                    <Typography sx={{ fontSize: { xs: '0.85rem', sm: '0.95rem' } }}>
                                                        {item.data}
                                                    </Typography>
                                                </Paper>
                                            </Box>
                                        );
                                    }) : (
                                        <Box sx={{
                                            textAlign: 'center',
                                            padding: '2rem',
                                            color: '#999',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            height: '100px'
                                        }}>
                                            <ChatIcon sx={{ fontSize: { xs: '2rem', sm: '3rem' }, marginBottom: '1rem' }} />
                                            <Typography sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                                                No messages yet. Start the conversation!
                                            </Typography>
                                        </Box>
                                    )}
                                </div>

                                <div className={styles.chattingArea}>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                                        <TextField
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                            placeholder="Type a message"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            maxRows={3}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    fontSize: { xs: '0.85rem', sm: '1rem' },
                                                    '& fieldset': {
                                                        borderColor: '#dfe6e9',
                                                    },
                                                    '&:hover fieldset': {
                                                        borderColor: '#667eea',
                                                    },
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#667eea',
                                                    },
                                                }
                                            }}
                                        />
                                        <IconButton
                                            onClick={sendMessage}
                                            disabled={!message.trim()}
                                            sx={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: '#fff',
                                                padding: { xs: '0.6rem', sm: '0.75rem' },
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                                },
                                                '&:disabled': {
                                                    background: '#ccc',
                                                    color: '#999'
                                                }
                                            }}
                                        >
                                            <SendIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
                                        </IconButton>
                                    </Box>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.buttonContainers}>
                        <IconButton
                            onClick={handleVideo}
                            sx={{
                                backgroundColor: video ? 'rgba(255, 255, 255, 0.25)' : 'rgba(231, 76, 60, 0.9)',
                                color: '#fff',
                                margin: { xs: '0 0.25rem', sm: '0 0.5rem' },
                                padding: { xs: '0.75rem', sm: '1rem' },
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                    backgroundColor: video ? 'rgba(255, 255, 255, 0.35)' : 'rgba(231, 76, 60, 1)',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                }
                            }}
                        >
                            {video ? <VideocamIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} /> : <VideocamOffIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />}
                        </IconButton>

                        <IconButton
                            onClick={handleEndCall}
                            sx={{
                                backgroundColor: '#e74c3c',
                                color: '#fff',
                                margin: { xs: '0 0.25rem', sm: '0 0.5rem' },
                                padding: { xs: '0.875rem', sm: '1.2rem' },
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: '#c0392b',
                                    transform: 'scale(1.15) translateY(-3px)',
                                    boxShadow: '0 8px 20px rgba(231, 76, 60, 0.5)'
                                }
                            }}
                        >
                            <CallEndIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' } }} />
                        </IconButton>

                        <IconButton
                            onClick={handleAudio}
                            sx={{
                                backgroundColor: audio ? 'rgba(255, 255, 255, 0.25)' : 'rgba(231, 76, 60, 0.9)',
                                color: '#fff',
                                margin: { xs: '0 0.25rem', sm: '0 0.5rem' },
                                padding: { xs: '0.75rem', sm: '1rem' },
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                    backgroundColor: audio ? 'rgba(255, 255, 255, 0.35)' : 'rgba(231, 76, 60, 1)',
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                }
                            }}
                        >
                            {audio ? <MicIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} /> : <MicOffIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />}
                        </IconButton>

                        {screenAvailable && (
                            <IconButton
                                onClick={handleScreen}
                                sx={{
                                    backgroundColor: screen ? 'rgba(46, 213, 115, 0.9)' : 'rgba(255, 255, 255, 0.25)',
                                    color: '#fff',
                                    margin: { xs: '0 0.25rem', sm: '0 0.5rem' },
                                    padding: { xs: '0.75rem', sm: '1rem' },
                                    transition: 'all 0.3s ease',
                                    backdropFilter: 'blur(10px)',
                                    display: { xs: 'none', sm: 'inline-flex' },
                                    '&:hover': {
                                        backgroundColor: screen ? 'rgba(46, 213, 115, 1)' : 'rgba(255, 255, 255, 0.35)',
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                    }
                                }}
                            >
                                {screen ? <StopScreenShareIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} /> : <ScreenShareIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />}
                            </IconButton>
                        )}

                        <Badge badgeContent={newMessages} max={999} color='error'>
                            <IconButton
                                onClick={() => {
                                    setModal(!showModal);
                                    if (!showModal) setNewMessages(0);
                                }}
                                sx={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                    color: '#fff',
                                    margin: { xs: '0 0.25rem', sm: '0 0.5rem' },
                                    padding: { xs: '0.75rem', sm: '1rem' },
                                    transition: 'all 0.3s ease',
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.35)',
                                        transform: 'translateY(-3px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                    }
                                }}
                            >
                                <ChatIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                            </IconButton>
                        </Badge>
                    </div>

                    <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted playsInline></video>

                    <div className={styles.conferenceView}>
                        {videos.map((video) => (
                            <div key={video.socketId} style={{ position: 'relative' }}>
                                <video
                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream;
                                            ref.play().catch(e => console.log('Play error:', e));
                                        }
                                    }}
                                    autoPlay
                                    playsInline
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}