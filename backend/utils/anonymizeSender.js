/**
 * Anonymizes the sender if the post is anonymous and the current user is not the sender, receiver, or an admin
 * @param {Object} post - The post document (recognition, appreciation, nomination)
 * @param {String} userId - The ID of the current user
 * @param {String} userRole - The role of the current user ('admin', 'user')
 * @returns {Object} - The sender object, either anonymized or with full details
 */

const anonymizeSender = (post, userId, userRole) => {
  // If the user is an admin, return the original sender object
  if (userRole === "admin") {
    return post.sender.toObject();
  }

  // If the post is anonymous and the current user is not the sender or receiver
  if (
    post.isAnonymous === true &&
    post.sender._id.toString() !== userId &&
    post.receiver._id.toString() !== userId
  ) {
    // Return anonymized sender details
    return {
      ...post.sender.toObject(),
      firstName: "Anonymous",
      lastName: "",
      email: "",
      profilePicture: "",
    };
  }

  // Otherwise, return the original sender object
  return post.sender.toObject();
};

export default anonymizeSender;
