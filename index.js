const container = document.getElementById("container");
const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");
const inputs = document.querySelectorAll(".otp-input");
const submitBtn = document.getElementById("submit-btn");

let currentIndex = 0;
let riddles = [];
let riddleText;

let answerInput = "";

fetch("./data.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    riddles = data;
    const currentRiddle = riddles[currentIndex];
    renderRiddle(currentRiddle.question, currentRiddle.answer);
  })
  .catch((error) => {
    console.error("Error loading riddles:", error);
  });

nextBtn.addEventListener("click", () => {
  if (riddles.length === 0) return;

  currentIndex++;

  if (currentIndex >= riddles.length) {
    currentIndex = 0;
  }

  const currentRiddle = riddles[currentIndex];
  renderRiddle(currentRiddle.question, currentRiddle.answer);
});

prevBtn.addEventListener("click", () => {
  if (riddles.length === 0) return; // handle no riddles loaded

  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = riddles.length - 1; // wrap to the last riddle
  }

  const currentRiddle = riddles[currentIndex];
  renderRiddle(currentRiddle.question, currentRiddle.answer);
});

inputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    const value = e.target.value;
    if (value) {
      // Move to next input
      if (index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !e.target.value) {
      // Move to previous input
      if (index > 0) {
        inputs[index - 1].focus();
      }
    }
  });
});

function renderRiddle(question, answer) {
  // Clear container first
  container.innerHTML = "";

  // Show the question
  const riddleText = document.createElement("h2");
  riddleText.classList.add("riddles");
  riddleText.textContent = question;
  container.appendChild(riddleText);

  // Create inputs based on the answer
  const answerContainer = document.createElement("div");
  answerContainer.classList.add("answer-inputs");

  for (let i = 0; i < answer.length; i++) {
    const char = answer[i];

    if (char === " ") {
      const space = document.createElement("span");
      space.classList.add("space");
      space.textContent = " ";
      answerContainer.appendChild(space);
    } else {
      const input = document.createElement("input");
      input.type = "text";
      input.maxLength = 1;
      input.classList.add("letter-input");
      answerContainer.appendChild(input);

      input.addEventListener("input", () => {
        answerInput += input.value;
        if (input.value && i < answer.length - 1) {
          // Focus next input if current one is filled
          answerContainer.children[i + 1].focus();
        }
      });

      answerContainer.appendChild(input);
    }
  }

  container.appendChild(answerContainer);

  const firstInput = answerContainer.querySelector("input");
  if (firstInput) {
    firstInput.focus();
  }
}

submitBtn.addEventListener("click", () => {
  // Collect the values from all the inputs inside the answer container
  let answerInput = "";
  const answerInputs = document.querySelectorAll(".answer-inputs input");
  answerInputs.forEach((input) => {
    answerInput += input.value;
  });

  const currentRiddle = riddles[currentIndex];
  if (answerInput === currentRiddle.answer) {
    alert("Correct Answer!");

    currentIndex++;

    const currentRiddle = riddles[currentIndex];
    renderRiddle(currentRiddle.question, currentRiddle.answer);
  } else {
    alert("Incorrect Answer!");
  }
});
