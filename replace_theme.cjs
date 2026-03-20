const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/bg-\[#0A0E17\]/g, 'bg-bg-main');
code = code.replace(/bg-\[#131B2F\]/g, 'bg-bg-card');
code = code.replace(/text-white/g, 'text-text-main');
code = code.replace(/text-slate-300/g, 'text-text-muted');
code = code.replace(/text-slate-400/g, 'text-text-faint');
code = code.replace(/border-slate-800/g, 'border-border-color');
code = code.replace(/border-slate-700/g, 'border-border-light');
code = code.replace(/bg-slate-800\/50/g, 'bg-bg-hover');
code = code.replace(/bg-slate-800/g, 'bg-border-color');

// Fix buttons that should stay white
code = code.replace(/text-text-main rounded-md/g, 'text-white rounded-md');
code = code.replace(/text-text-main px-4 py-2/g, 'text-white px-4 py-2');
code = code.replace(/text-text-main flex items-center gap-2/g, 'text-white flex items-center gap-2');

fs.writeFileSync('src/App.tsx', code);
