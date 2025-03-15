import mongoose from "mongoose";

const connectDB = async () => {
	try {
		const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/instagram`, { useNewUrlParser: true, useUnifiedTopology: true });
		console.log(`MongoDB connected !! DB HOST; ${connectionInstance.connection.host}`)
	} catch (error) {
		console.log("DB connection FAILD: ", error);
	}
}

export default connectDB