
let currentQuestion = 0;
let score = 0;


let questions = [
{
question : "",
options: [],
correct: ""
}
]

let answers = document.querySelectorAll(".answer")
let question = document.getElementById("question"); //==
function shoq () {
question.innerText = questions[currentQuestion].question;
answers[0].innerText = questions[currentQuestion].options[0];
answers[1].innerText = questions[currentQuestion].options[1];
answers[2].innerText = questions[currentQuestion].options[2];
answers[3].innerText = questions[currentQuestion].options[3];
} ; 



fetch("https://my-project-production-56bf.up.railway.app/" , {
method : "POST" ,
body : JSON.stringify({
answers : "" ,
questions : "" ,
options : ""
}) ,
headers : {"Content-Type":"application/json"}
})
.then(response => response.JSON())
.then(data =>{
console.log(data)
}) 


