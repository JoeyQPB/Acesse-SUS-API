import mongoose from "mongoose";

export async function DBconnect() {
  try {
    const dbConnect = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`Connected to DB: ${dbConnect.connection.name}`);
  } catch (err) {
    console.log(err);
  }
}
