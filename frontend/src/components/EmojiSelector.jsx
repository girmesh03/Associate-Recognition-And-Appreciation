// React imports
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Picker from "@emoji-mart/react";

// mui imports
import { Box, CircularProgress } from "@mui/material";

// redux imports
import { useSelector } from "react-redux";

const EmojiSelector = ({ name, getValues, setValue, setShowEmojiPicker }) => {
  const mode = useSelector((state) => state.auth.mode);
  const [emojiData, setEmojiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmojiData = async () => {
    try {
      const response = await fetch(
        "https://cdn.jsdelivr.net/npm/@emoji-mart/data"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch emoji data");
      }
      const data = await response.json();
      setEmojiData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmojiData();
  }, []);

  const handleEmojiClick = (emoji) => {
    const value = getValues(name);
    setValue(name, value + " " + emoji.native);
    setShowEmojiPicker(false);
  };

  if (error) {
    return null;
  }

  if (loading) {
    return (
      <Box
        sx={{
          position: "absolute",
          right: 110,
          bottom: -5,
          zIndex: 1,
          minHeight: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={30} />
      </Box>
    );
  }
  return (
    <Picker
      data={emojiData} // Use the fetched emoji data
      onEmojiSelect={handleEmojiClick}
      theme={mode}
    />
  );
};

EmojiSelector.propTypes = {
  name: PropTypes.string.isRequired,
  getValues: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  setShowEmojiPicker: PropTypes.func.isRequired,
};

export default React.memo(EmojiSelector);
