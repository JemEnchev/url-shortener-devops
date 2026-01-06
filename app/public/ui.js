const form = document.getElementById("f");
const urlInput = document.getElementById("url");
const statusEl = document.getElementById("status");
const outRow = document.getElementById("outRow");
const outEl = document.getElementById("out");
const copyBtn = document.getElementById("copyBtn");
const openLink = document.getElementById("openLink");

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.className = "muted" + (isError ? " err" : "");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  outRow.style.display = "none";
  setStatus("Generating...");

  try {
    const res = await fetch("/shorten", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: urlInput.value })
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus(data.error || "Error", true);
      return;
    }

    outEl.textContent = data.shortUrl;
    openLink.href = data.shortUrl;
    outRow.style.display = "flex";
    setStatus("Done.");
  } catch {
    setStatus("Network error", true);
  }
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(outEl.textContent);
    setStatus("Copied to clipboard.");
  } catch {
    setStatus("Copy failed.", true);
  }
});
