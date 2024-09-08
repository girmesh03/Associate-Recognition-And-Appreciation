import Recognition from "../models/recognitionModel.js";
import Nomination from "../models/nominationModel.js";
import Appreciation from "../models/appreciationModel.js";
import CustomError from "../utils/CustomError.js";

const checkOwnershipOrAdmin =
  (ModelName, idParamName = "id") =>
  async (req, res, next) => {
    try {
      const { user } = req;
      const documentId = req.params[idParamName];
      let document = [];

      switch (ModelName) {
        case "Recognition":
          document = await Recognition.findById(documentId);
          break;
        case "Nomination":
          document = await Nomination.findById(documentId);
          break;
        case "Appreciation":
          document = await Appreciation.findById(documentId);
          break;
        default:
          break;
      }

      if (!document) {
        next(new CustomError(`${ModelName} not found`, 404));
      }

      if (
        user.role === "admin" ||
        user.id === document.sender._id.toString() ||
        user.id === document.receiver._id.toString()
      ) {
        next(); // User is authorized, proceed to the next handler
      } else {
        next(new CustomError("Not authorized to perform this action", 403));
      }
    } catch (error) {
      next(error);
    }
  };

export default checkOwnershipOrAdmin;
