import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/Auth';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Basic validation
        if (!email || !password) {
            toast.error('Please fill in both fields.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:9000/api/signIn', { email, password });
    
            if (response.data.success) {
                toast.success('Logged in successfully!');
                localStorage.setItem('auth', JSON.stringify(response.data)); // Store auth data in localStorage
                setAuth({
                    ...auth,
                    user: response.data.user,
                    token: response.data.token,
                });
    
                // Navigate based on user role
                if (response.data.user.role === 'admin') {
                    setTimeout(() => {
                        navigate('/admin/dashboard'); // Navigate to admin dashboard
                    }, 1000);
                } else {
                    setTimeout(() => {
                        navigate('/user/dashboard'); // Navigate to user dashboard
                    }, 1000);
                }
            } else {
                toast.error('Invalid email or password.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };
    

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-5 text-center">Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-600">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Sign In
                    </button>
                    <p className='relative mt-4'>I have an account? <Link to="/SignUp" className='text-indigo-600'>Register</Link></p>
                </form>
            </div>
            <Toaster position="top-center" />
        </div>
    );
};

export default SignIn;
