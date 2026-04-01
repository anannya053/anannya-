const screens = {
  landing: document.getElementById("landingScreen"),
  hearts: document.getElementById("heartScreen"),
  bigHeart: document.getElementById("bigHeartScreen"),
  dialogue: document.getElementById("dialogueScreen"),
  final: document.getElementById("finalScreen"),
};

const startApology = document.getElementById("startApology");
const floatingHearts = document.getElementById("floatingHearts");
const messageClouds = document.getElementById("messageClouds");
const makeSmileButton = document.getElementById("makeSmileButton");
const openDialogue = document.getElementById("openDialogue");
const myBubbles = document.getElementById("myBubbles");
const hisBubbles = document.getElementById("hisBubbles");
const choicePrompt = document.getElementById("choicePrompt");
const choiceButtons = document.getElementById("choiceButtons");

const heartMessages = [
  "I'm sorry for what happened that day...",
  "I should have told you earlier...",
  "You really matter to me...",
  "Your friendship means a lot to me...",
  "I never wanted to hurt you...",
  "I miss our bond more than I can say...",
  "You stayed in my heart the whole time...",
  "I just want to make things right...",
];

const initialDialogue = [
  { side: "me", text: "Nadiya…" },
  { side: "him", text: "Ji…" },
  { side: "me", text: "Meri soni suhani…" },
  { side: "him", text: "Ji…" },
  { side: "me", text: "Meri bago…" },
  { side: "him", text: "Jii…" },
  { side: "me", text: "Naraz ho mujhse?" },
];

let ambientHeartsStarted = false;
let audioStarted = false;
const backgroundAudio = document.getElementById("backgroundAudio");

function showScreen(screenToShow) {
  Object.values(screens).forEach((screen) => {
    screen.classList.remove("screen-active");
    screen.classList.add("hidden");
  });

  screenToShow.classList.remove("hidden");
  screenToShow.classList.add("screen-active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function createFloatingHeart() {
  const heart = document.createElement("span");
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDuration = `${9 + Math.random() * 6}s`;
  heart.style.opacity = `${0.45 + Math.random() * 0.35}`;
  heart.style.transform = `rotate(-45deg) scale(${0.7 + Math.random() * 0.42})`;
  heart.style.background = Math.random() > 0.5 ? "var(--heart)" : "var(--heart-dark)";
  const text = document.createElement("strong");
  text.textContent = heartMessages[Math.floor(Math.random() * heartMessages.length)];
  heart.appendChild(text);
  floatingHearts.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 12000);
}

function startAmbientHearts() {
  if (ambientHeartsStarted) {
    return;
  }

  ambientHeartsStarted = true;
  for (let i = 0; i < 14; i += 1) {
    setTimeout(createFloatingHeart, i * 260);
  }
  setInterval(createFloatingHeart, 700);
}

function startMusic() {
  if (!backgroundAudio) {
    return;
  }
  if (audioStarted) {
    backgroundAudio.play().catch(() => {});
    return;
  }

  audioStarted = true;
  backgroundAudio.currentTime = 42;
  backgroundAudio.volume = 0.45;
  backgroundAudio.play().catch(() => {
    audioStarted = false;
  });
}

function renderHeartMessages() {
  messageClouds.innerHTML = "";
  heartMessages.forEach((message, index) => {
    const card = document.createElement("article");
    card.className = "heart-message";
    card.style.animationDelay = `${index * 0.12}s`;

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    card.appendChild(paragraph);
    messageClouds.appendChild(card);
  });
}

function addBubble(side, text) {
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble";
  bubble.textContent = text;
  if (side === "me") {
    myBubbles.appendChild(bubble);
  } else {
    hisBubbles.appendChild(bubble);
  }
}

function renderChoices(prompt, choices) {
  choicePrompt.textContent = prompt;
  choiceButtons.innerHTML = "";

  choices.forEach(({ label, action }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", action);
    choiceButtons.appendChild(button);
  });
}

function askIfUpset() {
  renderChoices("Tell me honestly...", [
    {
      label: "Jiii",
      action: () => {
        addBubble("him", "Jiii");
        setTimeout(askToForgive, 500);
      },
    },
    {
      label: "Jii bahut zyada",
      action: () => {
        addBubble("him", "Jii bahut zyada");
        setTimeout(askToForgive, 500);
      },
    },
  ]);
}

function askToForgive() {
  addBubble("me", "Maan jao na…");

  setTimeout(() => {
    renderChoices("Please?", [
      {
        label: "Thik hai",
        action: () => {
          addBubble("him", "Thik hai");
          setTimeout(() => showScreen(screens.final), 700);
        },
      },
      {
        label: "Nahi",
        action: () => {
          addBubble("him", "Nahi");
          setTimeout(askToForgive, 600);
        },
      },
    ]);
  }, 450);
}

function playDialogueSequence() {
  myBubbles.innerHTML = "";
  hisBubbles.innerHTML = "";
  choiceButtons.innerHTML = "";
  choicePrompt.textContent = "Wait for the little conversation to finish...";

  initialDialogue.forEach((line, index) => {
    setTimeout(() => {
      addBubble(line.side, line.text);
      if (index === initialDialogue.length - 1) {
        setTimeout(askIfUpset, 700);
      }
    }, index * 2000);
  });
}

function openHeartMessages() {
  startMusic();
  showScreen(screens.hearts);
  startAmbientHearts();
  renderHeartMessages();
}

startApology.addEventListener("click", openHeartMessages);
startApology.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openHeartMessages();
  }
});

makeSmileButton.addEventListener("click", () => {
  startMusic();
  showScreen(screens.bigHeart);
});

openDialogue.addEventListener("click", () => {
  startMusic();
  showScreen(screens.dialogue);
  playDialogueSequence();
});

for (let i = 0; i < 14; i += 1) {
  setTimeout(createFloatingHeart, i * 250);
}

document.addEventListener(
  "click",
  () => {
    startMusic();
  },
  { once: true }
);
