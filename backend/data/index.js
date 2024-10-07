import bcrypt from "bcrypt";
import Users from "../models/userModel.js";
import Recognitions from "../models/recognitionModel.js";

const usersData = [
  {
    firstName: "Girma",
    lastName: "Zewdie",
    department: "Engineering",
    position: "Engineer",
    email: "girma@gmail.com",
    password: "12345",
    role: "admin",
  },
  {
    firstName: "Beza",
    lastName: "Ayalew",
    department: "Marketing",
    position: "Manager",
    email: "beza@gmail.com",
    password: "12345",
    role: "user",
  },
  {
    firstName: "Henock",
    lastName: "Mathew",
    department: "Finance",
    position: "Accountant",
    email: "henock@gmail.com",
    password: "12345",
    role: "user",
  },
  {
    firstName: "Mesay",
    lastName: "Abera",
    department: "Human Resources",
    position: "HR Coordinator",
    email: "mesay@gmail.com",
    password: "12345",
    role: "user",
  },
  {
    firstName: "Ermias",
    lastName: "Tegene",
    department: "Food and Beverage",
    position: "Restaurant Manager",
    email: "ermias@gmail.com",
    password: "12345",
    role: "user",
  },
];

const RecognitionData = [
  {
    sender: "",
    receiver: "",
    reason: "Exceptional collaboration efforts in achieving team goals.",
    pointsAwarded: 5,
    category: "Top Performer",
    isAnonymous: false,
    attachments: [],
  },
  {
    sender: "",
    receiver: "",
    reason: "Outstanding leadership demonstrated during a challenging project.",
    pointsAwarded: 12,
    category: "Team Player",
    isAnonymous: false,
    attachments: [],
  },
  {
    sender: "",
    receiver: "",
    reason:
      "Remarkable problem-solving skills displayed in resolving critical issues.",
    pointsAwarded: 10,
    category: "Customer Champion",
    isAnonymous: true,
    attachments: [],
  },
  {
    sender: "",
    receiver: "",
    reason:
      "Consistent dedication to achieving project milestones ahead of schedule.",
    pointsAwarded: 75,
    category: "Rising Star",
    isAnonymous: true,
    attachments: [],
  },
  {
    sender: "",
    receiver: "",
    category: "Leadership Excellence",
    reason:
      "Innovative approach to problem-solving leading to significant cost savings.",
    pointsAwarded: 100,
    isAnonymous: false,
    attachments: [],
  },
];

const InsertManyUsers = async () => {
  try {
    await Users.deleteMany({});

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
              coverPicturePicture:
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

const InsertManyRecognitionData = async () => {
  try {
    await Recognitions.deleteMany({});
    const users = await Users.find({}, "_id");

    if (users.length < RecognitionData.length) {
      console.error("Not enough users to assign recognitions.");
      return;
    }

    const recognitionDataWithUserIds = RecognitionData.map(
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

export { InsertManyUsers, InsertManyRecognitionData };
