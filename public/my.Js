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
answers[0].innerText = "A  " + questions[currentQuestion].options[0];
answers[1].innerText = "B  " + questions[currentQuestion].options[1];
answers[2].innerText = "C  " + questions[currentQuestion].options[2];
answers[3].innerText = "D  " + questions[currentQuestion].options[3];
} ; 

function checkAnswer(selectedIndex) {
  function checkAnswer(selectedIndex) {
  if (!questions || questions.length === 0) {
    alert("لازم ترفع ملف الامتحان اول");
    return;
  }
  // ...باقي الكود الموجود
}
  const correctAnswer = questions[currentQuestion].correct;
  const selectedText = questions[currentQuestion].options[selectedIndex];

  if (selectedText === correctAnswer) {
    score++;
  }

  currentQuestion++;

  if (currentQuestion < questions.length) {
    shoq();
  } else {
  question.innerText = "";
  document.querySelector(".you").innerHTML = `
    <div class="result-card">
      <h2>🎉 انتهى الامتحان!</h2>
      <p class="result-score">نتيجتك: <span>${score}</span> من ${questions.length}</p>
      </div>
      <button type="button" class="retry-btn" onclick="location.reload()">إعادة المحاولة</button>
    
  `;
}
}

function uploadFile() {
const fileinput = document.querySelector('.monk');
const file = fileinput.files[0];
if (!file) {
alert('اختر اول ملف pdf')
return
}
const formData = new FormData();
formData.append('mydata' , file);

fetch("/upload", {
method : "POST" ,
body : formData  
})
.then(response => response.json())
.then(data => {
console.log("البيانات المستلمه:" , data);
if (data && Array.isArray(data) && data.length > 0) {
questions = data ;
currentQuestion = 0;
score = 0;
document.getElementById("uploadSection").style.display = "none";
document.getElementById("answersSection").style.display = "flex";
shoq();
} else {
console.error("الخادم لم يرسل البيانات صحيحه:" , data);
alert("لم يتم استخراج الاسئله من الملف : خطا.")
}
})
.catch (error => {
console.log("خطا في الاستقبال" , error)
})
}




