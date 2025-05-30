import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number
}

const connection: connectionObject = {};

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Database is already connected");
        return ;
    }

    try{
        const dbResponse = await mongoose.connect(process.env.DB_URL || "");
        console.log(dbResponse);
        
        connection.isConnected = dbResponse.connections[0].readyState;
        console.log("Database connected successfully");
    }
    catch(error: unknown){
        console.log("Database connection failed");
        if(error instanceof Error){
            console.log(error.message);
        }
        else{
            console.log("Unknown error", error);
        }

        process.exit(1);
    }
}

export default dbConnect;