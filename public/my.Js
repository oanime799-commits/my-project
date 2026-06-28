
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


function uploadFile() {
const fileinput = document.querySelector('monk');
const file = fileinput.files[0];
if (!file) {
alert('اختر اول ملف pdf')
}

const formdata = new FormData();
formdata.append('mydata' , file);
}


fetch("https://my-project-production-9dbd.up.railway.app/upload" , {
method : "POST" ,
body : FormData
})
.then(response => response.JSON())
.then(data =>{
console.log(data)
alert(data);
}) 


