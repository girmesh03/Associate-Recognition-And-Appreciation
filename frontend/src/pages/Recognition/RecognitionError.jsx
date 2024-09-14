import { useRouteError } from "react-router-dom";

const RecognitionError = () => {
  const error = useRouteError();

  // Handle specific error like network errors
  const message =
    error?.message === "Network Error"
      ? "Network error. Please try again later."
      : error?.message || "An unexpected error occurred.";

  return (
    <div>
      <h1>Oops! Something went wrong.</h1>
      <p>{message}</p>
    </div>
  );
};

export default RecognitionError;
