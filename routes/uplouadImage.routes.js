import express from "express";
import { uploadImg } from "../config/cloudinarry.config.js";

const uploadImgRouter = express.Router();

uploadImgRouter.post("/", uploadImg.single("picture"), (req, res) => {
  if (!req.file) {
    console.log(req.file);
    return res.status(400).json({ msg: "Upload fail" });
  }

  return res.status(201).json({ url: req.file.path });
});

uploadImgRouter.post("/edit", uploadImg.single("picture"), (req, res) => {
  if (!req.file) {
    return res.status(200).json({ msg: "Upload fail" });
  }

  return res.status(201).json({ url: req.file.path });
});

export { uploadImgRouter };
