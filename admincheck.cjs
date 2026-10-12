const fs = require('fs')
const path = require('path')
const root = 'C:/Users/HP/OneDrive/Desktop/React/management/src'
const out = []
const exists = (p) => fs.existsSync(p)

const adminSliceDir = path.join(root, 'features', 'admin')
if (exists(adminSliceDir)) {
  for (const f of fs.readdirSync(adminSliceDir)) {
    const fp = path.join(adminSliceDir, f)
    out.push('ADMIN_SLICE_FILE=' + f)
    const src = fs.readFileSync(fp, 'utf8')
    for (const line of src.split('\n')) {
      const t = line.trim()
      if (/^export const \w+|^const initialState|createSlice\(\).*actions/.test(t) && !/^export const useSelection/.test(t)) {
        out.push('  ' + t.slice(0, 90))
      }
    }
  }
} else {
  out.push('ADMIN_SLICE_DIR=MISSING')
}

const adminLayout = path.join(root, 'layouts', 'AdminLayout.jsx')
if (exists(adminLayout)) {
  out.push('ADMIN_LAYOUT=EXISTS')
  const p = fs.readFileSync(adminLayout, 'utf8')
  for (const line of p.split('\n')) {
    const t = line.trim()
    if (t.includes("to: '/admin") || t.includes("label:")) out.push('  L:' + t.slice(0, 80))
  }
} else {
  out.push('ADMIN_LAYOUT=MISSING')
}

const adminPages = path.join(root, 'pages', 'admin')
out.push('ADMIN_PAGES_DIR=' + (exists(adminPages) ? fs.readdirSync(adminPages).join(',') : 'MISSING'))

const guards = path.join(root, 'routes', 'Guards.jsx')
if (exists(guards)) out.push('GUARDS=EXISTS')

fs.writeFileSync('C:/Users/HP/AppData/Local/Temp/opencode/ADMINCHECK.txt', out.join('\n'))
console.log('WROTE_ADMINCHECK')
