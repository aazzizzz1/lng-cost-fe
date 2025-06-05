import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalProvider } from "../Provider/GlobalContext";
import ErrorPage from "../Pages/Error/ErrorPage";
import SignIn from "../Pages/Auth/SignIn";
import SignUp from "../Pages/Auth/SignUp";
import HomeLayout from "../Layout/HomeLayout";
import Simulator from "../Pages/Simulator/Simulator";
import ObjectPages from "../Pages/Object/ObjectPages";
import AccountSetting from "../Pages/Account/AccountSetting";
import SelfTestPages from "../Pages/SelfTest/SelfTestPages";
import SelfTestDisplay from "../Pages/SelfTest/SelfTestDisplay";
import MatrixPages from "../Pages/Matrix/MatrixPages";
import LayoutPages from "../Layout/LayoutPages";
import DashboardPages from "../Pages/Home/DashboardPages";
import ProjectPages from "../Pages/Project/ProjectPages";
import ManageDataPages from "../Pages/ManageData/ManageDataPages";
import JasaPages from "../Pages/Jasa/JasaPages";
import MaterialKonstruksi from "../Pages/MaterialKonstruksi/MaterialKonstruksi";
import TableMaterial from "../Pages/MaterialKonstruksi/TableMaterial";

const RouteComponents = () => {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <LayoutPages>
                <DashboardPages />
              </LayoutPages>
            }
          />
          <Route
            path="/project"
            element={
              <LayoutPages>
                <ProjectPages />
              </LayoutPages>
            }
          />
          <Route
            path="/manage-data"
            element={
              <LayoutPages>
                <ManageDataPages />
              </LayoutPages>
            }
          />
          <Route
            path="/jasa"
            element={
              <LayoutPages>
                <JasaPages />
              </LayoutPages>
            }
          />
          <Route
            path="/material-konstruksi"
            element={
              <LayoutPages>
                <MaterialKonstruksi />
              </LayoutPages>
            }
          />
          <Route
            path="/material-konstruksi/tabel"
            element={
              <LayoutPages>
                <TableMaterial />
              </LayoutPages>
            }
          />
          <Route
            path="/simulator"
            element={
              <HomeLayout>
                <Simulator />
              </HomeLayout>
            }
          />
          <Route
            path="/object"
            element={
              <HomeLayout>
                <ObjectPages />
              </HomeLayout>
            }
          />
          <Route
            path="/matrix"
            element={
              <HomeLayout>
                <MatrixPages />
              </HomeLayout>
            }
          />
          <Route
            path="/account"
            element={
              <HomeLayout>
                <AccountSetting />
              </HomeLayout>
            }
          />
          <Route
            path="/selftest"
            element={
              <HomeLayout>
                <SelfTestPages />
              </HomeLayout>
            }
          />
          <Route path="/selftest/display" element={<SelfTestDisplay />} />
          <Route
            path="/"
            element={
              <SignIn />
              // <Dashboard />
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  );
};

export default RouteComponents;
