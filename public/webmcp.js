const context = document.modelContext;
if (context?.registerTool) {
  const lifecycle = new AbortController();
  const tool = {
    name: "read_stok_dapur_screen",
    title: "Baca layar Stok Dapur",
    description: "Membaca ringkasan dan kontrol pada layar Stok Dapur yang sedang terbuka. Tidak membuat akun, mengubah stok, atau membuka login.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: true },
    execute(input) {
      if (!input || typeof input !== "object" || Array.isArray(input) || Object.keys(input).length) throw new Error("Gunakan objek kosong.");
      const root = document.getElementById("root");
      if (root?.querySelector('input[type="password"]')) return { status: "authentication_required" };
      const visible = el => !el.hidden && !el.closest('[hidden]') && getComputedStyle(el).display !== "none";
      return {
        headings: [...(root?.querySelectorAll('h1,h2,h3') ?? [])].filter(visible).map(el => el.textContent.trim()),
        buttons: [...(root?.querySelectorAll('button') ?? [])].filter(visible).map(el => ({ label: el.getAttribute('aria-label') || el.textContent.trim(), disabled: el.disabled }))
      };
    }
  };
  try { Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); } catch {}
  window.addEventListener("pagehide", () => lifecycle.abort(), { once: true });
}
