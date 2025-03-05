import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { GlobalProvider } from "../Provider/GlobalContext";
import ErrorPage from "../Pages/Error/ErrorPage";
import SignIn from "../Pages/Auth/SignIn";
import SignUp from "../Pages/Auth/SignUp";
import Dashboard from "../Pages/Home/Dashboard";
import HomeLayout from "../Layout/HomeLayout";
import Simulator from "../Pages/Simulator/Simulator";
import ObjectPages from "../Pages/Object/ObjectPages";
import AccountSetting from "../Pages/Account/AccountSetting";
import SelfTestPages from "../Pages/SelfTest/SelfTestPages";
import SelfTestDisplay from "../Pages/SelfTest/SelfTestDisplay";
import MatrixPages from "../Pages/Matrix/MatrixPages";
import Cookies from 'js-cookie';

const RequireAuth = ({ children }) => {
  const token = Cookies.get('token');
  return token ? children : <Navigate to="/signin" />;
};

const RouteComponents = () => {
  const token = Cookies.get('token');

  return (
    <BrowserRouter>
      <GlobalProvider>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <HomeLayout>
                  <Dashboard />
                </HomeLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/simulator"
            element={
              <RequireAuth>
                <HomeLayout>
                  <Simulator />
                </HomeLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/object"
            element={
              <RequireAuth>
                <HomeLayout>
                  <ObjectPages />
                </HomeLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/matrix"
            element={
              <RequireAuth>
                <HomeLayout>
                  <MatrixPages />
                </HomeLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <HomeLayout>
                  <AccountSetting />
                </HomeLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/selftest"
            element={
              <RequireAuth>
                <HomeLayout>
                  <SelfTestPages />
                </HomeLayout>
              </RequireAuth>
            }
          />
          <Route
            path="/selftest/display"
            element={
              <RequireAuth>
                <SelfTestDisplay />
              </RequireAuth>
            }
          />
          <Route
            path="/"
            element={token ? <Navigate to="/dashboard" /> : <SignIn />}
          />
          <Route
            path="/signin"
            element={token ? <Navigate to="/dashboard" /> : <SignIn />}
          />
          <Route
            path="/signup"
            element={token ? <Navigate to="/dashboard" /> : <SignUp />}
          />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  );
};

export default RouteComponents;
