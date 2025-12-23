import mongoose from "mongoose";  

export const connectDB = async ()  => {
  try {
    const mongoURL = process.env.DB_URL;

    if (!mongoURL) {
      throw new Error('MongoURL is not in the .env file')
    };

    await mongoose.connect(mongoURL);
    console.log('DB Connected successfully')
  } catch (err) {
    console.log(`Failed to connect to mongodb: ${err}`)
  }
}
