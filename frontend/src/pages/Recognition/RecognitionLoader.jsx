import { defer } from "react-router-dom";

import { makeRequest } from "../../api/apiRequest";

const getRecognitions = async () => {
  const recognitions = await makeRequest.get("/recognitions");
  return recognitions;
};

export const RecognitionLoader = () => {
  const recognitionsPromise = getRecognitions();

  return defer({
    recognitions: recognitionsPromise,
  });
};
