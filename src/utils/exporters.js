export const downloadCSV = (filename, headers, rows) => {
  const esc = (v) => {
    const s = String(v ?? '')
    return /["\n,]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const csv = [headers, ...rows].map((r) => r.map(esc).join(',')).join('\r\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const openPrintableReport = (title, sections) => {
  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) return
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font: 13px/1.5 -apple-system, 'Segoe UI', Roboto, sans-serif; color: #111827; padding: 32px; }
    h1 { font-size: 22px; margin: 0 0 4px; }
    .sub { color: #6b7280; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0 24px; }
    th, td { border: 1px solid #e5e7eb; padding: 7px 9px; text-align: left; font-size: 12px; }
    th { background: #f8fafc; }
    h2 { font-size: 15px; margin: 22px 0 6px; border-bottom: 2px solid #0d6efd; padding-bottom: 5px; }
    @media print { body { padding: 0; } }
  </style></head><body>
  <h1>${title}</h1>
  <div class="sub">Generated ${new Date().toLocaleString()} · ServiceSprint Platform</div>
  ${sections
    .map(
      (s) => `<h2>${s.heading}</h2>${
        s.html || (s.rows
          ? `<table><thead><tr>${s.headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${s.rows
              .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`)
              .join('')}</tbody></table>`
          : '')
      }`
    )
    .join('')}
  <script>window.onload = () => window.print();</script>
  </body></html>`
  win.document.open()
  win.document.write(html)
  win.document.close()
}

export const uuid = () => Math.random().toString(36).slice(2, 10)