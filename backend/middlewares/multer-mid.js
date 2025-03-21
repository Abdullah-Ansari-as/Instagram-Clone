// import multer from "multer"; 

// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, "./public/temp")
// 	},
// 	filename: (req, file, cb) => { 
// 		cb(null, file.originalname)
// 	}
// })

// export const upload = multer({ storage }); 


import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, path.join(__dirname, "../public/temp")); // Ensure correct path
	},
	filename: (req, file, cb) => { 
		cb(null, file.originalname);
	}
});

export const upload = multer({ storage });