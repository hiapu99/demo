import React, { useEffect, useState } from "react";
import axios from 'axios';
import { format } from "date-fns";
import { useAuth } from "../../context/Auth";
import UpdateCategory from "./UpdateCategory";

const AllCateGory = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = useAuth();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleUpdateModal = () => {
        setShowUpdateModal(!showUpdateModal);
    };

    const GetCategory = async () => {
        try {
            const response = await axios.get('http://localhost:9000/api/get', {
                headers: {
                    'Authorization': auth?.token,
                }
            });
            if (response.data.success) {
                setData(response.data.categories);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to fetch categories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetCategory();
    }, []);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:9000/api/delete/${id}`, {
                headers: {
                    'Authorization': auth?.token,
                }
            });
            if (response.data.success) {
                GetCategory();
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            setError("Failed to delete category.");
        }
    };

    const handleUpdate = (category) => {
        setSelectedCategory(category);
        localStorage.setItem("id", category._id);
        localStorage.setItem("name", category.name);
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
                                <th scope="col" className="px-6 py-3">Category Name</th>
                                <th scope="col" className="px-6 py-3">Added On</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((cate, index) => {
                                    // Ensure `cate.addedOn` is a valid date
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
                                    <td colSpan="4" className="text-center py-4">No categories available.</td>
                                </tr>
                            )}
                            {showUpdateModal && <UpdateCategory category={selectedCategory} handleUpdateModal={handleUpdateModal} GetCategory={GetCategory} />}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AllCateGory;
