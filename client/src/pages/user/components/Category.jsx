import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/Auth';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom';

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 9,
        partialVisibilityGutter: 40
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 6,
        partialVisibilityGutter: 30
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 4,
        partialVisibilityGutter: 30
    }
};

const Category = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = useAuth();

    const GetCategoryss = async () => {
        try {
            const response = await axios.get('http://localhost:9000/api/get', {
                headers: {
                    'Authorization': `Bearer ${auth?.token}`,
                }
            });
            if (response.data.success) {
                setData(response.data.categories);
            } else {
                setError('Failed to fetch categories');
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError('An error occurred while fetching categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetCategoryss();
    }, [auth?.token]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Categories</h1>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="loader">Loading...</div> {/* Replace with spinner or loader component */}
                </div>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <Carousel
                    swipeable={true}
                    draggable={true}
                    responsive={responsive}
                    ssr={true}
                    infinite={true}
                    autoPlay={true}
                    autoPlaySpeed={5000}
                    keyBoardControl={true}
                    customTransition="all .5"
                    transitionDuration={500}
                    containerClass="carousel-container"
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    dotListClass="custom-dot-list-style"
                    itemClass="carousel-item-padding-20-px"
                >
                    {data.map((category) => (
                        <Link key={category._id} to={`/user/category/${category._id}`} className="p-4 shadow rounded-lg flex flex-col items-center">
                            <div className="bg-gray-200 p-2 rounded-lg mb-2">
                                <img
                                    src={category.picture.secure_url}
                                    alt={category.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                            </div>
                            <h2 className="text-sm text-center font-semibold">{category.name}</h2>
                        </Link>
                    ))}
                </Carousel>
            )}
        </div>
    );
};

export default Category;
