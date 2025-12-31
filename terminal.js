document.addEventListener("DOMContentLoaded", () => {
  console.log("terminal.js loaded");

  
  const input = document.getElementById("commandInput");
  const output = document.getElementById("outputText");

  const beep = new Audio("assets/beep.mp3");
    beep.volume = 0.2;

  if (!input || !output) {
    console.error("Terminal elements not found");
    return;
  }

  function typePrint(text, speed = 20) {
    output.textContent = "";
    let i = 0;
  
    const interval = setInterval(() => {
      output.textContent += text[i];
  
      // Play beep every few characters to avoid noise hell
      if (i % 3 === 0) {
        beep.currentTime = 0;
        beep.play().catch(() => {});
      }
  
      i++;
  
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, speed);
  }


  input.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;

    const raw = input.value.trim();
    input.value = "";

    if (!raw) return;

    const parts = raw.split(" ");

    // Expect: log <type> <thing>
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

      if (!response.ok) {
        throw new Error("NOT FOUND");
      }

      const text = await response.text();
      typePrint(text);
    } catch (err) {
      console.error(err);
      typePrint(
        `ERROR: LOG NOT FOUND\nPATH: ${path}`
      );
    }
  });
});
