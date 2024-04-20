import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

export default async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("[DATABASE]: Using existing connection");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI || "", {});
        connection.isConnected = db.connections[0].readyState;
        console.log(`[DATABASE]: New connection at ${connection.isConnected}`);

        console.log("[DATABASE_CHECK]", db);
    } catch (error) {
        console.error("[DATABASE]: Connection error : ", error);
        process.exit(1);
    }
}