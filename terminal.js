document.addEventListener("DOMContentLoaded", () => {
  console.log("terminal.js loaded");

  const input = document.getElementById("commandInput");
  const output = document.getElementById("outputText");

  if (!input || !output) {
    console.error("Terminal elements not found");
    return;
  }

   /* ---------------- AUDIO ---------------- */

  let audioCtx = null;
  
  const crt = new Audio("assets/CRT.mp3");
  crt.volume = 0.5;
  crt.preload = "auto";
  
  let crtPlayed = false;
  
  function clickSound() {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
  
    osc.type = "square";
    osc.frequency.value = 1200;
  
    gain.gain.value = 0.03;
  
    osc.connect(gain);
    gain.connect(audioCtx.destination);
  
    osc.start();
    osc.stop(audioCtx.currentTime + 0.015);
  }
  
  function unlockAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      console.log("AudioContext unlocked");
    }
  }

    /* ---------- FIRST USER INTERACTION TO PLAY CRT ---------- */
  function firstUserInteraction() {
    unlockAudio();
  
    // Resume AudioContext if suspended
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  
    // Play CRT sound once
    if (!crtPlayed) {
      crt.currentTime = 0;
      crt.play().catch(() => {});
      crtPlayed = true;
      console.log("CRT played");
    }
  
    // Remove listener so this only triggers once
    window.removeEventListener("pointerdown", firstUserInteraction);
  }
  
  // Listen for first click / tap anywhere
  window.addEventListener("pointerdown", firstUserInteraction);


  /* ---------------- TYPE PRINT ---------------- */

  function typePrint(text, speed = 7) {
    output.textContent = "";
    let i = 0;

    const interval = setInterval(() => {
      output.textContent += text[i];

      if (i % 3 === 0) {
        clickSound();
      }

      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
  }

  /* ---------------- INPUT ---------------- */

  input.addEventListener("keydown", async (e) => {
    unlockAudio();
    
    if (e.key !== "Enter") return;

    const raw = input.value.trim();
    input.value = "";
    if (!raw) return;

    const parts = raw.split(" ");

    if (parts[0].toLowerCase() !== "log" || parts.length < 3) {
      typePrint(
        "ERROR: INVALID COMMAND\nUSAGE: log <item|event|agent|other> <id>"
      );
      return;
    }

    const type = parts[1].toLowerCase();
    const thing = parts.slice(2).join(" ");

    const allowed = ["item", "event", "agent", "other"];
    if (!allowed.includes(type)) {
      typePrint(
        `ERROR: UNKNOWN LOG TYPE\nVALID TYPES: ${allowed.join(", ")}`
      );
      return;
    }

    const path = `log/${type}/${thing}.txt`;
    console.log("Fetching:", path);

    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error("NOT FOUND");

      const text = await response.text();
      typePrint(text);
    } catch {
      typePrint(`ERROR: LOG NOT FOUND\nPATH: ${path}`);
    }
  });
});
