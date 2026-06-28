
 


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
const fileinput = document.querySelector('.monk');
const file = fileinput.files[0];
if (!file) {
alert('اختر اول ملف pdf')
}

const FormData = new FormData();
FormData.append('mydata' , file);

fetch("/upload", {
method : "POST" ,
body : FormData  
.then(response => response.json())
.then(data =>{
console.log(data)
questions = data ;
currentQuestion = 0;
score = 0;
alert(data);
shoq();
})
.catch (error => {
console.log("خطا في الاستقبال" , error)
})

})

}




