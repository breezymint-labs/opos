"use client";
import * as React from "react";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import { MuiFileInput } from "mui-file-input";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function create() {
  const [description, setDescription] = React.useState<string>("");
  const [name, setName] = React.useState<string>("");
  const [symbol, setSymbol] = React.useState<string>("");
  const [shortlist, setShortlist] = React.useState<string>("");

  const [loading, setLoading] = React.useState(false);

  const [value, setValue] = React.useState(null);
  const handleChange = (newValue: any) => {
    setValue(newValue);
  };
  const router = useRouter();

  async function mintCollection(e: any) {
    e.preventDefault();
    const data = {
      collectionName: name,
      collectionSymbol : symbol,
    };
    const response = await axios.post('/api/create/', data);
    if(response.status === 201) {
        router.push('/');
    }
  }

  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 mb-4">Create Collection</h2>
            <p className="text-xl text-gray-600">
              Fill all the details below and launch your POAP collection now!
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              sx={{ marginTop: 1 }}
            />

            <InputLabel id="" sx={{ marginTop: 3 }}>
              Select Image
            </InputLabel>

            <MuiFileInput
              value={value}
              onChange={handleChange}
              placeholder="Collection's Image"
              sx={{ marginTop: 1 }}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              rows={2}
              value={shortlist}
              onChange={(e) => setShortlist(e.target.value)}
              sx={{ marginTop: 1 }}
            />

            <div className="mt-8 w-full flex justify-center items-center">
              <button
                onClick={mintCollection}
                disabled={loading}
                className="py-4 px-10 mx-auto text-white bg-blue-600 hover:bg-blue-700  rounded-md text-sm disabled:opacity-60"
              >
                Mint Collection 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
