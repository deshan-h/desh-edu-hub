const fs = require('fs');
const filePath = 'src/components/PapersGallery.js';
let code = fs.readFileSync(filePath, 'utf8');

// Replace category pills container to stay in a single row on PC
code = code.replace(
  /className=["']flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto["']/,
  'className="flex flex-wrap md:flex-nowrap items-center justify-center gap-2 max-w-6xl mx-auto overflow-x-auto no-scrollbar py-1"'
);

// Add whitespace-nowrap and shrink-0 to buttons
code = code.replace(
  'className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-xs cursor-pointer ${',
  'className={`whitespace-nowrap shrink-0 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-xs cursor-pointer ${'
);

// Add whitespace-nowrap and shrink-0 to year select
code = code.replace(
  'className="px-3.5 py-2 text-xs bg-white dark:bg-slate-900',
  'className="whitespace-nowrap shrink-0 px-3 py-2 text-xs bg-white dark:bg-slate-900'
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully updated category pills layout to single row on PC!');

