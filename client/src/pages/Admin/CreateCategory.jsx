import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth';

const CreateCategory = () => {
  const [name, setName] = useState('');
  const [picture, setPicture] = useState(null);
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9000/api/create', { name, picture }, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': auth?.token // Include the JWT token in the Authorization header
        },
      });
      if (response.data.success) {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleImageChange = (e) => {
    setPicture(e.target.files[0]);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create New Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoryName">
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="picture">
            Category Image
          </label>
          <input
            type="file"
            id="picture"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Create Category
        </button>
      </form>
    </div>
  );
}

export default CreateCategory;
