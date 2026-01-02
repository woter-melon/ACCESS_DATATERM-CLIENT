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

  /* ---------------- VIDEO OVERLAY ---------------- */
  const overlay = document.getElementById("overlay");
  const video = document.getElementById("intro-video");
  let videoPlayed = false;

  function playVideoOnce() {
    if (videoPlayed) return;
    videoPlayed = true;

    unlockAudio();

    video.style.display = "block";
    video.play();

    // When video ends, wait 1s and remove both overlay and video
    video.addEventListener("ended", () => {
      setTimeout(() => {
        if (overlay) overlay.style.display = "none";
        if (video) video.style.display = "none";
      }, 1000);
    });
  }

  // Listen for any user input to start video
  function onFirstUserInput() {
    playVideoOnce();

    window.removeEventListener("pointerdown", onFirstUserInput);
    window.removeEventListener("keydown", onFirstUserInput);
    window.removeEventListener("touchstart", onFirstUserInput);
  }

  window.addEventListener("pointerdown", onFirstUserInput);
  window.addEventListener("keydown", onFirstUserInput);
  window.addEventListener("touchstart", onFirstUserInput);

  /* ---------------- TYPE PRINT ---------------- */
  function typePrint(text, speed = 7) {
    output.textContent = "";
    let i = 0;

    const interval = setInterval(() => {
      output.textContent += text[i];

      // small click on every 3rd character
      if (i % 3 === 0) clickSound();

      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
  }

  /* ---------------- INPUT HANDLING ---------------- */
  input.addEventListener("keydown", async (e) => {
    unlockAudio();

    if (e.key !== "Enter") return;

    const raw = input.value.trim();
    input.value = "";
    if (!raw) return;

    const parts = raw.split(" ");
    const command = parts[0].toLowerCase();

    /* ------------- LOG COMMAND ------------- */
    if (command === "log") {
      if (parts.length < 3) {
        typePrint("ERROR: INVALID COMMAND\nUSAGE: log <item|event|agent|other> <id>");
        return;
      }

      const type = parts[1].toLowerCase();
      const thing = parts.slice(2).join(" ");

      const allowed = ["item", "event", "agent", "other"];
      if (!allowed.includes(type)) {
        typePrint(`ERROR: UNKNOWN LOG TYPE\nVALID TYPES: ${allowed.join(", ")}`);
        return;
      }

      const path = `log/${type}/${thing.toLowerCase()}.txt`; // Turns user input into lower case
      console.log("Fetching:", path);

      try {
        const response = await fetch(path);
        if (!response.ok) throw new Error("NOT FOUND");

        const text = await response.text();
        typePrint(text);
      } catch {
        typePrint(`ERROR: LOG NOT FOUND\nPATH: ${path}
        
        Note for dad: if you're trying to find something, remember, don't put .txt at the end. The machine does it for you. And don't put spaces in names. The system can't tell them apart from the actual command, so use "_". If you're looking for someone, do "log agent firstname_lastname". Okay?`);
      }
      return;
    }

    /* ------------- HELP COMMAND ------------- */
    if (command === "help") {
      typePrint("Honestly why'd I even put this command here. \n\n" + 
                "Note, delete later.\n\n\n\n" + 
                "Wow, forgot this thing existed. Way to go help command. Happy 54th birthday."); // placeholder text
      return;
    }

    /* ------------- STATUS COMMAND ------------- */
    if (command === "status") {
      typePrint("TERMINAL STATUS:\n" +
          "BATTERY: 2%. Charging...\n" +
          "FILE INTEGRITY: Critical. Hope I'm not reading this without a backup, or I'm gonna get a lecture.\n\n" +
          "AVAILABLE ENTRIES: 26\n" +
          "CONNECTION STATUS:\n" +
          "Stable. 518 Kbps."); // placeholder text
      return;
    }

    /* ------------- UNKNOWN COMMAND ------------- */
    typePrint("ERROR: UNKNOWN COMMAND");
  });
});
