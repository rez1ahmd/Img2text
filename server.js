const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.static(__dirname));

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const result = await Tesseract.recognize(imagePath, "eng+ben");
    const extractedText = result.data.text;

    const response = await axios.post("https://libretranslate.com/translate", {
      q: extractedText,
      source: "auto",
      target: "en",
      format: "text"
    }, {
      headers: { "Content-Type": "application/json" }
    });

    fs.unlinkSync(imagePath);

    res.json({ translatedText: response.data.translatedText });
  } catch (err) {
    res.status(500).json({ error: "Translation failed", details: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));