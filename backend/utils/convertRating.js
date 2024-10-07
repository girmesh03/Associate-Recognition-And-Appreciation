// Convert the rating from 1-100 scale to 3-5 scale
const convertRatingTo3To5Scale = (userRating) => {
  const inputMin = 1;
  const inputMax = 100;
  const targetMin = 3;
  const targetMax = 5;

  // Apply the linear mapping formula
  return (
    ((targetMax - targetMin) * (userRating - inputMin)) /
      (inputMax - inputMin) +
    targetMin
  );
};

export default convertRatingTo3To5Scale;
