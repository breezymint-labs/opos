import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () =>{
    mongoose.set('strictQuery');

    if(isConnected){
        console.log("MongoDB is Connected");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'proto-web',
            useNewUrlParser : true,
            useUnifiedTopology : true,
        })

        isConnected = true;
        console.log("MongoDB is Connected Successfully");
    } catch (error) {
        console.log(error);
    }
}