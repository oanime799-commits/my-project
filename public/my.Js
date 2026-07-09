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
    }, 800);
  }, 7000);
});

let currentQuestion = 0;
let score = 0;
let questions = [];

const TIME_PER_QUESTION = 120;
let timeLeft = TIME_PER_QUESTION;
let timerInterval = null;

let answers = document.querySelectorAll(".answer");
let question = document.getElementById("question");
let timerDisplay = document.getElementById("timerDisplay");
function startTimer() {
  clearInterval(timerInterval);
  timeLeft = TIME_PER_QUESTION;
  updateTimerDisplay();
timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
if (timeLeft <= 0) {
      clearInterval(timerInterval);
      goToNextQuestion();
    }
    }, 1000);
}

function updateTimerDisplay() {
  if (!timerDisplay) return;
  timerDisplay.innerText = `⏱ ${timeLeft}`;
  if (timeLeft <= 5) {
    timerDisplay.classList.add("timer-warning");
  } else {
    timerDisplay.classList.remove("timer-warning");
  }
}
function shoq() {
  question.innerText = questions[currentQuestion].question;
  answers[0].innerText = "A " + questions[currentQuestion].options[0];
  answers[1].innerText = "B " + questions[currentQuestion].options[1];
  answers[2].innerText = "C " + questions[currentQuestion].options[2];
  answers[3].innerText = "D " + questions[currentQuestion].options[3];
  startTimer();
}

function checkAnswer(selectedIndex) {
  if (!questions || questions.length === 0) {
    alert("لازم ترفع ملف الامتحان اول");
    return;
  }

  clearInterval(timerInterval);

  const correctAnswer = questions[currentQuestion].correct;
  const selectedText = questions[currentQuestion].options[selectedIndex];

  if (selectedText === correctAnswer) {
    score++;
  }
  goToNextQuestion();
}

function goToNextQuestion() {
  currentQuestion++;

  if (currentQuestion < questions.length) {
    shoq();
  } else {
    clearInterval(timerInterval);
    if (timerDisplay) timerDisplay.innerText = "";
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
    alert('اختر اول ملف pdf');
    return;
  }
  const formData = new FormData();
  formData.append('mydata', file);

  fetch("/upload", {
    method: "POST",
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      console.log("البيانات المستلمه:", data);
      if (data && Array.isArray(data) && data.length > 0) {
        questions = data;
        currentQuestion = 0;
        score = 0;
        document.getElementById("uploadSection").style.display = "none";
        document.getElementById("answersSection").style.display = "flex";
        shoq();
      } else {
        console.error("الخادم لم يرسل البيانات صحيحه:", data);
        alert("لم يتم استخراج الاسئله من الملف.");
      }
    })
    .catch(error => {
      console.log("خطا في الاستقبال", error);
    });
}

function loadPreviousExam() {
  fetch("/last-exam")
    .then(response => {
      if (!response.ok) {
        throw new Error("ماكو امتحان سابق مخزون");
      }
      return response.json();
    })
    .then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        questions = data;
        currentQuestion = 0;
        score = 0;
        document.getElementById("uploadSection").style.display = "none";
        document.getElementById("answersSection").style.display = "flex";
        shoq();
      } else {
        alert("لا يوجد امتحان سابق");
      }
    })
    .catch(error => {
      console.error(error);
      alert("لا يوجد امتحان سابق مخزون، ارفع ملف جديد");
    });
}