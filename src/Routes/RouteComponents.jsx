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
import PublicRoute from "./PublicRoute"; // NEW

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
          {/* Public routes: sign-in (and alias "/") and sign-up */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />

          {/* Protected routes: require valid/refreshable session */}
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
              <PrivateRoute>
                <LayoutPages>
                  <ProjectPages />
                </LayoutPages>
              </PrivateRoute>
            }
          />
          <Route
            path="/rekap"
            element={
              <PrivateRoute>
                <LayoutPages>
                  <RecapitulationPages />
                </LayoutPages>
              </PrivateRoute>
            }
          />
          <Route
            path="/rab"
            element={
              <PrivateRoute>
                <LayoutPages>
                  <RabPages />
                </LayoutPages>
              </PrivateRoute>
            }
          />
          <Route
            path="/manage-data"
            element={
              <PrivateRoute>
                <LayoutPages>
                  <ManageDataPages />
                </LayoutPages>
              </PrivateRoute>
            }
          />
          <Route
            path="/construction-cost"
            element={
              <PrivateRoute>
                <LayoutPages>
                  <ConstractionCostPages />
                </LayoutPages>
              </PrivateRoute>
            }
          />
          <Route
            path="/project/:id/detail-construction"
            element={
              <PrivateRoute>
                <LayoutPages>
                  <DetailCreateProjectConstruction />
                </LayoutPages>
              </PrivateRoute>
            }
          />
          <Route
            path="/unitprice"
            element={
              <PrivateRoute>
                <LayoutPages>
                  <TransportPages />
                </LayoutPages>
              </PrivateRoute>
            }
          />
          <Route
            path="/administrator"
            element={
              <PrivateRoute>
                <LayoutPages>
                  <AdministratorPages />
                </LayoutPages>
              </PrivateRoute>
            }
          />
          <Route
            path="/opex"
            element={
              <PrivateRoute>
                <LayoutPages>
                  <OpexPages />
                </LayoutPages>
              </PrivateRoute>
            }
          />
          <Route
            path="/library"
            element={
              <PrivateRoute>
                <LayoutPages>
                  <LibraryPages />
                </LayoutPages>
              </PrivateRoute>
            }
          />
          <Route
            path="/library/:id"
            element={
              <PrivateRoute>
                <LayoutPages>
                  <Preview />
                </LayoutPages>
              </PrivateRoute>
            }
          />
          <Route
            path="/project/:id/detail"
            element={
              <PrivateRoute>
                <LayoutPages>
                  <ProjectDetail />
                </LayoutPages>
              </PrivateRoute>
            }
          />
          <Route
            path="/project/:id/edit"
            element={
              <PrivateRoute>
                <LayoutPages>
                  <EditProjectConstruction />
                </LayoutPages>
              </PrivateRoute>
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

          {/* Fallback */}
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  );
};

export default RouteComponents;