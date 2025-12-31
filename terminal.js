/* =========================
   ACCESS_DATATERM TERMINAL
   ========================= */

/* ELEMENT REFERENCES */
const input = document.getElementById("commandInput");
const output = document.getElementById("outputText");

/* =========================
   CORE PRINT FUNCTION
   ========================= */
function print(text) {
  output.textContent = text.trim();
}

/* =========================
   COMMAND HANDLER
   ========================= */
function handleCommand(rawInput) {
  if (!rawInput) return;

  const parts = rawInput.trim().toLowerCase().split(" ");

  switch (parts[0]) {
    case "help":
      showHelp();
      break;

    case "status":
      showStatus();
      break;

    case "log":
      loadEntry(parts);
      break;

    default:
      print(`ERROR: UNKNOWN COMMAND "${rawInput.toUpperCase()}"`);
  }
}

/* =========================
   COMMANDS
   ========================= */

function showHelp() {
  print(`
AVAILABLE COMMANDS:

HELP
STATUS
LOG <TYPE> <NAME>

EXAMPLES:
LOG AGENT GABRIEL
LOG ITEM ICHOR
`);
}

function showStatus() {
  print(`
STATUS REPORT:

SYSTEM INTEGRITY: STABLE
CONNECTION: PARTIAL
AVAILABLE ENTRIES: 3
SECURITY LEVEL: RESTRICTED
`);
}

/* =========================
   ENTRY LOADER
   ========================= */

function loadEntry(parts) {
  if (parts.length < 3) {
    print("ERROR: INCOMPLETE COMMAND");
    return;
  }

  const type = parts[1];
  const name = parts[2];

  const path = `entries/${type}/${name}`;

  fetch(path)
    .then(response => {
      if (!response.ok) throw new Error("Missing file");
      return response.text();
    })
    .then(text => {
      print(text);
    })
    .catch(() => {
      print("ERROR: FILE UNAVAILABLE OR NONEXISTENT");
    });
}

/* =========================
   INPUT LISTENER
   ========================= */

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const command = input.value;
    input.value = "";
    handleCommand(command);
  }
});

/* =========================
   INITIAL MESSAGE
   ========================= */

print(`
ACCESS_DATATERM ONLINE.
TYPE HELP FOR AVAILABLE COMMANDS.
`);
