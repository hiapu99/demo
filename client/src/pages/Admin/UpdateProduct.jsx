import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useAuth } from "../../context/Auth";
import debounce from 'lodash/debounce'; // Import debounce

const UpdateProduct = ({ handleUpdateModal, GetCategory }) => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');
    const [categories, setCategories] = useState([]);
    const [picture, setPicture] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { auth } = useAuth();

    useEffect(() => {
        setId(localStorage.getItem('id') || '');
        setName(localStorage.getItem('name') || '');
        setDescription(localStorage.getItem('description') || '');
        setPrice(localStorage.getItem('price') || '');
        setCategory(localStorage.getItem('category') || '');
        setQuantity(localStorage.getItem('quantity') || ''); // Initialize quantity
        GetCategorys(); // Fetch categories from the server
    }, []);

    const GetCategorys = async () => {
        try {
            const response = await axios.get('http://localhost:9000/api/get', {
                headers: {
                    'Authorization': auth?.token,
                }
            });
            console.log('Fetched categories:', response.data.categories); // Debugging output
            if (response.data.success) {
                setCategories(response.data.categories);
            } else {
                setError('Failed to fetch categories.');
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setError("Failed to fetch categories.");
        }
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setCategory(selectedCategory);
        // Call the debounced function
        debouncedSaveCategory(selectedCategory);
    };

    // Debounced function to save the category
    const saveCategory = useCallback(async (categoryId) => {
        if (!categoryId) return;

        try {
            // Update your category saving logic if needed
            localStorage.setItem('category', categoryId);
        } catch (error) {
            console.error("Error saving category:", error);
        }
    }, []);

    const debouncedSaveCategory = useCallback(
        debounce((categoryId) => saveCategory(categoryId), 500), // 500ms delay
        []
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        console.log('Selected category ID:', category); // Debugging output

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('quantity', quantity); // Add quantity to formData
        formData.append('category', category);
        if (picture) {
            formData.append('picture', picture);
        }

        try {
            const response = await axios.put(`http://localhost:9000/api/product/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': auth?.token
                },
            });

            if (response.data.success) {
                alert('Product updated successfully.');
                handleUpdateModal(); // Close the modal on success
                GetCategory(); // Refresh categories if necessary
            } else {
                setError(response.data.msg || 'Failed to update product.');
            }
        } catch (error) {
            console.error('Error updating product:', error.response ? error.response.data : error.message);
            setError('An error occurred while updating the product.');
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
                <h2 className='text-xl font-semibold mb-4'>Update Product</h2>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                            Product Name
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
                        <label htmlFor='description' className='block text-sm font-medium text-gray-700'>
                            Description
                        </label>
                        <textarea
                            id='description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='price' className='block text-sm font-medium text-gray-700'>
                            Price
                        </label>
                        <input
                            id='price'
                            type='number'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='quantity' className='block text-sm font-medium text-gray-700'>
                            Quantity
                        </label>
                        <input
                            id='quantity'
                            type='number'
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='category' className='block text-sm font-medium text-gray-700'>
                            Category
                        </label>
                        <select
                            id='category'
                            value={category}
                            onChange={handleCategoryChange} // Use the debounced change handler
                            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
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

export default UpdateProduct;
