const input = document.getElementById("commandInput");
const output = document.getElementById("output-text");

/* COMMAND DATABASE */
const commands = {
  help: `
AVAILABLE COMMANDS:
- HELP
- STATUS
- LOG_TYPE_ENTRY
`,

  status: `
STATUS:
INTEGRITY: STABLE
CONNECTION: PARTIAL. 518 Kbps.
AVAILABLE ENTRIES: 
`,

};

function print(text) {
  output.textContent = text.trim();
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const cmd = input.value.trim().toLowerCase();
    input.value = "";

    if (commands[cmd]) {
      print(commands[cmd]);
    } else {
      print(`ERROR: UNKNOWN COMMAND "${cmd.toUpperCase()}"`);
    }
  }
});
