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
const pdfdata = await parser.getText();
await parser.destroy();
const text = pdfdata.text;
const Prompt = `
TASK: Analyze the provided text and produce multiple-choice exam questions.

STEP 1: Check if the text already contains ready-made exam questions (with options like A/B/C/D or numbered choices).
- If YES: Extract those existing questions exactly as they are, along with their options and correct answers.
- If NO (the text is lecture content, explanations, or notes without ready questions): Generate NEW multiple-choice questions that test understanding of the key concepts in the text. Create at least 5 questions if the content allows it.

FORMAT: Return ONLY a valid JSON array. No markdown, no prefixes, no explanations.
STRUCTURE:
[
  {
    "question": "question text",
    "options": ["opt1", "opt2", "opt3", "opt4"],
    "correct": "correct option"
  }
]

CONSTRAINTS:
- Do NOT limit yourself to a fixed number of questions. Generate as many high-quality questions as the content justifies — could be 5, 10, 30, or more depending on the length and depth of the material. Cover every distinct concept, definition, and fact mentioned in the text.
TEXT TO ANALYZE:
`;




console.log("API KEY:", process.env.GROQ_API_KEY);
const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
            { role: "system", content: Prompt },
            { role: "user", content: text }
        ],
        temperature: 0.7 ,
        max_tokens:8000
    })
});
const aiData = await aiResponse.json();
console.log("استجابة الـ AI الخام:", JSON.stringify(aiData));

console.log(JSON.stringify(aiData, null, 2));
if (!aiData.choices) {
    console.log(aiData);
    throw new Error("OpenAI API Error");
}

// 1. استخراج النص بأمان
const rawText = aiData.choices[0].message.content;

if (!rawText) {
    throw new Error("لم يتم العثور على نص في استجابة النموذج");
}

 // 2. تنظيف الـ Markdown
const startIndex = rawText.indexOf('[');
const endIndex = rawText.lastIndexOf(']');

if (startIndex !== -1 && endIndex !== -1) {
    const cleanJson = rawText.substring(startIndex, endIndex + 1);
    try {
        finalResult = JSON.parse(cleanJson);
    } catch (e) {
        throw new Error("لم يتمكن النظام من قراءة التنسيق بشكل صحيح");
    }
} else {
    throw new Error("لم يتم العثور على مصفوفة بيانات في رد الذكاء الاصطناعي");
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
mongoose.connect(process.env.MONGO_URI);
console.log("MONGO_URI =", process.env.MONGO_URI);
const questionschema = new mongoose.Schema({
question : String,
options : [String],
correct : String 
})
const question = mongoose.model('questions' , questionschema)  /// po

