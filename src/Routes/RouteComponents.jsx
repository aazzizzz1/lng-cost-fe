import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { GlobalProvider } from "../Provider/GlobalContext";
import { useDispatch, useSelector } from "react-redux";
import { refreshToken, validateAccessToken } from "../Provider/AuthSlice";
import ErrorPage from "../Pages/Error/ErrorPage";
import SignIn from "../Pages/Auth/SignIn";
import SignUp from "../Pages/Auth/SignUp";
import LayoutPages from "../Layout/LayoutPages";
import DashboardPages from "../Pages/Home/DashboardPages";
import ProjectPages from "../Pages/Project/ProjectPages";
import ManageDataPages from "../Pages/ManageData/ManageDataPages";
import JasaPages from "../Pages/UnitPrice/Jasa/JasaPages";
import MaterialKonstruksiPages from "../Pages/UnitPrice/MaterialKonstruksi/MaterialKonstruksiPages";
import TableMaterial from "../Pages/UnitPrice/MaterialKonstruksi/TableMaterial";
import ConstractionCostPages from "../Pages/ConstructionCost/ConstractionCostPages";
import DetailCreateProjectConstruction from "../Pages/Project/DetailCreateProjectConstruction";
import RecapitulationPages from "../Pages/Recapitulation/RecapitulationPages";
import RabPages from "../Pages/RancanganAnggaranBelanja/RabPages";
import MaterialAndPackagePages from "../Pages/UnitPrice/MaterialAndPackage/MaterialAndPackagePages";
import AdministratorPages from "../Pages/Admin/AdministratorPages";
import TransportPages from "../Pages/UnitPrice/Transport/TransportPages";
import LiquifactionPlantPages from "../Pages/UnitPrice/LiquifactionPlant/LiquifactionPlantPages";
import ReceivingTerimnalPages from "../Pages/UnitPrice/ReceivingTerminal/ReceivingTerimnalPages";
import Cobagettransport from "../Pages/UnitPrice/Transport/Cobagettransport";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken) {
      dispatch(validateAccessToken()).catch(() => {
        window.location.href = '/signin'; // Redirect ke signin jika accessToken tidak valid
      });
    } else {
      dispatch(refreshToken()).catch(() => {
        window.location.href = '/signin'; // Redirect ke signin jika refreshToken gagal
      });
    }
  }, [accessToken, dispatch]);

  return accessToken ? children : <Navigate to="/signin" />;
};

const RouteComponents = () => {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <LayoutPages>
                  <DashboardPages />
                </LayoutPages>
              </PrivateRoute>
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
            path="/rekap"
            element={
              <LayoutPages>
                <RecapitulationPages />
              </LayoutPages>
            }
          />
          <Route
            path="/rab"
            element={
              <LayoutPages>
                <RabPages />
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
                <MaterialKonstruksiPages />
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
            path="/construction-cost"
            element={
              <LayoutPages>
                <ConstractionCostPages />
              </LayoutPages>
            }
          />
          <Route
            path="/project/:id/detail-construction"
            element={
              <LayoutPages>
                <DetailCreateProjectConstruction />
              </LayoutPages>
            }
          />
          <Route
            path="/material-package"
            element={
              <LayoutPages>
                <MaterialAndPackagePages />
              </LayoutPages>
            }
          />
          <Route
            path="/transportation"
            element={
              <LayoutPages>
                <TransportPages />
              </LayoutPages>
            }
          />
          <Route
            path="/liquifaction-plant"
            element={
              <LayoutPages>
                <LiquifactionPlantPages />
              </LayoutPages>
            }
          />
          <Route
            path="/receiving-terminal"
            element={
              <LayoutPages>
                <ReceivingTerimnalPages />
              </LayoutPages>
            }
          />
          <Route
            path="/administrator"
            element={
              <LayoutPages>
                <AdministratorPages />
              </LayoutPages>
            }
          />
          <Route
            path="/"
            element={
              <SignIn />
              // <Dashboard />
            }
          />
          <Route
            path="/coba"
            element={
              <Cobagettransport />
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