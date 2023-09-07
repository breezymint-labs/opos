import mongoose from "mongoose"

const NFTmappingSchema = mongoose.Schema({
    id: {
        type: Number,
        required: [true, "Please provide id"]
    },
    treeAddress: {
        type: String,
        required: [true, "Please provide treeAddress"]
    },
    collectionMint: {
        type: String,
        required: [true, "Please provide collectionMint"]
    },
    collectionMetadata: {
        type: String,
        required: [true, "Please provide collectionMetadata"]
    },
    collectionMasterEditionAccount: {
        type: String,
        required: [true, "Please provide collectionMasterEditionAccount"]
    },
    compressedNFTMetadata: {
        type: String,
        required: [true, "Please provide compressedNFTMetadata"]
    },
    Shortlist: [{name: String}],
})

export default mongoose.model("NFTCollection", NFTmappingSchema)