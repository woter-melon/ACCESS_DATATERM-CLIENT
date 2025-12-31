document.addEventListener("DOMContentLoaded", () => {
  console.log("terminal.js loaded");

  const input = document.getElementById("commandInput");
  const output = document.getElementById("outputText");



  const overlay = document.getElementById('overlay');
const video = document.getElementById('intro-video');
const bootNote = document.getElementById('boot-note');
const startBtn = document.getElementById('start-btn');

startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';    // hide button
    overlay.style.cursor = 'default';   // optional: remove pointer

    // Play boot note first (optional)
    if (bootNote) bootNote.play();

    // Show and play video
    video.style.display = 'block';
    video.play();

    // When video ends, fade out overlay and video
    video.addEventListener('ended', () => {
        overlay.style.transition = 'opacity 1s';
        video.style.transition = 'opacity 1s';
        overlay.style.opacity = 0;
        video.style.opacity = 0;

        setTimeout(() => {
            overlay.style.display = 'none';
            video.style.display = 'none';
        }, 1000); // fade duration
    });
});

  

  

  if (!input || !output) {
    console.error("Terminal elements not found");
    return;
  }
  


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
