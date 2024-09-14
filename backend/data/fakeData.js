import { InsertManyUsers, InsertManyRecognitionData } from "./index.js";
import { ImportDataStatus } from "../models/reusableSchemas.js";

export const ImportData = async () => {
  const status = await ImportDataStatus.findOne();

  if (!status || !status.imported) {
    console.log("Importing data...");
    await InsertManyUsers();
    await InsertManyRecognitionData();

    // Create or update the import status
    if (status) {
      status.imported = true;
      await status.save();
    } else {
      await ImportDataStatus.create({ imported: true });
    }

    console.log("Data imported successfully");
  } else {
    console.log("Data has already been imported. Skipping import.");
  }
};
