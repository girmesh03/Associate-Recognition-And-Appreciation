// react imports
import React, { useState } from "react";
import PropTypes from "prop-types";

// mui imports
import { CardContent, Typography, Chip, IconButton } from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";

const RecognitionContent = ({ recognition }) => {
  const {
    sender,
    receiver,
    category,
    reason,
    pointsAwarded,
    isAnonymous,
    // date,
  } = recognition;

  // State for managing expanded/collapsed text
  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => setExpanded(!expanded);

  // Constructing the display text
  const getDisplayText = () => {
    let text = isAnonymous
      ? `An anonymous colleague has recognized ${receiver.firstName}`
      : `${sender.firstName} has recognized ${receiver.firstName}`;

    text += ` for outstanding contribution in the ${category.toLowerCase()} category.`;
    text += pointsAwarded
      ? ` As a result, they have been awarded ${pointsAwarded} points.`
      : "";
    text += ` Here's why: ${reason}`;

    return text;
  };

  return (
    <CardContent sx={{ py: 0 }}>
      <Typography variant="h6" gutterBottom>
        {isAnonymous
          ? "Anonymous Recognition"
          : `${sender.firstName} → ${receiver.firstName}`}
      </Typography>

      <Chip label={category} color="primary" sx={{ mb: 2 }} />

      <Typography
        variant="body1"
        paragraph
        sx={{
          textAlignLast: "left",
          overflowWrap: "anywhere",
        }}
      >
        {expanded
          ? getDisplayText()
          : `${getDisplayText().slice(0, 150)}${
              getDisplayText().length > 150 ? "... " : ""
            }`}
        {getDisplayText().length > 150 && (
          <IconButton onClick={handleExpandClick} sx={{ ml: 1 }}>
            {expanded ? (
              <ExpandLessIcon color="primary" fontSize="medium" />
            ) : (
              <ExpandMoreIcon color="primary" fontSize="medium" />
            )}
          </IconButton>
        )}
      </Typography>
    </CardContent>
  );
};

RecognitionContent.propTypes = {
  recognition: PropTypes.shape({
    sender: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      profilePicture: PropTypes.string,
    }).isRequired,
    receiver: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      profilePicture: PropTypes.string,
    }).isRequired,
    category: PropTypes.string.isRequired,
    reason: PropTypes.string.isRequired,
    pointsAwarded: PropTypes.number,
    isAnonymous: PropTypes.bool.isRequired,
  }).isRequired,
};

export default React.memo(RecognitionContent);
