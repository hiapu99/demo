import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

import AllProduct from './AllProduct';

const AdminDashboard = () => {
    const [activeButton, setActiveButton] = useState(null);

    // const toggleProductsDropdown = () => {
    //     setShowProductsDropdown(!showProductsDropdown);
    //     setActiveButton("products");
    // }

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar (20% width) */}
            <aside className="w-[20%] bg-white shadow-lg h-screen p-4 fixed">
                <h2 className="text-2xl font-bold mb-6 text-gray-700">Admin Panel</h2>
                <ul className="space-y-4">
                    <li>
                        <Link
                            to="/admin/create-category"
                            className={`block text-lg text-gray-600 hover:border hover:border-gray-300 transition-colors duration-200 rounded ${activeButton === "create-category" ? "border-indigo-500 text-indigo-600" : ""
                                }`}
                            onClick={() => handleButtonClick("create-category")}
                        >
                            Create Category
                        </Link>
                        <Link
                            to="/admin/all-category"
                            className={`block text-lg text-gray-600 hover:border hover:border-gray-300 transition-colors duration-200 rounded ${activeButton === "create-category" ? "border-indigo-500 text-indigo-600" : ""
                                }`}
                            onClick={() => handleButtonClick("create-category")}
                        >
                            All Category
                        </Link>
                        <Link
                            to="/admin/create-product"
                            className={`block text-lg text-gray-600 hover:border hover:border-gray-300 transition-colors duration-200 rounded ${activeButton === "create-category" ? "border-indigo-500 text-indigo-600" : ""
                                }`}
                            onClick={() => handleButtonClick("create-category")}
                        >
                            Create Product
                        </Link>
                        <Link
                            to="/admin/all-product"
                            className={`block text-lg text-gray-600 hover:border hover:border-gray-300 transition-colors duration-200 rounded ${activeButton === "create-category" ? "border-indigo-500 text-indigo-600" : ""
                                }`}
                            onClick={() => handleButtonClick("create-category")}
                        >
                            All Product
                        </Link>
                    </li>
                    {/* Other sidebar links */}
                </ul>
            </aside>

            {/* Main Content (80% width) */}
            <main className="w-[80%] p-8 bg-gray-50 ml-[20%] h-screen overflow-y-auto">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <Outlet />
                    <AllProduct />
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;
