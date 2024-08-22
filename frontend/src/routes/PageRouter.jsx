import { memo } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import RootLayout from "../layout/RootLayout";
import RootErrorBoundary from "../layout/RootErrorBoundary";
import PublicLayout from "../layout/PublicLayout";
import ProtectedLayout from "../layout/ProtectedLayout";

import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import HomePage from "../pages/HomePage";
import RecognitionsPage from "../pages/RecognitionsPage";
import NominationsPage from "../pages/NominationsPage";
import ProfilePage from "../pages/ProfilePage";
import WinnersPage from "../pages/WinnersPage";
import AdminPage from "../pages/AdminPage";

import ProtectedRoutes from "./ProtectedRoutes";

const PageRouter = memo(() => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={<RootLayout />}
        errorElement={<RootErrorBoundary />}
      >
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoutes>
              <ProtectedLayout />
            </ProtectedRoutes>
          }
        >
          <Route path="home" element={<HomePage />} />
          <Route path="recognitions" element={<RecognitionsPage />} />
          <Route path="nominations" element={<NominationsPage />} />
          <Route path="profile/:userId" element={<ProfilePage />} />
          <Route path="winners" element={<WinnersPage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
});

export default PageRouter;
