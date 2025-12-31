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
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  // Play CRT once on first click/tap
  function firstUserInteraction() {
    unlockAudio();
    if (!crtPlayed) {
      crt.currentTime = 0;
      crt.play().catch(() => {});
      crtPlayed = true;
      console.log("CRT played");
    }
    window.removeEventListener("pointerdown", firstUserInteraction);
  }
  window.addEventListener("pointerdown", firstUserInteraction);

  /* ---------------- TYPE PRINT ---------------- */
  let typingInterval = null;

  function typePrint(text, speed = 7) {
    if (typingInterval) clearInterval(typingInterval);
    output.textContent = "";
    let i = 0;

    typingInterval = setInterval(() => {
      output.textContent += text[i];
      if (i % 3 === 0) clickSound();
      i++;
      if (i >= text.length) clearInterval(typingInterval);
    }, speed);
  }

  /* ---------------- INPUT ---------------- */
  input.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;

    unlockAudio();

    const raw = input.value.trim();
    input.value = "";
    if (!raw) return;

    const parts = raw.split(" ");
    const command = parts[0].toLowerCase();

    // ---- BUILT-IN COMMANDS ----
    if (command === "help") {
      typePrint(
        "Why am I putting this one in? Gabriel knows all the commands anyway. Note: maybe delete later.",
        7
      );
      return;
    }

    if (command === "status") {
      typePrint(
        "TERMINAL STATUS:\n" +
          "BATTERY: 2%. Charging...\n" +
          "FILE INTEGRITY: Critical. Hope I'm not reading this without a backup, or I'm gonna get a lecture.\n\n" +
          "CONNECTION STATUS:\n" +
          "Stable. 518 Kbps.",
        7
      );
      return;
    }

    // ---- LOG COMMANDS ----
    if (command !== "log" || parts.length < 3) {
      typePrint(
        "ERROR: INVALID COMMAND\nUSAGE: log <item|event|agent|other> <id>",
        7
      );
      return;
    }

    const type = parts[1].toLowerCase();
    const thing = parts.slice(2).join(" ");
    const allowed = ["item", "event", "agent", "other"];
    if (!allowed.includes(type)) {
      typePrint(
        `ERROR: UNKNOWN LOG TYPE\nVALID TYPES: ${allowed.join(", ")}`,
        7
      );
      return;
    }

    const path = `log/${type}/${thing}.txt`;
    console.log("Fetching:", path);

    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error("NOT FOUND");
      const text = await response.text();
      typePrint(text, 7);
    } catch {
      typePrint(`ERROR: LOG NOT FOUND\nPATH: ${path}`, 7);
    }
  });
});
