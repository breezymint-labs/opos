import express, { json } from "express";
import cors from "cors";
import connectDb from "./config/dbConnection.js";
import NFTModal from "./models/NFTModal.js";

connectDb();
const app = express();
app.use(json());
app.use(cors({ origin: true }));

app.post("/users/create", (req, res) => {
  const { name, email } = req.body;

  NFTModal.create({ name, email })
    .then((user) => res.json(user))
    .catch((err) =>
      res.status(500).json({ error: "Error creating user", details: err })
    );
});

app.post("/users/:email/create/ai", (req, res) => {
  const { email } = req.params;
  const { prompt } = req.body;

  NFTModal.findOne({ email })
    .then((user) => {
      if (user) {
        res.json({ message: "Your NFT Will be Minted Within a minute" });
        mintAiSimulator(user.name, user.email, prompt)
          .then((nftAddress) => {
            const newNFT = {
              tokenId: nftAddress,
              date: new Date(),
              claimed: false,
            };

            NFTModal.findOneAndUpdate(
              { email },
              { $push: { NFT: newNFT } },
              { new: true }
            )
              .then((updatedUser) => {
                if (updatedUser) {
                  console.log("succesfull", updatedUser);
                  //   res.json(updatedUser);
                } else {
                  res.status(404).json({ error: "User not found" });
                }
              })
              .catch((err) =>
                res
                  .status(500)
                  .json({ error: "Error updating NFT", details: err })
              );
          })
          .catch((err) =>
            res.status(500).json({ error: "Error minting Image", details: err })
          );
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((err) =>
      res.status(500).json({ error: "Error fetching user", details: err })
    );
});