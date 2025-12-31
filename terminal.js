const input = document.getElementById("commandInput");
const output = document.getElementById("outputText");

function print(text) {
  output.textContent = text;
}

input.addEventListener("keydown", async (e) => {
  if (e.key !== "Enter") return;

  const raw = input.value.trim();
  input.value = "";

  if (!raw) return;

  const parts = raw.toLowerCase().split(" ");

  // EXPECTED: log (type) (name)
  if (parts[0] !== "log" || parts.length < 3) {
    print(`ERROR: INVALID COMMAND FORMAT\nEXPECTED: LOG (TYPE) (NAME)`);
    return;
  }

  const type = parts[1];
  const name = parts.slice(2).join("_"); // allows multi-word names if needed

  const path = `main/log/${type}/${name}.txt`;

  try {
    const res = await fetch(path);

    if (!res.ok) {
      throw new Error("NOT_FOUND");
    }

    const text = await res.text();
    print(text.trim());

  } catch (err) {
    print(`ERROR: FILE UNAVAILABLE OR NONEXISTENT`);
  }
});
