import { useRouteError } from "react-router-dom";

const RootErrorBoundary = () => {
  const error = useRouteError(); // Catch global errors

  return (
    <div>
      <h1>Something went wrong</h1>
      <p>
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
    </div>
  );
};

export default RootErrorBoundary;
