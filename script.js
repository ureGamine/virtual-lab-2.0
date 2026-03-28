const quizQuestions = [
  {
    question: "Bagian akar bawang merah yang paling tepat digunakan untuk mengamati mitosis adalah...",
    options: [
      "Ujung akar karena memiliki jaringan meristem aktif",
      "Daun tua karena banyak kloroplas",
      "Batang karena memiliki banyak stomata",
      "Kulit umbi karena kaya cadangan makanan"
    ],
    answer: 0,
    explanation: "Benar. Ujung akar memiliki jaringan meristem yang aktif membelah sehingga banyak sel sedang mengalami mitosis."
  },
  {
    question: "Pada fase metafase, ciri yang paling mudah diamati adalah...",
    options: [
      "Membran inti mulai terbentuk kembali",
      "Kromatid bergerak ke dua kutub sel",
      "Kromosom berjajar di bidang ekuator",
      "Sitoplasma mulai membelah menjadi dua"
    ],
    answer: 2,
    explanation: "Tepat. Pada metafase kromosom tersusun rapi di bidang ekuator sehingga mudah dikenali."
  },
  {
    question: "Pewarna yang digunakan untuk memperjelas inti dan kromosom pada preparat adalah...",
    options: [
      "HCl 36,5%",
      "Aceto Carmin 2%",
      "AAG 45%",
      "Air suling"
    ],
    answer: 1,
    explanation: "Benar. Aceto Carmin 2% digunakan untuk mewarnai inti sel dan kromosom."
  },
  {
    question: "Peristiwa utama yang terjadi pada anafase adalah...",
    options: [
      "Kromosom mulai memadat",
      "Kromatid saudara berpisah ke kutub berlawanan",
      "Kromosom berjajar di ekuator",
      "Membran inti mulai terlihat jelas"
    ],
    answer: 1,
    explanation: "Ya. Pada anafase, kromatid saudara ditarik ke arah kutub sel yang berlawanan."
  },
  {
    question: "Tujuan pemanasan preparat secara hati-hati adalah...",
    options: [
      "Menghentikan semua reaksi biologis secara permanen",
      "Memperbesar ukuran sel agar mudah dilihat",
      "Membantu penyerapan pewarna dan melunakkan jaringan",
      "Mengubah kromosom menjadi kromatin"
    ],
    answer: 2,
    explanation: "Benar. Pemanasan membantu pewarna masuk lebih baik dan memudahkan jaringan untuk dibuat preparat squash."
  }
];

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupRevealAnimations();
  setupSimulationLoader();
  setupQuiz();
});

function setupNavigation() {
  const currentPage = document.body.dataset.page;
  const navLinks = document.querySelectorAll("[data-nav]");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  navLinks.forEach((link) => {
    if (link.dataset.nav === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }

    link.addEventListener("click", () => {
      if (navMenu?.classList.contains("is-open")) {
        navMenu.classList.remove("is-open");
        navToggle?.setAttribute("aria-expanded", "false");
      }
    });
  });

  if (!navToggle || !navMenu) {
    return;
  }

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function setupRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal");

  if (!revealElements.length) {
    return;
  }
  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observerInstance.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function setupSimulationLoader() {
  const loader = document.querySelector("[data-simulation-loader]");
  const iframe = document.querySelector("[data-simulation-frame]");

  if (!loader || !iframe) {
    return;
  }

  const hideLoader = () => {
    loader.classList.add("is-hidden");
  };

  iframe.addEventListener("load", hideLoader, { once: true });
  window.setTimeout(hideLoader, 3200);
}

function setupQuiz() {
  const quizApp = document.querySelector("[data-quiz-app]");

  if (!quizApp) {
    return;
  }

  const scoreEl = quizApp.querySelector("[data-score]");
  const totalEl = quizApp.querySelector("[data-total]");
  const progressEl = quizApp.querySelector("[data-progress]");
  const questionEl = quizApp.querySelector("[data-question]");
  const optionsEl = quizApp.querySelector("[data-options]");
  const feedbackEl = quizApp.querySelector("[data-feedback]");
  const nextButton = quizApp.querySelector("[data-next]");
  const resultEl = quizApp.querySelector("[data-result]");
  const bodyEl = quizApp.querySelector("[data-quiz-body]");
  const resultTitleEl = quizApp.querySelector("[data-result-title]");
  const resultTextEl = quizApp.querySelector("[data-result-text]");
  const restartButton = quizApp.querySelector("[data-restart]");

  let currentQuestionIndex = 0;
  let score = 0;
  let answerLocked = false;

  totalEl.textContent = String(quizQuestions.length);
  const renderQuestion = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    questionEl.textContent = currentQuestion.question;
    progressEl.textContent = `Soal ${currentQuestionIndex + 1} dari ${quizQuestions.length}`;
    feedbackEl.textContent = "";
    feedbackEl.className = "quiz-feedback";
    nextButton.disabled = true;
    optionsEl.innerHTML = "";
    answerLocked = false;
    currentQuestion.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.textContent = option;
      button.addEventListener("click", () => handleAnswer(index));
      optionsEl.appendChild(button);
    });
  };
  const handleAnswer = (selectedIndex) => {
    if (answerLocked) {
      return;
    }

    answerLocked = true;
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const optionButtons = optionsEl.querySelectorAll(".quiz-option");
    const isCorrect = selectedIndex === currentQuestion.answer;
    optionButtons.forEach((button, index) => {
      button.disabled = true;

      if (index === currentQuestion.answer) {
        button.classList.add("correct");
      }

      if (index === selectedIndex && !isCorrect) {
        button.classList.add("wrong");
      }
    });
    if (isCorrect) {
      score += 1;
      scoreEl.textContent = String(score);
      feedbackEl.textContent = currentQuestion.explanation;
      feedbackEl.classList.add("correct");
    } else {
      feedbackEl.textContent = `Belum tepat. ${currentQuestion.explanation}`;
      feedbackEl.classList.add("wrong");
    }

    nextButton.disabled = false;
    nextButton.textContent = currentQuestionIndex === quizQuestions.length - 1 ? "Lihat Hasil" : "Soal Berikutnya";
  };
  const showResult = () => {
    bodyEl.classList.add("hidden");
    resultEl.classList.remove("hidden");

    let title = "Cukup baik, lanjutkan belajar";
    let message = `Kamu memperoleh skor ${score} dari ${quizQuestions.length}.`;
    if (score === quizQuestions.length) {
      title = "Excellent! Semua jawaban benar";
      message = `Skormu sempurna, ${score} dari ${quizQuestions.length}. Kamu sudah memahami konsep mitosis dengan sangat baik.`;
    }
    else if (score >= 4) {
      title = "Bagus sekali";
      message = `Kamu memperoleh ${score} dari ${quizQuestions.length}. Pemahamanmu sudah kuat, tinggal sedikit penguatan lagi.`;
    }
    else if (score >= 3) {
      title = "Hasilmu sudah cukup baik";
      message = `Kamu memperoleh ${score} dari ${quizQuestions.length}. Coba ulangi materi fase mitosis untuk hasil yang lebih tinggi.`;
    }

    resultTitleEl.textContent = title;
    resultTextEl.textContent = message;
  };
  const goToNextQuestion = () => {
    if (currentQuestionIndex === quizQuestions.length - 1) {
      showResult();
      return;
    }

    currentQuestionIndex += 1;
    renderQuestion();
  };
  const restartQuiz = () => {
    currentQuestionIndex = 0;
    score = 0;
    answerLocked = false;
    scoreEl.textContent = "0";
    bodyEl.classList.remove("hidden");
    resultEl.classList.add("hidden");
    nextButton.textContent = "Soal Berikutnya";
    renderQuestion();
  };
  nextButton.addEventListener("click", goToNextQuestion);
  restartButton.addEventListener("click", restartQuiz);

  renderQuestion();
}
document.addEventListener("DOMContentLoaded", setupSimulationScale);

function setupSimulationScale() {
  const viewport = document.querySelector("[data-simulation-viewport]");

  if (!viewport) {
    return;
  }
  const applyScale = () => {
    const scale = Math.min(viewport.clientWidth / 1280, 1);
    viewport.style.setProperty("--simulation-scale", String(scale));
    viewport.style.height = `${720 * scale}px`;
  };

  applyScale();
  window.addEventListener("resize", applyScale);
}