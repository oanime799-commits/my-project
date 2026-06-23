const express = require('express');
const app = express();
const multer = require('multer');
const upload = multer({dest : '/tmp/'});
const port = 5500;
const pdfparse = require("pdf-parse");
const fs = require("fs");
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
app.post("/upload",upload.single('mydata'),async(req ,res) => {
const fike = fs.readFileSync(req.file.path); 
const pdfdata = pdfparse(fike);
const text = pdfdata.text;
console.log(text);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const result = await model.generateContent(`...${text}`);
const questions = JSON.parse(result.response.text());
await question.insertMany(questions);
res.send("نجح انشاء الامتحان")
})
app.use(express.json());
app.use(express.static("public") ,(req , res) => {
res.send('تم ارسال الملف')
});
// لو صار خطأ غير متوقع
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// لو Promise فشل وما انمسك
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://sidrako:8763214@montazer.pdzcaav.mongodb.net/?appName=montazer')
const questionschema = new mongoose.Schema({
question : "string",
Option : ["string"],
correct : "string" 
})
const question = mongoose.model('questions' , questionschema)  /// po
app.listen(process.env.PORT || 5500, () =>{
console.log('Server running');
});


