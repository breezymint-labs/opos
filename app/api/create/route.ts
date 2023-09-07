import { Connection, Keypair } from "@solana/web3.js";
import { ValidDepthSizePair } from "@solana/spl-account-compression";
import { CreateMetadataAccountArgsV3 } from "@metaplex-foundation/mpl-token-metadata";
import { createCollection, createTree } from "../../../scripts/index";
import connectDb from "../../../config/dbConnection.js";
import NFTModal from "../../../config/schema.js";

export const POST = async (req: Request, res: Response) => {
    const body = await req.json();
    const { collectionName, collectionSymbol, metadataUri } = body;

    const connection = new Connection("https://api.devnet.solana.com/");

    //* payer should be replaced by the collection owner
    // const account = process.env.VAULT_ACCOUNT;
    // const payer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(account)));

    const payer = Keypair.fromSecretKey(new Uint8Array(JSON.parse("[72,112,40,218,181,68,47,102,143,13,241,5,65,28,72,20,70,51,194,91,36,130,19,115,221,193,177,131,182,81,85,202,35,142,181,24,232,206,32,248,194,184,145,171,110,42,44,82,160,184,214,35,142,65,193,255,38,43,87,85,14,113,11,217]")));

    // const receiver = new PublicKey(
    //     "8Wkd1h4QCtBM7bY4hmCGRZwuxYwsJA5SEMaLaPREBu5o"
    // );

    try {
        //* tree creation started
        const maxDepthSizePair: ValidDepthSizePair = {
            maxDepth: 14,
            maxBufferSize: 64,
        };
        const canopyDepth = maxDepthSizePair.maxDepth - 5;

        // define the address the tree will live at
        const treeKeypair = Keypair.generate();

        // create and send the transaction to create the tree on chain
        const tree = await createTree(
            connection,
            payer,
            treeKeypair,
            maxDepthSizePair,
            canopyDepth
        );

        //* tree creation finished

        //* collection creation started
        const collectionMetadataV3: CreateMetadataAccountArgsV3 = {
            data: {
                name: collectionName,
                symbol: collectionSymbol,
                // specific json metadata for the collection
                uri: metadataUri,
                sellerFeeBasisPoints: 100,
                creators: [
                    {
                        address: payer.publicKey,
                        verified: false,
                        share: 100,
                    },
                ],
                collection: null,
                uses: null,
            },
            isMutable: false,
            collectionDetails: null,
        };

        // create a full token mint and initialize the collection (with the `payer` as the authority)
        const collection = await createCollection(
            connection,
            payer,
            collectionMetadataV3
        );

        // --create call database
        // tree.treeAddress
        // collection.mint
        // metadataUri
        // collection.masterEditionAccount
        // collectionMetadataV3

        connectDb();
        let treeAddress = tree.treeAddress;
        let collectionMint = collection.mint;
        let collectionMetadata = metadataUri;
        let collectionMasterEditionAccount = collection.masterEditionAccount;
        let compressedNFTMetadata = collectionMetadataV3;
        let claimList : Array<Number> = [];

        NFTModal.create({
            collectionName,
            treeAddress,
            collectionMint,
            collectionMetadata,
            collectionMasterEditionAccount,
            compressedNFTMetadata,
            claimList,
        })
            .then((user: any) => res.json(user))
            .catch((err: any) =>
                res
                    .status(500)
                    .json({
                        error: "Error creating collection data record",
                        details: err,
                    })
            );
            console.log("Successfully added collection information to database")

        //* collection creation finished
        return new Response(JSON.stringify(collection), { status: 201 });
    } catch (error) {
        return new Response("Failed to create the collection", { status: 500 });
    }
};
