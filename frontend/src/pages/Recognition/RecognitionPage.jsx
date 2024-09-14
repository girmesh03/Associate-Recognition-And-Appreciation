import { Suspense } from "react";
import { useLoaderData, Await } from "react-router-dom";

import { Box, Grid } from "@mui/material";

import RecognitionSkeleton from "../../components/loadingSkeletons/RecognitionSkeleton";
import RecognitionPosts from "../../components/Recognition/RecognitionPosts";

const RecognitionPage = () => {
  const { recognitions } = useLoaderData();

  return (
    <Grid container sx={{ height: "100%", pb: { xs: 7, sm: 8 } }}>
      <Grid item xs={12} lg={7} sx={{ height: "100%", overflow: "auto" }}>
        <Suspense fallback={<RecognitionSkeleton />}>
          <Await resolve={recognitions}>
            <RecognitionPosts />
          </Await>
        </Suspense>
      </Grid>
      <Grid item lg={5} sx={{ display: { xs: "none", lg: "block" } }}>
        <Box>right</Box>
      </Grid>
    </Grid>
  );
};

export default RecognitionPage;
