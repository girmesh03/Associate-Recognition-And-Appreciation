import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { makeRequest } from "../../api/apiRequest";

const RecognitionEdit = () => {
  const recognitionId = useParams().recognitionId;
  const [recognition, setRecognition] = useState(null);

  const getRecognition = useCallback(async () => {
    try {
      const response = await makeRequest.get(`/recognitions/${recognitionId}`);
      setRecognition(response.data);
    } catch (error) {
      console.log("error", error.response.data.message);
    }
  }, [recognitionId]);

  useEffect(() => {
    getRecognition();
  }, [getRecognition]);

  return <div>{recognition?.sender?.firstName}</div>;
};

export default RecognitionEdit;
