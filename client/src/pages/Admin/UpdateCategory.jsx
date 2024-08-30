import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from "../../context/Auth";

const UpdateCategory = ({ handleUpdateModal, GetCategory }) => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [picture, setPicture] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { auth } = useAuth();

    useEffect(() => {
        // Fetch the stored values from localStorage
        setId(localStorage.getItem('id') || '');
        setName(localStorage.getItem('name') || '');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('name', name);
        if (picture) {
            formData.append('picture', picture);
        }

        try {
            const response = await axios.put(`http://localhost:9000/api/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': auth?.token
                },
            });

            if (response.data.success) {
                alert('Category updated successfully.');
                handleUpdateModal(); // Close the modal on success
                GetCategory()
            } else {
                setError('Failed to update category.');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            setError('An error occurred while updating the category.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center'>
            <div className='relative bg-white p-6 rounded-md w-96'>
                <button
                    className='absolute top-2 right-2 text-2xl text-black'
                    onClick={handleUpdateModal}
                >
                    x
                </button>
                <h2 className='text-xl font-semibold mb-4'>Update Category</h2>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                            Category Name
                        </label>
                        <input
                            id='name'
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='picture' className='block text-sm font-medium text-gray-700'>
                            Picture
                        </label>
                        <input
                            id='picture'
                            type='file'
                            accept='image/*'
                            onChange={(e) => setPicture(e.target.files[0])}
                            className='mt-1 block w-full text-sm text-gray-500'
                        />
                    </div>
                    <button
                        type='submit'
                        className='w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center'
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0 8 8 0 01-16 0z"></path>
                                </svg>
                                Updating...
                            </>
                        ) : (
                            'Update'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateCategory;
