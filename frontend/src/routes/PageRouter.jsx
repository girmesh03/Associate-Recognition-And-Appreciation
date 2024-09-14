import { memo, Suspense, lazy } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";

//  Imports for components and utilities
import LoadingFallback from "../components/loadingSkeletons/LoadingFallback";
import RootErrorBoundary from "../layout/RootErrorBoundary";
import ProtectedRoutes from "./ProtectedRoutes";

// Imports for layouts
const RootLayout = lazy(() => import("../layout/RootLayout"));
const PublicLayout = lazy(() => import("../layout/PublicLayout"));
import ProtectedLayout from "../layout/ProtectedLayout";

// Imports for pages (lazy-loaded), public
const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignupPage = lazy(() => import("../pages/SignupPage"));

// Imports for pages (lazy-loaded), protected
const RecognitionPage = lazy(() =>
  import("../pages/Recognition/RecognitionPage")
);
const RecognitionEdit = lazy(() =>
  import("../pages/Recognition/RecognitionEdit")
);
const NominationPage = lazy(() => import("../pages/NominationPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const WinnersPage = lazy(() => import("../pages/WinnersPage"));
const AdminPage = lazy(() => import("../pages/AdminPage"));

// Imports for routes and loaders
import { RecognitionLoader } from "../pages/Recognition/RecognitionLoader";
import RecognitionError from "../pages/Recognition/RecognitionError";

const PageRouter = memo(() => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <RootLayout />
          </Suspense>
        }
        errorElement={<RootErrorBoundary />}
      >
        {/* Public Routes */}
        <Route
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PublicLayout />
            </Suspense>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoutes>
              <ProtectedLayout>
                <Suspense
                  fallback={
                    <LoadingFallback
                      height="80%"
                      width="100%"
                      sx={{ transform: { md: "translateX(-80px)" } }}
                    />
                  }
                >
                  <Outlet />
                </Suspense>
              </ProtectedLayout>
            </ProtectedRoutes>
          }
        >
          <Route
            path="recognitions"
            element={<RecognitionPage />}
            loader={RecognitionLoader}
            errorElement={<RecognitionError />}
          />
          <Route
            path="recognitions/:recognitionId/edit"
            element={<RecognitionEdit />}
          />

          <Route path="nominations" element={<NominationPage />} />
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
