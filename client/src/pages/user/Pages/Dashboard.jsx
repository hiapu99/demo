import React from 'react';
import { useAuth } from '../../../context/Auth';
import Banner from '../components/Banner';
import Category from '../components/Category';
import Product from '../components/Product';

const Dashboard = () => {
    const { auth } = useAuth();

    return (
        <div>
            {/* Banner Component */}
            <Banner />
            <Category />
            <Product />
        </div>
    );
};

export default Dashboard;
