// components/Layout.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import ChatBotWidget from "./ChatBotWidget";


const Layout = () => {
  return (
    <div>
      <Header />
      <main style={{ minHeight: '80vh' }}>
        <Outlet />
      </main>
       <ChatBotWidget />
      <Footer />
    </div>
  );
};

export default Layout;
