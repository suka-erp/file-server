import express, { Request, Response } from "express";
import cors from "cors";
import compression from "compression";
import Multer from "multer";

import Storage from "./utils/storageHandler";

const PORT = process.env.PORT || 3000;
const server = express();
const storage = new Storage();
const multer = Multer({
  storage: Multer.memoryStorage(),
});

server.use(cors());
server.use(compression());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.post(
  "/upload",
  multer.single("file"),
  async (req: Request, res: Response) => {
    try {
      const { file } = req;

      if (!file) {
        return;
      }

      const upload = await storage.upload(file);

      if (upload.status !== 200) {
        return res.status(400).json({ message: "Could not upload file!" });
      }

      return res
        .status(200)
        .json({ message: "File uploaded successfully!", url: upload.url });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong!", error });
    }
  }
);

server.listen(PORT, () => {
  console.log(`Server started listening on ${PORT}`);
});
