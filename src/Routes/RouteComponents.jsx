import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { GlobalProvider } from "../Provider/GlobalContext";
import { useDispatch, useSelector } from "react-redux";
import { validateAccessToken } from "../Provider/AuthSlice";
import ErrorPage from "../Pages/Error/ErrorPage";
import SignIn from "../Pages/Auth/SignIn";
import SignUp from "../Pages/Auth/SignUp";
import LayoutPages from "../Layout/LayoutPages";
import DashboardPages from "../Pages/Home/DashboardPages";
import ProjectPages from "../Pages/Project/ProjectPages";
import ManageDataPages from "../Pages/ManageData/ManageDataPages";
import ConstractionCostPages from "../Pages/ConstructionCost/ConstractionCostPages";
import DetailCreateProjectConstruction from "../Pages/Project/DetailCreateProjectConstruction";
import RecapitulationPages from "../Pages/Recapitulation/RecapitulationPages";
import RabPages from "../Pages/RancanganAnggaranBelanja/RabPages";
import AdministratorPages from "../Pages/Admin/AdministratorPages";
import TransportPages from "../Pages/UnitPrice/UnitPricePages";
import ProjectDetail from "../Pages/Project/ProjectDetail";
import EditProjectConstruction from "../Pages/Project/EditProjectConstruction"; // + import
import OpexPages from "../Pages/Opex/OpexPages"; // NEW
import LibraryPages from "../Pages/Library/LibraryPages"; // NEW
import Preview from "../Pages/Library/Preview"; // NEW
import UserManagementPages from "../Pages/Admin/UserManagementPages";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { user, isValidating, sessionChecked } = useSelector((state) => state.auth);
  const [checking, setChecking] = React.useState(true);

  useEffect(() => {
    let mounted = true;
    // Only validate if we haven't checked yet and not currently validating
    if (!user && !sessionChecked && !isValidating) {
      dispatch(validateAccessToken()).finally(() => { if (mounted) setChecking(false); });
    } else {
      setChecking(false);
    }
    return () => { mounted = false; };
  }, [dispatch, user, isValidating, sessionChecked]);

  if (checking) return null;
  return user ? children : <Navigate to="/signin" />;
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
            path="/unitprice"
            element={
              <LayoutPages>
                <TransportPages />
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
            path="/opex"
            element={
              <LayoutPages>
                <OpexPages />
              </LayoutPages>
            }
          />
          <Route
            path="/library"
            element={
              <LayoutPages>
                <LibraryPages />
              </LayoutPages>
            }
          />
          <Route
            path="/library/:id"
            element={
              <LayoutPages>
                <Preview />
              </LayoutPages>
            }
          />
          <Route
            path="/project/:id/detail"
            element={
              <LayoutPages>
                <ProjectDetail />
              </LayoutPages>
            }
          />
          <Route
            path="/project/:id/edit"
            element={
              <LayoutPages>
                <EditProjectConstruction />
              </LayoutPages>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <LayoutPages>
                  <UserManagementPages />
                </LayoutPages>
              </PrivateRoute>
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