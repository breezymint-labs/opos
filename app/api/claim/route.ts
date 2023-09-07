import connectDb from "../../../config/dbConnection.js";
import NFTModal from "../../../config/schema.js";

export const POST = async (req: Request, res: Response) => {
    NFTModal.find()
    .then((user : any) => {
      if (user) {

      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((err) =>
      res.status(500).json({ error: "Error fetching user", details: err })
    );
}