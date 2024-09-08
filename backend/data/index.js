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
    category: "collaboration",
    isAnonymous: false,
    attachments: [],
  },
  {
    sender: "",
    receiver: "",
    reason: "Outstanding leadership demonstrated during a challenging project.",
    pointsAwarded: 12,
    category: "leadership",
    isAnonymous: false,
    attachments: [
      {
        filename: "attachments-1725818719023.jpg",
        path: "http://localhost:4000/uploads/images/attachments-1725818719023.jpg",
        mimetype: "image/jpeg",
        size: 3041282,
        fileType: "image",
        _id: "66dde75f41c0b66b3eb0543d",
      },
      {
        filename: "attachments-1725818719097.jpg",
        path: "http://localhost:4000/uploads/images/attachments-1725818719097.jpg",
        mimetype: "image/jpeg",
        size: 5983946,
        fileType: "image",
        _id: "66dde75f41c0b66b3eb0543e",
      },
    ],
  },
  {
    sender: "",
    receiver: "",
    reason:
      "Remarkable problem-solving skills displayed in resolving critical issues.",
    pointsAwarded: 10,
    category: "problemsolving",
    isAnonymous: true,
    attachments: [
      {
        filename: "attachments-1725818411183.mp4",
        path: "http://localhost:4000/uploads/videos/attachments-1725818411183.mp4",
        mimetype: "video/mp4",
        size: 23544017,
        fileType: "video",
        _id: "66dde62b60869663c036d8b1",
      },
      {
        filename: "attachments-1725818411704.mp4",
        path: "http://localhost:4000/uploads/videos/attachments-1725818411704.mp4",
        mimetype: "video/mp4",
        size: 9691729,
        fileType: "video",
        _id: "66dde62b60869663c036d8b2",
      },
    ],
  },
  {
    sender: "",
    receiver: "",
    reason:
      "Consistent dedication to achieving project milestones ahead of schedule.",
    pointsAwarded: 75,
    category: "dedication",
    isAnonymous: true,
    attachments: [
      {
        filename: "attachments-1725818380309.mp4",
        path: "http://localhost:4000/uploads/videos/attachments-1725818380309.mp4",
        mimetype: "video/mp4",
        size: 23544017,
        fileType: "video",
        _id: "66dde60c60869663c036d8a3",
      },
      {
        filename: "attachments-1725818380769.jpg",
        path: "http://localhost:4000/uploads/images/attachments-1725818380769.jpg",
        mimetype: "image/jpeg",
        size: 3041282,
        fileType: "image",
        _id: "66dde60c60869663c036d8a4",
      },
    ],
  },
  {
    sender: "",
    receiver: "",
    category: "innovation",
    reason:
      "Innovative approach to problem-solving leading to significant cost savings.",
    pointsAwarded: 100,
    isAnonymous: false,
    attachments: [
      {
        filename: "attachments-1725816283797.mp4",
        path: "http://localhost:4000/uploads/videos/attachments-1725816283797.mp4",
        mimetype: "video/mp4",
        size: 23544017,
        fileType: "video",
        _id: "66dddddc5d6b929a96a5785d",
      },
    ],
  },
];

const InsertManyUsers = async () => {
  try {
    await Users.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("12345", salt);

    const users = usersData.map((user) => ({
      ...user,
      password: hashedPassword,
    }));

    await Users.insertMany(users);
    console.log("InsertManyUsers: Data imported successfully");
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
