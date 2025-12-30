const input = document.getElementById("commandInput");
const output = document.getElementById("output-text");

/* COMMAND DATABASE */
const commands = {
  help: `
AVAILABLE COMMANDS:
- HELP
- STATUS
- LOG_ICHOR
`,

  status: `
TERMINAL STATUS:
INTEGRITY: STABLE
CONNECTION: PARTIAL
DATA NODES: 3 ACTIVE
`,

  log_ichor: `
[REDACTED LOG]

ICHOR IS NOT BLOOD.
ICHOR IS NOT A CURSE.

IT IS A BYPRODUCT.
IT IS A VESSEL.

ACCESS LEVEL: LOW
`
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
