import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './pages/user/Pages/SignIn';
import SignUp from './pages/user/Pages/SignUp';
import Dashboard from './pages/user/Pages/Dashboard';
import Private from './pages/Routes/Private';
import AdminRouter from './pages/Routes/AdminRouter';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CreateCategory from './pages/Admin/CreateCategory';
import AllCateGory from './pages/Admin/AllCateGory';
import CreateProduct from './pages/Admin/CreateProduct';
import AllProduct from './pages/Admin/AllProduct';
import Header from './pages/user/components/Header';
import CategoryPage from './pages/user/components/CategoryPage';
import CategoryProduct from './pages/user/components/CategoryProduct';
import ProductDetails from './pages/user/components/ProductDetails';

const App = () => {
  return (
    <BrowserRouter>
      <Header /> {/* Header is placed outside Routes to appear on all pages */}
      <Routes>
        <Route path='/signUp' element={<SignUp />} />
        <Route path='/signIn' element={<SignIn />} />
        <Route path='/user' element={<Private />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='category' element={<CategoryPage />} />
          <Route path='category/:id' element={<CategoryProduct />} /> 
          <Route path='product/:id' element={<ProductDetails />} /> 

        </Route>
        <Route path='/admin' element={<AdminRouter />}>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='create-category' element={<CreateCategory />} />
          <Route path='all-category' element={<AllCateGory />} />
          <Route path='create-product' element={<CreateProduct />} />
          <Route path='all-product' element={<AllProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
