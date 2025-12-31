const input = document.getElementById("commandInput");
const output = document.getElementById("outputText");

input.addEventListener("keydown", async (e) => {
  if (e.key !== "Enter") return;

  const command = input.value.trim();
  input.value = "";

  if (!command) return;

  // Split command
  const parts = command.split(" ");

  // Expect: log <type> <thing>
  if (parts[0].toLowerCase() !== "log" || parts.length < 3) {
    output.textContent =
      "ERROR: INVALID COMMAND\nUSAGE: log <type> <thing>";
    return;
  }

  const type = parts[1];
  const thing = parts.slice(2).join(" ");

  const path = `main/log/${type}/${thing}.txt`;

  try {
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error("NOT FOUND");
    }

    const text = await response.text();
    output.textContent = text;
  } catch (err) {
    output.textContent =
      `ERROR: LOG NOT FOUND\nPATH: ${path}`;
  }
});
