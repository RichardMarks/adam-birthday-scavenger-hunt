document.addEventListener("DOMContentLoaded", boot);

const clues = {
  XWREHT: "A comfy spot to sit and play, your first clue waits not far away.",
  SLRTYE:
    "In a room where space is tight, your clue awaits under the sink's dim light.",
  HMFDGU:
    "Where work is done and thoughts take flight, beneath a wooden perch, your next clue hides from sight.",
  JRPWNC:
    "Where clothes are cleaned and socks disappear, your next clue is hiding near.",
  YFGQWU:
    "Where pots and pans clang and stewpots steam, your clue waits not far from where it seems.",
  OQJLWM:
    "Where water cascades and cleanses the dirt of the day, a hidden spot awaits where your clue may lay.",
  ICYGJF:
    "Where tools clatter and curious creatures roam, a door beckons beyond the familiar zone.",
  ZQUTOL:
    "Where dreams take flight on pillows soft, your clue awaits, just a little aloft.",
  HEDWLV:
    "In a room where crafts and feline friends reside, beneath a cushion, your next clue does hide.",
  VBUWFR:
    "Where dreams take flight and peace is found, between soft boundaries, your next clue is bound.",
  FOCXNW:
    "Where bubbles rise and troubles subside, your clue's location, try to decide.",
  URJEVA:
    "Amongst the spices and pots of gold, your next clue hides, waiting to be told.",
  AQGOLW:
    "Where clothes whirl and machines hum, within a hidden nook, your next clue may come.",
  TXMFVO:
    "Where tasks are typed and ideas flow, atop a familiar device, your next clue may glow.",
  RKGQTF:
    "In a lofty perch where dreams take flight, your treasure awaits, hidden from sight.",
};

function isCodeValid(code) {
  return code in clues;
}

function getClueForCode(code) {
  return clues[code];
}

function boot() {
  const state = {
    status: "enter-name",
    name: "Adventurer",
    xp: 0,
    found: Object.keys(clues).map((k) => ({ [k]: false })),
  };
  const UI = {
    enterName: document.getElementById("enter-name"),
    enterCode: document.getElementById("enter-code"),
    nameInput: document.getElementById("name-input"),
    submitButton: document.getElementById("submit-button"),
    codeInput: document.getElementById("code-input"),
    clueText: document.getElementById("clue-text"),
    nameText: document.getElementById("name-text"),
    resultModal: document.getElementById("result-modal"),
    closeModal: document.querySelector(".close-modal"),
    modalContent: document.querySelector(".modal-content"),
    xpBar: document.getElementById("xp-bar"),
    lvText: document.getElementById("lv-text"),
    complete: document.getElementById("complete"),
  };

  UI.enterCode.style.display = "none";
  UI.enterName.style.display = "block";
  UI.complete.style.display = "none";

  function updateXp() {
    while (UI.xpBar.firstChild) {
      UI.xpBar.removeChild(UI.xpBar.firstChild);
    }
    for (let i = 1; i <= 15; i++) {
      const node = document.createElement("i");
      if (i > state.xp) {
        node.classList.add("empty");
      }
      UI.xpBar.appendChild(node);
    }
  }

  updateXp();

  const gainXp = () => {
    state.xp += 1;
    updateXp();

    if (state.xp >= 15) {
      state.xp = 15;
      UI.lvText.innerText = "Level 11";

      UI.enterCode.style.display = "none";

      setTimeout(() => {
        UI.enterCode.style.display = "none";
        UI.enterName.style.display = "none";
        UI.complete.style.display = "block";
      }, 1000);
    }
  };

  window.gainXp = gainXp;

  function showModal() {
    UI.resultModal.style.display = "block";
  }

  function closeModal() {
    UI.resultModal.style.display = "none";
  }

  UI.closeModal.addEventListener("click", closeModal);
  UI.resultModal.addEventListener("click", closeModal);

  function reset() {
    UI.codeInput.value = "";
  }

  function checkCode(code) {
    if (isCodeValid(code)) {
      UI.clueText.innerText = getClueForCode(code);
      UI.codeInput.value = "";
      UI.modalContent.classList.add("paper");
      UI.modalContent.classList.remove("fairy");
      UI.modalContent.classList.remove("mimic");
      showModal();
      if (!state.found[code]) {
        state.found[code] = true;
        console.log("gained experience");
        gainXp();
      }
    } else {
      if (Math.random() > 0.5) {
        UI.clueText.innerText =
          "It seems the fairies are playing tricks on you. Thy code is invalid.";
        UI.modalContent.classList.remove("paper");
        UI.modalContent.classList.remove("mimic");
        UI.modalContent.classList.add("fairy");
      } else {
        UI.clueText.innerHTML =
          "Seems that your luck has run out. Thy code is invalid.";
        UI.modalContent.classList.remove("paper");
        UI.modalContent.classList.remove("fairy");
        UI.modalContent.classList.add("mimic");
      }
      showModal();
      reset();
    }
  }

  UI.codeInput.addEventListener(
    "input",
    () => {
      const code = UI.codeInput.value.toString().trim().toUpperCase();
      if (code.length === 6) {
        console.log("checking code...");
        checkCode(code);
      } else {
        console.log("not checking code for", code);
      }
    },
    false
  );

  // UI.nameInput.value = state.name;
  UI.nameInput.focus();
  UI.nameInput.select();

  UI.submitButton.addEventListener(
    "click",
    () => {
      const name = UI.nameInput.value.toString().trim().toUpperCase();
      state.name = name;
      state.status = "enter-code";
      UI.nameText.innerText = name;
      UI.enterCode.style.display = "block";
      UI.enterName.style.display = "none";
      UI.codeInput.focus();
    },
    false
  );

  reset();
}
