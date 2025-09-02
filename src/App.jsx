import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socket from './socket/socket.js'; // ✅ Import your socket instance
import ProfilePage from './pages/ProfilePage.jsx';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/general/Home';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import CreateGroup from './pages/CreateGroup';
import GroupList from './pages/GroupList';
import GroupDetails from './pages/GroupDetail';
import AddExpensePage from './pages/AddExpensePage';
import JoinGroupPage from './pages/JoinGroupPage';
import GroupExpensesPage from './pages/GroupExpensesPage';
import MyExpensesPage from './pages/MyExpensesPage';
import Feedback from './pages/general/Feedback';
import Contact from './pages/general/Contact';
import About from './pages/general/About';
import ResetPassword from './pages/auth/ResetPassword';
import NotificationPage from './pages/NotificationPage';
import ExpenseInsights from './pages/ExpenseInsights';
import NotificationHandler from './components/NotificationHandler.jsx';

const App = () => {
  const { user } = useSelector((state) => state.auth); // ⬅️ assuming your Redux has `auth.user`

  return (
    <Router>
      <>
   {/* Tumhare routes */}
     <ToastContainer/>
  

         <NotificationHandler />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />

            <Route
              path="dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="group/create"
              element={
                <PrivateRoute>
                  <CreateGroup />
                </PrivateRoute>
              }
            />
            <Route
              path="grouplist"
              element={
                <PrivateRoute>
                  <GroupList />
                </PrivateRoute>
              }
            />
            <Route
              path="group/:groupId"
              element={
                <PrivateRoute>
                  <GroupDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="expense/add/:groupId"
              element={
                <PrivateRoute>
                  <AddExpensePage />
                </PrivateRoute>
              }
            />
            <Route
              path="group/join/:groupId"
              element={
                <PrivateRoute>
                  <JoinGroupPage />
                </PrivateRoute>
              }
            />
            <Route
              path="group/expense/:groupId"
              element={
                <PrivateRoute>
                  <GroupExpensesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="my-expenses"
              element={
                <PrivateRoute>
                  <MyExpensesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="notifications"
              element={
                <PrivateRoute>
                  <NotificationPage />
                </PrivateRoute>
              }
            />
            <Route
              path="expense-insight"
              element={
                <PrivateRoute>
                  <ExpenseInsights />
                </PrivateRoute>
              }
            />
              <Route
              path="profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </>
    </Router>
  );
};

export default App;
