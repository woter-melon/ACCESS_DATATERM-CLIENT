const input = document.getElementById("commandInput");
const output = document.getElementById("outputText");

input.addEventListener("keydown", async (e) => {
  if (e.key !== "Enter") return;

  const raw = input.value.trim();
  input.value = "";

  if (!raw) return;

  const parts = raw.split(" ");

  // Expect: log <type> <thing>
  if (parts[0].toLowerCase() !== "log" || parts.length < 3) {
    output.textContent =
      "ERROR: INVALID COMMAND\nUSAGE: log <item|event|agent|other> <id>";
    return;
  }

  const type = parts[1].toLowerCase();
  const thing = parts.slice(2).join(" ");

  // Allowed types (singular, as requested)
  const allowed = ["item", "event", "agent", "other"];
  if (!allowed.includes(type)) {
    output.textContent =
      `ERROR: UNKNOWN LOG TYPE\nVALID TYPES: ${allowed.join(", ")}`;
    return;
  }

  const path = `main/log/${type}/${thing}.txt`;

  try {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error("NOT FOUND");
    }

    const text = await response.text();
    output.textContent = text;
  } catch {
    output.textContent =
      `ERROR: LOG NOT FOUND\nPATH: ${path}`;
  }
});
