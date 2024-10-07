// mui imports
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Skeleton,
  Stack,
} from "@mui/material";

const RecognitionSkeleton = () => {
  const POST_COUNTER = 5;

  const MuiSkeleton = () => (
    <Card variant="outlined">
      <CardHeader
        avatar={
          <Skeleton
            variant="circular"
            width={40}
            height={40}
            animation="wave"
          />
        }
        title={<Skeleton variant="text" width="60%" animation="wave" />}
        subheader={<Skeleton variant="text" width="40%" animation="wave" />}
      />
      <CardContent sx={{ p: 1, ml: 1 }}>
        <Skeleton variant="text" width="80%" animation="wave" />
        <Skeleton variant="text" width="60%" animation="wave" />
      </CardContent>
      <Skeleton
        variant="rectangular"
        width="96%"
        height="150px"
        sx={{ margin: "0 auto" }}
        animation="wave"
      />
      <CardActions sx={{ paddingLeft: "1.5rem" }}>
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1}>
          <Skeleton
            variant="circular"
            width={30}
            height={30}
            animation="wave"
          />
          <Skeleton variant="text" height={30} width="20%" animation="wave" />
          <Skeleton
            variant="circular"
            width={30}
            height={30}
            animation="wave"
          />
          <Skeleton variant="text" height={30} width="20%" animation="wave" />
        </Stack>
      </CardActions>
    </Card>
  );

  return (
    <Box
      sx={{
        maxWidth: 700,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        px: { xs: 0.5, sm: 2 },
        py: 2,
      }}
    >
      {Array.from(Array(POST_COUNTER).keys()).map((idx) => (
        <MuiSkeleton key={idx} />
      ))}
    </Box>
  );
};

export default RecognitionSkeleton;
