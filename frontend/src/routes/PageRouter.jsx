import { memo, Suspense, lazy } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

//  Imports for components and utilities
import LoadingFallback from "../components/loadingSkeletons/LoadingFallback";
import RootErrorBoundary from "../layout/RootErrorBoundary";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";

// Imports for layouts
const RootLayout = lazy(() => import("../layout/RootLayout"));

// Imports for pages (lazy-loaded), public
const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignupPage = lazy(() => import("../pages/SignupPage"));

// Imports for pages (lazy-loaded), protected
const RecognitionPage = lazy(() =>
  import("../pages/Recognition/RecognitionPage")
);
const RecognitionCreateEdit = lazy(() =>
  import("../pages/Recognition/RecognitionCreateEdit")
);
const NominationPage = lazy(() => import("../pages/NominationPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const WinnersPage = lazy(() => import("../pages/WinnersPage"));
const AdminPage = lazy(() => import("../pages/AdminPage"));

// Imports for routes and loaders
import { RecognitionLoader } from "../pages/Recognition/RecognitionLoader";
import RecognitionError from "../pages/Recognition/RecognitionError";
import { RecognitionCreateEditLoader } from "../pages/Recognition/RecognitionCreateEdit";

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
        <Route element={<PublicRoutes />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          <Route
            path="recognitions"
            element={<RecognitionPage />}
            loader={RecognitionLoader}
            errorElement={<RecognitionError />}
          />
          <Route
            path="recognitions/create"
            element={<RecognitionCreateEdit mode="create" />}
            loader={RecognitionCreateEditLoader}
          />
          <Route
            path="recognitions/:recognitionId/edit"
            element={<RecognitionCreateEdit mode="edit" />}
            loader={RecognitionCreateEditLoader}
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
