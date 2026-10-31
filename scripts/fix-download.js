const fs = require('fs');
const filePath = 'src/components/PapersGallery.js';
let code = fs.readFileSync(filePath, 'utf8');

const oldTrigger = `  const triggerDownload = (paper) => {
    if (!paper?.file_url) return;
    // Use invisible anchor click to bypass popup blockers reliably
    try {
      const link = document.createElement("a");
      link.href = paper.file_url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(paper.file_url, "_blank", "noopener,noreferrer");
    }`;

const newTrigger = `  const triggerDownload = (paper) => {
    if (!paper?.file_url) return;
    window.open(paper.file_url, "_blank");`;

code = code.replace(oldTrigger, newTrigger);
fs.writeFileSync(filePath, code, 'utf8');
console.log('Restored direct window.open in triggerDownload!');

