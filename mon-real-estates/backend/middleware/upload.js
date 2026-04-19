// import multer from "multer";

// const storage = multer.memoryStorage();

// const upload = multer({ storage: storage });

// export default upload;


// using disk storage

import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // temporary folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

export default upload;
