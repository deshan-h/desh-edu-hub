const fs = require('fs');

// 1. Update AdminLogin.js
const loginPath = 'src/components/admin/AdminLogin.js';
let loginCode = fs.readFileSync(loginPath, 'utf8');
loginCode = loginCode.replace(
  /<div className="relative h-16 w-16 mx-auto mb-4 flex items-center justify-center">[\s\S]*?<\/div>/,
  `<div className="relative h-16 w-16 mx-auto mb-4 rounded-2xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-800 flex items-center justify-center">
              <Image
                src="/desh-eduhub-logo.png"
                alt="DESH EduHub Emblem"
                width={64}
                height={64}
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>`
);
fs.writeFileSync(loginPath, loginCode, 'utf8');
console.log('Updated AdminLogin.js');

// 2. Update AdminDashboard.js
const dashPath = 'src/components/admin/AdminDashboard.js';
let dashCode = fs.readFileSync(dashPath, 'utf8');
dashCode = dashCode.replace(
  /<div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs p-1">[\s\S]*?<\/div>/,
  `<div className="h-10 w-10 rounded-xl overflow-hidden shadow-xs border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center shrink-0">
                <Image
                  src="/desh-eduhub-logo.png"
                  alt="DESH EduHub Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>`
);
fs.writeFileSync(dashPath, dashCode, 'utf8');
console.log('Updated AdminDashboard.js');

