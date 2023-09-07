"use client";
import * as React from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import { MuiFileInput } from "mui-file-input";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Web3Storage } from "web3.storage";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// form uri -----------------------------------------------------------done
// funds transfer to vault account ------------------------------------done
// call create database -----------------------------------------------done
// call fetch database
// hardcode connection and payer
// comparison check
// call mintCompressedNFT() function with parameters

export default function create() {
    const [formInput, setFormInput] = React.useState({
        name: "",
        description: "",
        symbol: "",
        shortlist: [],
        cover: "",
    });

    const [imageLoading, setImageLoading] = React.useState(false);
    const [mintLoading, setMintLoading] = React.useState(false);

    const { publicKey, sendTransaction } = useWallet();
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

    const successMint = () =>
        toast.success("Successful Collection Mint!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });

    const errorMint = () =>
        toast.error("Minting Failed!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });

    async function changeImage(e: any) {
        setImageLoading(true);
        const inputFile = e.target.files[0];
        const inputFileName = e.target.files[0].name;
        const files = [new File([inputFile], inputFileName)];
        const metaCID = await uploadToIPFS(files);
        const url = `https://ipfs.io/ipfs/${metaCID}/${inputFileName}`;
        console.log(url);
        setFormInput({ ...formInput, cover: url });
        setImageLoading(false);
    }

    async function mintCollection(e: any) {
        e.preventDefault();
        setMintLoading(true);
        const metadataUri = await createURI();
        console.log(metadataUri);
        // let amount = await calculateCost()
        let amount = 0.001;
        // sendSol(amount);

        const data = {
            collectionName: formInput.name,
            collectionSymbol: formInput.symbol,
            metadataUri: metadataUri,
        };

        try {
            const response = await axios.post("/api/create/", data);
            setMintLoading(false);
            if (response.status === 201) {
                successMint
                console.log("Successful Collection Mint");
            } else if (response.status === 500){
                errorMint
            }
        } catch (error: any) {
            console.error(error.response.data);
        }
    }

    async function calculateCost() {
        // create collection cost
        // mint nft cost
    }

    function sendSol(amount: number) {
        const transaction = new web3.Transaction();
        // vault account public key
        const recipientPubKey = `3PoUsfrtuzwrLP8AhvA7PEvEy9wJcbWGYKaj8k5uekXz`;

        const sendSolInstruction = web3.SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: recipientPubKey,
            lamports: web3.LAMPORTS_PER_SOL * amount,
        });

        transaction.add(sendSolInstruction);

        sendTransaction(transaction, connection).then((sig) => {
            console.log(sig);
        });
    }

    async function createURI() {
        const { name, description, symbol, cover } = formInput;
        if (!name || !description || !symbol || !cover) return;
        const data = JSON.stringify({ name, description, symbol, cover });
        const files = [new File([data], "data.json")];
        try {
            const metaCID = await uploadToIPFS(files);
            const metaUrl = `https://ipfs.io/ipfs/${metaCID}/data.json`;
            // console.log(metaUrl);
            return metaUrl;
        } catch (error) {
            console.log("Error uploading:", error);
        }
    }

    // --web3-storage-token functions

    function getAccessToken() {
        // return process.env.NEXT_PUBLIC_Web3StorageID
        return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkyMjkyQjQ5YzFjN2ExMzhERWQxQzQ3NGNlNmEyNmM1NURFNWQ0REQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjUyMzg2MDc1NDEsIm5hbWUiOiJNZXRhRmkifQ.cwyjEIx8vXtTnn8Y3vctroo_rooHV4ww_2xKY-MT0rs";
    }

    function makeStorageClient() {
        return new Web3Storage({ token: getAccessToken() });
    }

    const uploadToIPFS = async (files: any) => {
        const client = makeStorageClient();
        const cid = await client.put(files);
        return cid;
    };

    return (
        <section className="relative">
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
                <div className="py-12 md:py-20">
                    {/* Section header */}
                    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                        <h2 className="h2 mb-4">Create Collection</h2>
                        <p className="text-xl text-gray-600">
                            Fill all the details below and launch your POAPs
                            collection now!
                        </p>
                    </div>

                    <div className="max-w-xl mx-auto pb-12 md:pb-20">
                        {/* <div>
                            <button onClick={successMint}>Success!</button>
                            <button onClick={errorMint}>Error!</button>
                        </div> */}
                        <InputLabel
                            id=""
                            sx={{ marginTop: 3, marginBottom: 1 }}
                        >
                            Collection Image
                        </InputLabel>
                        <div className="flex items-center justify-center w-full">
                            <label
                                // for="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-200 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-100"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg
                                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                    </svg>
                                    {imageLoading ? (
                                        <div>Loading..</div>
                                    ) : formInput.cover == "" ? (
                                        <div>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">
                                                    Click to upload
                                                </span>{" "}
                                                or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                SVG, PNG, JPG or GIF (MAX.
                                                800x400px)
                                            </p>
                                        </div>
                                    ) : (
                                        <div>We got your image</div>
                                    )}
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    onChange={changeImage}
                                />
                            </label>
                        </div>

                        <div className="flex flex-row gap-8">
                            <div>
                                <InputLabel id="" sx={{ marginTop: 2 }}>
                                    Name
                                </InputLabel>

                                <TextField
                                    id="outlined-textarea"
                                    label="Collection Name"
                                    placeholder="Sneak POAP"
                                    className="w-[22rem]"
                                    multiline
                                    rows={1}
                                    onChange={(e) =>
                                        setFormInput({
                                            ...formInput,
                                            name: e.target.value,
                                        })
                                    }
                                    value={formInput.name}
                                    sx={{ marginTop: 1 }}
                                    disabled={imageLoading}
                                />
                            </div>

                            <div>
                                <InputLabel id="" sx={{ marginTop: 2 }}>
                                    Symbol
                                </InputLabel>

                                <TextField
                                    id="outlined-textarea"
                                    label="Collection Symbol"
                                    placeholder="SNEAK"
                                    multiline
                                    rows={1}
                                    onChange={(e) =>
                                        setFormInput({
                                            ...formInput,
                                            symbol: e.target.value,
                                        })
                                    }
                                    value={formInput.symbol}
                                    sx={{ marginTop: 1 }}
                                    disabled={imageLoading}
                                />
                            </div>
                        </div>

                        <InputLabel id="" sx={{ marginTop: 2 }}>
                            Enter some description
                        </InputLabel>

                        <TextField
                            id="outlined-textarea"
                            label="Metadata description"
                            placeholder="Description of Image you want to mint"
                            multiline
                            fullWidth
                            rows={2}
                            onChange={(e) =>
                                setFormInput({
                                    ...formInput,
                                    description: e.target.value,
                                })
                            }
                            value={formInput.description}
                            sx={{ marginTop: 1 }}
                            disabled={imageLoading}
                        />

                        <InputLabel id="" sx={{ marginTop: 2 }}>
                            Enter shortlist
                        </InputLabel>

                        <TextField
                            id="outlined-textarea"
                            label="Shortlist"
                            placeholder="Those who can claim"
                            multiline
                            fullWidth
                            rows={8}
                            onChange={(e) =>
                                setFormInput({
                                    ...formInput,
                                    shortlist: e.target.value?.split(","),
                                })
                            }
                            value={formInput.shortlist}
                            sx={{ marginTop: 1 }}
                            disabled={imageLoading}
                        />

                        <div className="mt-8 w-full flex justify-center items-center">
                            <button
                                onClick={mintCollection}
                                disabled={mintLoading || imageLoading}
                                className="py-4 px-10 mx-auto text-white bg-blue-600 hover:bg-blue-700  rounded-md text-sm disabled:opacity-60"
                            >
                                {mintLoading ? (
                                    <div>Cooking..</div>
                                ) : (
                                    <div>Mint Collection</div>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
