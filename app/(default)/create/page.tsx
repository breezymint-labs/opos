"use client";
import * as React from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import { MuiFileInput } from "mui-file-input";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Web3Storage } from "web3.storage";

// form uri -----------------------------------------------------------done
// funds transfer to vault account 
// call create database
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

    const [loading, setLoading] = React.useState(false);

    async function changeImage (e: any) {
        const inputFile = e.target.files[0]
        const inputFileName = e.target.files[0].name
        const files = [new File([inputFile], inputFileName)]
        const metaCID = await uploadToIPFS(files)
        const url = `https://ipfs.io/ipfs/${metaCID}/${inputFileName}`
        console.log(url)
        setFormInput({ ...formInput, cover: url });
    };

    async function mintCollection(e: any) {
        
        e.preventDefault();
        const metadataUri = await createURI();
        // --tx funds transfer to mint account
        // 3PoUsfrtuzwrLP8AhvA7PEvEy9wJcbWGYKaj8k5uekXz

        const data = {
            collectionName: formInput.name,
            collectionSymbol: formInput.symbol,
            metadataUri: metadataUri
        };
        try {
            const response = await axios.post("/api/create/", data);
            if (response.status === 201) {
                // react toastify
                console.log("collection minted")
            }
        } catch (error: any) {
            console.error(error.response.data);
        }
    }

    async function calculateCost() {
        // create collection cost
        // mint nft cost
    }

    async function createURI() {
        const { name, description, symbol, cover } = formInput;
        if (
            !name ||
            !description ||
            !symbol ||
            !cover
        )
            return;
        const data = JSON.stringify({ name, description, symbol, cover });
        const files = [new File([data], "data.json")];
        try {
            const metaCID = await uploadToIPFS(files);
            const metaUrl = `https://ipfs.io/ipfs/${metaCID}/data.json`;
            console.log(metaUrl);

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
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
                <div className="py-12 md:py-20">
                    {/* Section header */}
                    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                        <h2 className="h2 mb-4">Create Collection</h2>
                        <p className="text-xl text-gray-600">
                            Fill all the details below and launch your POAP
                            collection now!
                        </p>
                    </div>

                    <div className="max-w-xl mx-auto pb-12 md:pb-20">
                        <InputLabel id="" sx={{ marginTop: 0 }}>
                            Name
                        </InputLabel>

                        <TextField
                            id="outlined-textarea"
                            label="Collection Name"
                            placeholder="Sneak POAP"
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
                        />

                        <InputLabel id="" sx={{ marginTop: 1 }}>
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
                        />

                        <InputLabel id="" sx={{ marginTop: 3 }}>
                            Select Image
                        </InputLabel>

                        {/* <MuiFileInput */}
                        <input
                        type="file"
                            // value={formInput.cover}
                            onChange={changeImage}
                            placeholder="Collection's Image"
                            // sx={{ marginTop: 1 }}
                        />

                        <InputLabel id="" sx={{ marginTop: 3 }}>
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
                        />

                        <InputLabel id="" sx={{ marginTop: 3 }}>
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
                        />

                        <div className="mt-8 w-full flex justify-center items-center">
                            <button
                                onClick={mintCollection}
                                disabled={loading}
                                className="py-4 px-10 mx-auto text-white bg-blue-600 hover:bg-blue-700  rounded-md text-sm disabled:opacity-60"
                            >
                                Mint Collection
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
