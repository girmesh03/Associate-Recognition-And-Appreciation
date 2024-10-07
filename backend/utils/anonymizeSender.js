const anonymizeSender = (
  post,
  userId,
  userRole,
  postSender = "sender",
  postReceiver = "receiver"
) => {
  // If the user is an admin, return the original sender object
  if (userRole === "admin") {
    return post[postSender]?.toObject();
  }

  // If the post is anonymous and the current user is not the sender or receiver
  if (
    post.isAnonymous === true &&
    post[postSender]?._id?.toString() !== userId &&
    post[postReceiver]?._id?.toString() !== userId
  ) {
    // Return anonymized sender details
    return {
      ...post[postSender]?.toObject(),
      firstName: "Anonymous",
      lastName: "",
      email: "",
      profilePicture: "",
    };
  }

  // Otherwise, return the original sender object
  return post[postSender]?.toObject();
};

export default anonymizeSender;
