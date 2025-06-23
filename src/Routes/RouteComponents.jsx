import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GlobalProvider } from "../Provider/GlobalContext";
import ErrorPage from "../Pages/Error/ErrorPage";
import SignIn from "../Pages/Auth/SignIn";
import SignUp from "../Pages/Auth/SignUp";
import LayoutPages from "../Layout/LayoutPages";
import DashboardPages from "../Pages/Home/DashboardPages";
import ProjectPages from "../Pages/Project/ProjectPages";
import ManageDataPages from "../Pages/ManageData/ManageDataPages";
import JasaPages from "../Pages/Jasa/JasaPages";
import MaterialKonstruksiPages from "../Pages/MaterialKonstruksi/MaterialKonstruksiPages";
import TableMaterial from "../Pages/MaterialKonstruksi/TableMaterial";
import ConstractionCostPages from "../Pages/ConstructionCost/ConstractionCostPages";
import DetailCreateProjectConstruction from "../Pages/Project/DetailCreateProjectConstruction";
import RecapitulationPages from "../Pages/Recapitulation/RecapitulationPages";
import RabPages from "../Pages/RancanganAnggaranBelanja/RabPages";
import MaterialAndPackagePages from "../Pages/MaterialAndPackage/MaterialAndPackagePages";

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
