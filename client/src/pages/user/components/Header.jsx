import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/Auth';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    // State to manage dropdown visibility
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();  // Hook to programmatically navigate
    const dropdownRef = useRef(null); // Ref to manage clicks outside dropdown

    // Toggle dropdown visibility
    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    // Close dropdown
    const closeDropdown = () => setDropdownOpen(false);

    // Handle logout
    const handleLogout = () => {
        // Remove token from local storage
        localStorage.removeItem('authToken'); // Adjust based on your token storage
        // Update authentication context
        setAuth(null);
        // Redirect to login page or home
        navigate('/signIn'); // Adjust the route as needed
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="bg-gray-800 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Logo Section */}
                <div className="text-2xl font-bold">
                    <a href="/" className="hover:text-gray-400">MyLogo</a>
                </div>

                {/* Navigation and Search Section */}
                <div className="flex items-center space-x-6">
                    {/* Search Input */}
                    <div className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-gray-700 text-white px-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        />
                    </div>
                    {/* Navigation Links */}
                    <nav className="hidden md:flex space-x-6">
                        <a href="/" className="hover:text-gray-400">Home</a>
                        <a href="/about" className="hover:text-gray-400">About</a>
                        <a href="/services" className="hover:text-gray-400">Services</a>
                        <a href="/contact" className="hover:text-gray-400">Contact</a>
                    </nav>
                </div>

                {/* User Profile Section */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-full hover:bg-gray-600 focus:outline-none"
                        onClick={toggleDropdown}
                        aria-haspopup="true"
                        aria-expanded={isDropdownOpen}
                    >
                        <img src="https://via.placeholder.com/40" alt="Profile" className="w-8 h-8 rounded-full" />
                        <span className="hidden md:inline">{auth?.user?.name || 'Username'}</span>
                    </button>
                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute z-20 right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg">
                            {auth?.user ? (
                                <>
                                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={closeDropdown}>Profile</Link>
                                    <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100" onClick={closeDropdown}>Settings</Link>
                                    <a
                                        href="/signIn"
                                        className="block px-4 py-2 hover:bg-gray-100"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent default link behavior
                                            handleLogout(); // Call logout function
                                        }}
                                    >
                                        Logout
                                    </a>
                                </>
                            ) : (
                                <>
                                    <Link to="/signUp" className="block px-4 py-2 hover:bg-gray-100" onClick={closeDropdown}>SignUp</Link>
                                    <Link to="/signIn" className="block px-4 py-2 hover:bg-gray-100" onClick={closeDropdown}>SignIn</Link>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
