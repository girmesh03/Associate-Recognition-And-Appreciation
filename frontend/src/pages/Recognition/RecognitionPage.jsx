// react imports
import { Suspense } from "react";
import { useLoaderData, Await } from "react-router-dom";

// mui imports
import { styled } from "@mui/material/styles";
import { Box, Grid } from "@mui/material";

// components
import RecognitionSkeleton from "../../components/loadingSkeletons/RecognitionSkeleton";
import RecognitionPosts from "../../components/Recognition/RecognitionPosts";

// loader
const RightSidebar = styled(Grid)(({ theme }) => ({
  position: "sticky",
  top: 0,
  height: "100%",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  padding: theme.spacing(2, 2),
  [theme.breakpoints.down("lg")]: {
    display: "none",
  },
  "&::-webkit-scrollbar": {
    display: "none",
  },
}));

const RecognitionPage = () => {
  const { recognitions } = useLoaderData();

  return (
    <Grid container sx={{ height: "100%", overflowY: "auto" }}>
      <Grid item xs={12} lg={7}>
        <Suspense fallback={<RecognitionSkeleton />}>
          <Await resolve={recognitions}>
            <RecognitionPosts recognitions={recognitions} />
          </Await>
        </Suspense>
      </Grid>
      <RightSidebar item lg={5}>
        <Box>right sidebar</Box>
      </RightSidebar>
    </Grid>
  );
};

export default RecognitionPage;
