import mongoose from "mongoose";

const connectDB = async () => {
	try {
		// console.log(process.env.MONGODB_URI)
		const connectionInstance = await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://yousaf8666305:SsKdN5pCseKU5sRn@cluster0.hoh21.mongodb.net/instagram?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
		console.log(`MongoDB connected !! DB HOST; ${connectionInstance.connection.host}`)
	} catch (error) {
		console.log("DB connection FAILD: ", error);
	}
}

export default connectDB