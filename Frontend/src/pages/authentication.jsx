import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../Contexts/AuthContext.jsx';
import { Snackbar, Alert } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: '#FF9839',
        },
        secondary: {
            main: '#D97500',
        },
    },
});

export default function Authentication() {

    const [email, setEmail] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState('');
    const [message, setMessage] = React.useState('');

    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);

    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    let handleAuth = async () => {
        try {
            if (formState === 0) {
                // Login with email
                if (!email || !password) {
                    setError("Email and Password are required");
                    return;
                }
                await handleLogin(email, password);
            }
            if (formState === 1) {
                // Register with name, username, email, password
                if (!name || !username || !email || !password) {
                    setError("All fields are required");
                    return;
                }
                let result = await handleRegister(name, username, email, password);
                console.log(result);
                setName("");
                setUsername("");
                setEmail("");
                setPassword("");
                setMessage(result);
                setOpen(true);
                setError("");
                setFormState(0);
            }
        } catch (err) {
            console.log(err);
            let message = err.response?.data?.message || "An error occurred";
            setError(message);
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(/background.png)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            zIndex: 1,
                            color: 'white',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 4,
                        }}
                    >
                        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                            Welcome to <span style={{ color: '#FF9839' }}>MeetConnect</span>
                        </h1>
                        <p style={{ fontSize: '1.5rem', textAlign: 'center', maxWidth: '600px' }}>
                            Connect with your loved ones through seamless video calls and chat
                        </p>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: '#FF9839', width: 56, height: 56 }}>
                            <LockOutlinedIcon sx={{ fontSize: 32 }} />
                        </Avatar>

                        <h2 style={{ marginTop: '1rem', marginBottom: '2rem', color: '#333' }}>
                            {formState === 0 ? 'Sign In to Your Account' : 'Create New Account'}
                        </h2>

                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <Button 
                                variant={formState === 0 ? "contained" : "outlined"} 
                                onClick={() => { 
                                    setFormState(0);
                                    setError('');
                                }}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                }}
                            >
                                Sign In
                            </Button>
                            <Button 
                                variant={formState === 1 ? "contained" : "outlined"} 
                                onClick={() => { 
                                    setFormState(1);
                                    setError('');
                                }}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                }}
                            >
                                Sign Up
                            </Button>
                        </Box>

                        <Box component="form" noValidate sx={{ mt: 1, width: '100%', maxWidth: 400 }}>
                            {formState === 1 && (
                                <>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Full Name"
                                        name="name"
                                        value={name}
                                        autoComplete="name"
                                        autoFocus
                                        onChange={(e) => setName(e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                            }
                                        }}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        value={username}
                                        autoComplete="username"
                                        onChange={(e) => setUsername(e.target.value)}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                            }
                                        }}
                                    />
                                </>
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                value={email}
                                autoComplete="email"
                                autoFocus={formState === 0}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                value={password}
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                id="password"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    }
                                }}
                            />

                            {error && (
                                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ 
                                    mt: 3, 
                                    mb: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    background: 'linear-gradient(45deg, #FF9839 30%, #D97500 90%)',
                                    boxShadow: '0 3px 5px 2px rgba(255, 152, 57, .3)',
                                }}
                                onClick={handleAuth}
                            >
                                {formState === 0 ? "Sign In" : "Create Account"}
                            </Button>

                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                    {formState === 0 
                                        ? "Don't have an account? Click Sign Up above" 
                                        : "Already have an account? Click Sign In above"}
                                </p>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>

        </ThemeProvider>
    );
}