import mongoose from "mongoose"

const NFTmappingSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"]
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        unique: true 
    },
    NFT: [{ tokenId: String, date: Date, claimed: Boolean }],
})

export default mongoose.model("NFTs", NFTmappingSchema)