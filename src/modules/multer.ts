import { Request } from "express";
import multer from "multer";
import path from "path";

const filename = (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
  cb(null, Date.now() + "_" + file.originalname);
};

const storage = multer.diskStorage({
  destination(req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void)  {
    cb(null, "../images");
  },
  filename
});

const filterImage = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname);
  if(ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
    return cb(new Error("only_images"));
  }
  cb(null, true);
};

const uploadImage = multer({
  storage,
  fileFilter: filterImage
});

export default uploadImage;