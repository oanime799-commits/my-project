const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname))
const multer = require('multer');
const fileFilter = (req, file, cb) => {
if (file.mimetype === 'application/pdf') {
cb (null , true) ;
} else {
cb(new Error ('pdf فقط'),false);
}
};
const upload = multer({dest:'/tmp/', fileFilter}) ;
const port = 5500;
const {PDFParse} = require("pdf-parse");
const fs = require("fs");
app.post("/upload",upload.single('mydata'),async(req ,res) => {
try {
const fike = fs.readFileSync(req.file.path);
const parser = new PDFParse({data:fike});
const pdfdata = await parser.getText;
await parser.destroy();
const text = pdfdata.text;
const Prompt = `
[
{
"question": "String",
"options":[
    "option1"
    "option2"
    "option3"
    "option4"
]
}
]
`;

const aiResponse = await fetch(
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}' ,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: Prompt + text }] }]
    })
  }
);

const aiData = await aiResponse.json();
const rawText = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
if (!rawText) {
    throw new Error("لم يتم العثور على نص في استجابة النموذج");
}
const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
let finalResult;
try {
    finalResult = JSON.parse(cleanJson);
} catch (e) {
    throw new Error("فشل تحويل استجابة النموذج إلى تنسيق JSON صحيح");
}
res.json(Array.isArray(finalResult) ? finalResult : [finalResult]);


 } catch (error) {

console.error("خطاء:", error);
res.status(500).json({error:error.message});
}

})

// لو صار خطأ غير متوقع
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// لو Promise فشل وما انمسك
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

app.get("/" , (req , res) => {
res.sendFile(__dirname + '/index.html')
})



app.listen(process.env.PORT || 5500, () =>{
console.log('Server running');
});


const mongoose = require("mongoose");
const { error } = require('console');
mongoose.connect('mongodb+srv://sidrako:8763214@montazer.pdzcaav.mongodb.net/?appName=montazer')
const questionschema = new mongoose.Schema({
question : string,
Option : [string],
correct : string 
})
const question = mongoose.model('questions' , questionschema)  /// po

