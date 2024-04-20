import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: string;
}

const connection: ConnectionObject = {};

export default async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("[DATABASE]: Using existing connection");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "", {});
        connection.isConnected = db.connections[0].host;
        console.log(`[DATABASE]: New connection at ${connection.isConnected}`);
    } catch (error) {
        console.error("[DATABASE]: Connection error : ", error);
        process.exit(1);
    }
}