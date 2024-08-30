import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Product = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const GetCategory = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:9000/api/product/all', {
      });
      if (response.data.success) {
        setData(response.data.products);
      } else {
        setError("Failed to fetch products.");
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

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {data.map(product => (
          <li key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Product;
