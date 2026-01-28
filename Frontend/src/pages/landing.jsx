import React from 'react'
import "../App.css"
import { useNavigate } from 'react-router-dom'
import { Box, Button, Grid, Typography, Container } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import VideocamIcon from '@mui/icons-material/Videocam'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function LandingPage() {

    const router = useNavigate();

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Navigation Bar */}
            <Box sx={{
                backgroundColor: 'rgba(26, 26, 46, 0.95)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                padding: { xs: '1rem 1.5rem', md: '1.2rem 3rem' },
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h5" sx={{ 
                    fontWeight: 700,
                    color: '#ffffff',
                    fontSize: { xs: '1.3rem', md: '1.8rem' },
                    letterSpacing: '-0.5px'
                }}>
                    Meet<span style={{ color: '#66F4FF' }}>Connect</span>
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                    <Button 
                        startIcon={<VideocamIcon />}
                        onClick={() => router("/aljk23")}
                        sx={{ 
                            color: '#7D99AA',
                            fontWeight: 500,
                            textTransform: 'none',
                            fontSize: { xs: '0.85rem', md: '0.95rem' },
                            display: { xs: 'none', sm: 'flex' },
                            '&:hover': { 
                                backgroundColor: 'rgba(102, 244, 255, 0.1)',
                                color: '#66F4FF',
                                transition: 'all 0.3s ease'
                            }
                        }}
                    >
                        Join as Guest
                    </Button>
                    <Button 
                        startIcon={<PersonAddIcon />}
                        onClick={() => router("/auth")}
                        sx={{ 
                            color: '#7D99AA',
                            fontWeight: 500,
                            textTransform: 'none',
                            fontSize: { xs: '0.85rem', md: '0.95rem' },
                            '&:hover': { 
                                backgroundColor: 'rgba(102, 244, 255, 0.1)',
                                color: '#66F4FF',
                                transition: 'all 0.3s ease'
                            }
                        }}
                    >
                        Register
                    </Button>
                    <Button 
                        startIcon={<LoginIcon />}
                        onClick={() => router("/auth")}
                        variant="contained"
                        sx={{ 
                            background: 'linear-gradient(135deg, #FFC067 0%, #66C4FF 100%)',
                            color: '#1a1a2e',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: { xs: '0.85rem', md: '0.95rem' },
                            boxShadow: '0 2px 8px rgba(255, 192, 103, 0.35)',
                            '&:hover': { 
                                background: 'linear-gradient(135deg, #FFD08A 0%, #88D4FF 100%)',
                                boxShadow: '0 4px 12px rgba(255, 192, 103, 0.5)',
                                transition: 'all 0.3s ease'
                            }
                        }}
                    >
                        Login
                    </Button>
                </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ 
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                padding: { xs: '3rem 1rem', md: '4rem 2rem' }
            }}>
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        {/* Left Panel - Content */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                animation: 'slideInLeft 0.8s ease-out',
                                '@keyframes slideInLeft': {
                                    '0%': { opacity: 0, transform: 'translateX(-30px)' },
                                    '100%': { opacity: 1, transform: 'translateX(0)' }
                                }
                            }}>
                                <Typography variant="h2" sx={{ 
                                    fontWeight: 700,
                                    marginBottom: '1.5rem',
                                    color: '#ffffff',
                                    fontSize: { xs: '2.5rem', md: '3.2rem' },
                                    lineHeight: 1.2
                                }}>
                                    Connect with Your
                                    <span style={{ 
                                        background: 'linear-gradient(90deg, #FFC067, #66F4FF)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        display: 'block',
                                        marginTop: '0.3rem'
                                    }}> Loved Ones</span>
                                </Typography>
                                
                                <Typography variant="h6" sx={{ 
                                    color: '#7D99AA',
                                    marginBottom: '2.5rem',
                                    fontSize: { xs: '1.1rem', md: '1.2rem' },
                                    lineHeight: 1.7,
                                    fontWeight: 400
                                }}>
                                    Experience seamless high-quality video calls. Connect with anyone, anywhere, anytime.
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBottom: '3rem' }}>
                                    <Button 
                                        onClick={() => router("/auth")}
                                        variant='contained'
                                        size="large"
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{
                                            background: 'linear-gradient(135deg, #FFC067 0%, #66C4FF 100%)',
                                            color: '#1a1a2e',
                                            padding: '0.9rem 2.2rem',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            borderRadius: '10px',
                                            textTransform: 'none',
                                            boxShadow: '0 4px 12px rgba(255, 192, 103, 0.4)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #FFD08A 0%, #88D4FF 100%)',
                                                boxShadow: '0 6px 18px rgba(255, 192, 103, 0.5)',
                                                transform: 'translateY(-2px)',
                                                transition: 'all 0.3s ease'
                                            }
                                        }}
                                    >
                                        Get Started
                                    </Button>

                                    <Button 
                                        onClick={() => router("/aljk23")}
                                        variant='outlined'
                                        size="large"
                                        startIcon={<VideocamIcon />}
                                        sx={{
                                            borderColor: '#66F4FF',
                                            color: '#66F4FF',
                                            padding: '0.9rem 2.2rem',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            borderRadius: '10px',
                                            textTransform: 'none',
                                            borderWidth: '1.5px',
                                            '&:hover': {
                                                borderColor: '#66C4FF',
                                                backgroundColor: 'rgba(102, 244, 255, 0.1)',
                                                borderWidth: '1.5px',
                                                transform: 'translateY(-2px)',
                                                transition: 'all 0.3s ease'
                                            }
                                        }}
                                    >
                                        Quick Join
                                    </Button>
                                </Box>

                                {/* Feature Highlights */}
                                <Grid container spacing={3}>
                                    <Grid item xs={4}>
                                        <Box sx={{ 
                                            textAlign: 'center',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            backgroundColor: 'rgba(255, 192, 103, 0.1)',
                                            border: '1px solid rgba(255, 192, 103, 0.2)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 192, 103, 0.2)',
                                                transform: 'translateY(-3px)',
                                                boxShadow: '0 8px 20px rgba(255, 192, 103, 0.2)'
                                            }
                                        }}>
                                            <Typography sx={{ 
                                                fontSize: '1.8rem', 
                                                fontWeight: 700, 
                                                color: '#FFC067',
                                                marginBottom: '0.3rem'
                                            }}>
                                                HD
                                            </Typography>
                                            <Typography sx={{ 
                                                color: '#7D99AA', 
                                                fontSize: '0.85rem',
                                                fontWeight: 500 
                                            }}>
                                                Quality
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box sx={{ 
                                            textAlign: 'center',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            backgroundColor: 'rgba(102, 244, 255, 0.1)',
                                            border: '1px solid rgba(102, 244, 255, 0.2)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: 'rgba(102, 244, 255, 0.2)',
                                                transform: 'translateY(-3px)',
                                                boxShadow: '0 8px 20px rgba(102, 244, 255, 0.2)'
                                            }
                                        }}>
                                            <Typography sx={{ 
                                                fontSize: '1.8rem', 
                                                fontWeight: 700, 
                                                color: '#66F4FF',
                                                marginBottom: '0.3rem'
                                            }}>
                                                🔒
                                            </Typography>
                                            <Typography sx={{ 
                                                color: '#7D99AA', 
                                                fontSize: '0.85rem',
                                                fontWeight: 500 
                                            }}>
                                                Secure
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box sx={{ 
                                            textAlign: 'center',
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            backgroundColor: 'rgba(102, 196, 255, 0.1)',
                                            border: '1px solid rgba(102, 196, 255, 0.2)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: 'rgba(102, 196, 255, 0.2)',
                                                transform: 'translateY(-3px)',
                                                boxShadow: '0 8px 20px rgba(102, 196, 255, 0.2)'
                                            }
                                        }}>
                                            <Typography sx={{ 
                                                fontSize: '1.8rem', 
                                                fontWeight: 700, 
                                                color: '#66C4FF',
                                                marginBottom: '0.3rem'
                                            }}>
                                                ⚡
                                            </Typography>
                                            <Typography sx={{ 
                                                color: '#7D99AA', 
                                                fontSize: '0.85rem',
                                                fontWeight: 500 
                                            }}>
                                                Instant
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        {/* Right Panel - Image */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                animation: 'float 4s ease-in-out infinite',
                                '@keyframes float': {
                                    '0%, 100%': { transform: 'translateY(0px)' },
                                    '50%': { transform: 'translateY(-15px)' }
                                }
                            }}>
                                <img 
                                    src="/mobile.png" 
                                    alt="Video Call" 
                                    style={{
                                        maxWidth: '90%',
                                        height: 'auto',
                                        filter: 'drop-shadow(0 10px 25px rgba(102, 244, 255, 0.25))',
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    )
}