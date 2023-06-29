import React, { useState } from 'react';
import "../signin.css";

const SigninForm = ({ onLoginSuccess, updateLoggedInStatus, isLoggedIn, handleLogout }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = {
            email,
            password
        };

        try {
            const response = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('name', data.name);
                localStorage.setItem('id', data.id);
              
                alert("User logged in successfully");

                setEmail('');
                setPassword('');
                onLoginSuccess();
                updateLoggedInStatus(true);
            } else {
                alert(data.message);
                setEmail('');
                setPassword('');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="signin-form">
            <h2>Log In</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
                <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                <button type="submit">Log In</button>
            </form>
        </div>
    );
};

export default SigninForm;
