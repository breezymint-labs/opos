import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    clusterApiUrl,
} from "@solana/web3.js";
import { ValidDepthSizePair } from "@solana/spl-account-compression";
import {
    MetadataArgs,
    TokenProgramVersion,
    TokenStandard,
} from "@metaplex-foundation/mpl-bubblegum";
import { CreateMetadataAccountArgsV3 } from "@metaplex-foundation/mpl-token-metadata";
import {
    createCollection,
    createTree,
    mintCompressedNFT,
} from "../../../scripts/index";

export const POST = async (req: Request, res: Response) => {

    const body = await req.json();
    const { collectionName, collectionSymbol, metadataUri } = body;

    const connection = new Connection("https://api.devnet.solana.com/");

    //* payer should be replaced by the collection owner
    const account = process.env.VAULT_ACCOUNT;

    const payer = Keypair.fromSecretKey(
        new Uint8Array(
            JSON.parse(account)
        )
    );

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

        //* collection creation finished
        return new Response(JSON.stringify(collection), { status: 201 });
    } catch (error) {
        return new Response("Failed to create the collection", { status: 500 });
    }
};
