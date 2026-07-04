window.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splashScreen");
  const logo = document.querySelector(".splash-logo");
  const loader = document.querySelector(".splash-loader");
  const welcome = document.querySelector(".splash-welcome");

  // المرحلة 1: الشعار + اللودر لمدة 4 ثواني
  setTimeout(() => {
    logo.style.display = "none";
    loader.style.display = "none";
    welcome.style.display = "block";
  }, 4000);

  // المرحلة 2: بعد 3 ثواني إضافية (المجموع 7 ثواني) نطفي السبلاش
  setTimeout(() => {
    splash.classList.add("fade-out");
    setTimeout(() => {
      splash.style.display = "none";
    }, 800); // نفس مدة الـ transition بالـ CSS
  }, 7000);
});
let currentQuestion = 0;
let score = 0;
let questions = [];   // ← فاضية فعلاً

let answers = document.querySelectorAll(".answer");
let question = document.getElementById("question");

function shoq() { 
question.innerText = questions[currentQuestion].question;
answers[0].innerText = "A  " + questions[currentQuestion].options[0];
answers[1].innerText = "B  " + questions[currentQuestion].options[1];
answers[2].innerText = "C  " + questions[currentQuestion].options[2];
answers[3].innerText = "D  " + questions[currentQuestion].options[3];
 }

function checkAnswer(selectedIndex) {
  if (!questions || questions.length === 0) {
    alert("لازم ترفع ملف الامتحان اول");
    return;
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
  } 
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




