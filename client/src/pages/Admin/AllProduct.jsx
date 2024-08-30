import React, { useEffect, useState } from "react";
import axios from 'axios';
import { format } from "date-fns";
import { useAuth } from "../../context/Auth";
import UpdateProduct from "./UpdateProduct";

const AllProduct = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = useAuth();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleUpdateModal = () => {
        setShowUpdateModal(!showUpdateModal);
        if (!showUpdateModal) {
            localStorage.removeItem("id");
            localStorage.removeItem("name");
            localStorage.removeItem("description");
            localStorage.removeItem("price");
            localStorage.removeItem("category");
        }
    };

    const GetCategory = async () => {
        setError(null);
        try {
            const response = await axios.get('http://localhost:9000/api/product/all', {
                headers: {
                    'Authorization': auth?.token,
                }
            });
            if (response.data.success) {
                setData(response.data.products);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to fetch products.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetCategory();
    }, []);

    const handleDelete = async (id) => {
        setError(null);
        try {
            const response = await axios.delete(`http://localhost:9000/api/product/${id}`, {
                headers: {
                    'Authorization': auth?.token,
                }
            });
            if (response.data.success) {
                GetCategory();
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            setError("Failed to delete product.");
        }
    };

    const handleUpdate = (category) => {
        setSelectedCategory(category);
        localStorage.setItem("id", category._id);
        localStorage.setItem("name", category.name);
        localStorage.setItem("description", category.description);
        localStorage.setItem("price", category.price);
        localStorage.setItem("category",category);
        setShowUpdateModal(true);
    };

    return (
        <div className='container mx-auto mt-10'>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && (
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">SL</th>
                                <th scope="col" className="px-6 py-3">Picture</th>
                                <th scope="col" className="px-6 py-3">Product Name</th>
                                <th scope="col" className="px-6 py-3">Selling Price (BDT)</th>
                                <th scope="col" className="px-6 py-3">Quantity</th>
                                <th scope="col" className="px-6 py-3">Added On</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((cate, index) => {
                                    const date = new Date(cate.addedOn);
                                    const formattedDate = isNaN(date.getTime()) ? "Invalid date" : format(date, 'MMMM dd, yyyy');

                                    return (
                                        <tr
                                            key={cate._id}
                                            className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800'
                                        >
                                            <td className="px-6 py-4">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <img src={cate.picture.secure_url} alt={cate.name} className="w-10 h-10 object-cover rounded" />
                                            </td>
                                            <td className="px-6 py-4">
                                                {cate.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                {cate.price}
                                            </td>
                                            <td className="px-6 py-4">
                                                {cate.quantity}
                                            </td>
                                            <td className="px-6 py-4">{formattedDate}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleUpdate(cate)}
                                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cate._id)}
                                                    className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">No products available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {showUpdateModal && (
                        // Move the UpdateProduct component outside the tbody
                        <UpdateProduct
                            category={selectedCategory}
                            handleUpdateModal={handleUpdateModal}
                            GetCategory={GetCategory}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default AllProduct;
