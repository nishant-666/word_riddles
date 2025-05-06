document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const submitBtn = document.getElementById("submit-btn");
  const keyboard = document.getElementById("keyboard");

  let currentIndex = 0;
  let riddles = [];
  const inputsList = [];

  fetch("./data.json")
    .then((r) => {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    })
    .then((data) => {
      riddles = data;
      renderRiddle(riddles[0]);
    })
    .catch(console.error);

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % riddles.length;
    renderRiddle(riddles[currentIndex]);
  });
  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + riddles.length) % riddles.length;
    renderRiddle(riddles[currentIndex]);
  });
  submitBtn.addEventListener("click", () => {
    const answerInput = inputsList.map((i) => i.value).join("");
    if (
      answerInput.toLowerCase() === riddles[currentIndex].answer.toLowerCase()
    ) {
      alert("Correct!");
      nextBtn.click();
    }
  });

  function renderRiddle({ question, answer, hints = [], keys = [] }) {
    container.innerHTML = "";
    inputsList.length = 0;

    const qEl = document.createElement("h2");
    qEl.textContent = question;
    qEl.classList.add("question-header");
    container.appendChild(qEl);

    const ansDiv = document.createElement("div");
    ansDiv.classList.add("answer-inputs");
    for (let i = 0; i < answer.length; i++) {
      if (answer[i] === " ") {
        const sp = document.createElement("span");
        sp.classList.add("space");
        sp.textContent = " ";
        ansDiv.appendChild(sp);
      } else {
        const inp = document.createElement("input");
        inp.type = "text";
        inp.maxLength = 1;
        inp.classList.add("letter-input");
        if (hints.includes(i)) {
          inp.value = answer[i];
          inp.readOnly = true;
          inp.classList.add("hint");
        } else {
          inp.addEventListener("input", () => moveFocus(1, inp));
          inp.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !inp.value) moveFocus(-1, inp);
          });
        }
        inputsList.push(inp);
        ansDiv.appendChild(inp);
      }
    }
    container.appendChild(ansDiv);
    inputsList.find((i) => !i.readOnly)?.focus();

    // render keyboard
    keyboard.innerHTML = "";
    if (keys.length) {
      const kbRow = document.createElement("div");
      keys.forEach((k) => {
        const span = document.createElement("span");
        span.textContent = k;
        span.classList.add("key-item");
        span.addEventListener("click", () => keyboardPress(k));
        kbRow.appendChild(span);
      });
      kbRow.classList.add("key-class");
      keyboard.appendChild(kbRow);
    }
  }

  function moveFocus(direction, fromInput) {
    const idx = inputsList.indexOf(fromInput);
    let i = idx + direction;
    while (i >= 0 && i < inputsList.length) {
      if (!inputsList[i].readOnly) {
        inputsList[i].focus();
        break;
      }
      i += direction;
    }
  }

  function keyboardPress(letter) {
    // Determine which input to fill:
    let target = document.activeElement;
    if (!(target instanceof HTMLInputElement) || target.readOnly) {
      // fallback: first empty writable input
      target = inputsList.find((inp) => !inp.readOnly && !inp.value);
    }
    if (!target) return;

    target.value = letter.toLowerCase();
    // then move forward
    moveFocus(1, target);
  }
});
