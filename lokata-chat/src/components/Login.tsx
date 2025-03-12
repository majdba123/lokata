import React, { useState } from 'react';
import api from '../Api/Api'
import { saveToken, saveUser } from '../Api/User'


interface LoginProps {
    handleIslLogin: (isLoign: boolean) => void
}

const Login = ({ handleIslLogin }: LoginProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('try login')
        try {
            const response = await api.post('/login', { email, password });
            console.log(response.data)
            const { access_token ,user } = response.data;
            console.log("currentuse",user)
            saveToken(access_token);
            saveUser(user.id);

            handleIslLogin(true)
            console.log(access_token)
        } catch (err) {
            setError('Invalid credentials');
        }
    };





    return (
        <div>
            <div>
                <h2>Login</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Login</button>
                </form>
            </div>

        </div>
    );
};

export default Login;
