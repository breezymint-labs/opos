// import mongoose from "mongoose"
import { Schema, model, models } from 'mongoose';

const NFTCollectionSchema = new Schema({
    collectionName: {
        type: String,
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

// export default mongoose.model("NFTCollection", NFTmappingSchema)

const NFTCollection = models.NFTCollection || model('NFTCollection', NFTCollectionSchema);

export default NFTCollection;