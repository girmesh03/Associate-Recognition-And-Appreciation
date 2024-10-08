import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Users from "../models/userModel.js";
import Recognitions from "../models/recognitionModel.js";
import Nominations from "../models/nominationModel.js";

// Import mock data
import { usersData, recognitionsData, nominationsData } from "./fakeData.js";

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const InsertUsersData = async () => {
  try {
    // Insert users without passwords
    const insertedUsers = await Users.insertMany(usersData);

    // Hash and update passwords for each user
    await Promise.all(
      insertedUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("12345", salt);

        return Users.findByIdAndUpdate(
          user._id,
          {
            $set: {
              password: hashedPassword,
              profilePicture:
                "http://localhost:4000/uploads/default/noAvatar.webp",
              coverPicture:
                "http://localhost:4000/uploads/default/noCover.webp",
            },
          },
          { new: true }
        );
      })
    );

    console.log(
      "InsertManyUsers: Data imported and passwords hashed successfully"
    );
  } catch (error) {
    console.error("InsertManyUsers: Error importing data", error);
  }
};

const InsertRecognitionsData = async () => {
  try {
    await Recognitions.deleteMany({});
    const users = await Users.find({}, "_id");

    if (users.length < recognitionsData.length) {
      console.error("Not enough users to assign recognitions.");
      return;
    }

    const recognitionDataWithUserIds = recognitionsData.map(
      (recognition, index) => ({
        ...recognition,
        sender: users[index]._id,
        receiver: users[(index + 1) % users.length]._id,
      })
    );

    const insertedRecognitions = await Recognitions.insertMany(
      recognitionDataWithUserIds
    );

    await Promise.all(
      insertedRecognitions.map(async (recognition) => {
        const senderId = recognition.sender;
        const receiverId = recognition.receiver;

        await Promise.all([
          Users.findByIdAndUpdate(
            senderId,
            {
              $inc: {
                "points.sent": recognition.pointsAwarded,
                "recognitions.sent": 1,
              },
            },
            { new: true }
          ),
          Users.findByIdAndUpdate(
            receiverId,
            {
              $inc: {
                "points.received": recognition.pointsAwarded,
                "recognitions.received": 1,
              },
            },
            { new: true }
          ),
        ]);
      })
    );

    console.log("InsertManyRecognitionData: Data imported successfully");
  } catch (error) {
    console.error("InsertManyRecognitionData: Error importing data", error);
  }
};

const InsertNominationsData = async () => {
  try {
    await Nominations.deleteMany({}); // Clear existing nominations
    const users = await Users.find({}, "_id"); // Fetch user IDs

    if (users.length < nominationsData.length) {
      console.error("Not enough users to assign nominations.");
      return;
    }

    // Mapping nomination data with random values for category, isAnonymous, rating, and votes
    const nominationDataWithUserIds = nominationsData.map(
      (nomination, index) => ({
        ...nomination,
        nominator: users[index]._id, // Assign a nominator from the users
        nominee: users[(index + 1) % users.length]._id, // Assign a nominee (next user in the list)
        votes: [users[Math.floor(Math.random() * users.length)]._id], // Random user voting
      })
    );

    // Insert nominations into the database
    const insertedNominations = await Nominations.insertMany(
      nominationDataWithUserIds
    );

    // Optionally update user stats (sent and received nominations)
    await Promise.all(
      insertedNominations.map(async (nomination) => {
        const nomineeId = nomination.nominee;

        await Promise.all([
          Users.findByIdAndUpdate(
            nomineeId,
            { $inc: { "nominations.count": 1 } }, // Increment nominations count
            { new: true }
          ),
        ]);
      })
    );

    console.log("InsertManyNominationData: Nominations imported successfully");
  } catch (error) {
    console.error("InsertManyNominationData: Error importing data", error);
  }
};

const DeleteData = async () => {
  try {
    await Users.deleteMany({});
    await Recognitions.deleteMany({});
    await Nominations.deleteMany({});

    console.log("Data deleted successfully");
  } catch (error) {
    console.error("Error deleting data:", error);
  }
  process.exit();
};

const InsertData = async () => {
  try {
    // Delete existing data
    await Users.deleteMany({});
    await Recognitions.deleteMany({});
    await Nominations.deleteMany({});

    // Insert new data
    await Promise.all([
      InsertUsersData(),
      InsertRecognitionsData(),
      InsertNominationsData(),
    ]);

    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
  }

  // Exit the process
  process.exit();
};

if (process.argv[2] === "--delete") {
  DeleteData();
} else if (process.argv[2] === "--import") {
  InsertData();
} else {
  console.log("Please specify --delete or --import");
  process.exit();
}
