const input = document.getElementById("commandInput");
const output = document.getElementById("output-text");

/* ENTRY REGISTRY */
const entryIndex = {
  agent: ["gabriel"],
  item: ["ichor"],
  other: ["rochana"]
};

/* UTIL */
function print(text) {
  output.textContent = text.trim();
}

/* COUNT ENTRIES */
function countEntries() {
  return Object.values(entryIndex).reduce(
    (sum, arr) => sum + arr.length, 0
  );
}

/* LOAD ENTRY */
async function loadEntry(type, name) {
  try {
    const res = await fetch(`entries/${type}/${name}.txt`);
    if (!res.ok) throw new Error();
    const text = await res.text();
    print(text);
  } catch {
    print(`ERROR: FILE UNAVAILABLE OR NONEXISTENT`);
  }
}

/* COMMAND HANDLER */
input.addEventListener("keydown", async (e) => {
  if (e.key !== "Enter") return;

  const raw = input.value.trim();
  input.value = "";

  const args = raw.toLowerCase().split(" ");

  if (args[0] === "help") {
    print(`
AVAILABLE COMMANDS:
HELP
STATUS
LOG <TYPE> <NAME>

TYPES:
- agent
- item
- other
    `);
    return;
  }

  if (args[0] === "status") {
    print(`
STATUS:
INTEGRITY: STABLE
CONNECTION: PARTIAL
AVAILABLE ENTRIES: ${countEntries()}
    `);
    return;
  }

  if (args[0] === "log") {
    const type = args[1];
    const name = args[2];

    if (!entryIndex[type]?.includes(name)) {
      print(`ERROR: FILE UNAVAILABLE OR NONEXISTENT`);
      return;
    }

    await loadEntry(type, name);
    return;
  }

  print(`ERROR: UNKNOWN COMMAND "${raw.toUpperCase()}"`);
});
