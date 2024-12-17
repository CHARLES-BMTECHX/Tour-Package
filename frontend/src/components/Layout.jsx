import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="d-flex bg-white flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 scrollable-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export default Layout;