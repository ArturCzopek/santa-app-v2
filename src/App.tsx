import React from 'react';
import Snowfall from 'react-snowfall';
import { useAuth } from './hooks/useAuth';
import {Button} from '@mui/material'

const App: React.FC = () => {
    const { user, signInWithGoogle } = useAuth();

    return (
        <div>
            <Snowfall />
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>Welcome to Santa App V2!</h1>
                <div>
                    {!user ? (
                        <Button variant="contained" color="primary" onClick={signInWithGoogle}>
                            Login with Google
                        </Button>
                    ) : (
                        <div>
                            <p>Welcome, {user.displayName}!</p>
                            <img src={user.photoURL} alt={user.displayName} style={{ width: '50px', borderRadius: '50%' }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
