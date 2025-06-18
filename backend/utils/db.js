import mongoose from "mongoose";

const connectDB = async () => {
	try {
		// console.log(process.env.MONGODB_URI) 
		const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
		console.log(`MongoDB connected !! DB HOST; ${connectionInstance.connection.host}`)
	} catch (error) {
		console.log("DB connection FAILD: ", error);
	}
}

export default connectDB