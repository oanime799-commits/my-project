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
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)




app.post("/upload",upload.single('mydata'),async(req ,res) => {
try {
const fike = fs.readFileSync(req.file.path);
const parser = new PDFParse({data:fike});
const pdfdata = await parser.getText;
await parser.destroy();
const text = pdfdata.text;
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" ,
generationConfig:{responseMimeType: "application/json"}
})


const Prompt = `
[
{
"question" : "String",
"options" : ["option1" , "option2" , "option3" , "option4"],
} 
]

`;


const finalresult = await model.generateContent(Prompt + text);
const response = await result.response;
const data = JSON.parse(response.text());
const result = Array.isArray(data) ? data : [data] ;
res.json(result);



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

