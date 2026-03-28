const fs = require('fs');
const path = require('path');

const usedClasses = [
    'ph-archive', 'ph-arrow-down', 'ph-arrow-left', 'ph-arrow-right', 'ph-arrows-clockwise', 
    'ph-arrow-up', 'ph-article', 'ph-bookmark', 'ph-bookmark-fill', 'ph-bookmark-simple', 
    'ph-book-open', 'ph-books', 'ph-calendar', 'ph-check', 'ph-check-circle', 'ph-coffee', 
    'ph-copy', 'ph-eye', 'ph-ghost', 'ph-hands-clapping', 'ph-house', 'ph-lightbulb-filament', 
    'ph-lightning', 'ph-link', 'ph-list-bullets', 'ph-magnifying-glass', 'ph-moon', 'ph-moon-stars', 
    'ph-pause', 'ph-share-network', 'ph-shuffle', 'ph-sparkle', 'ph-sun', 'ph-text-aa', 'ph-trash', 
    'ph-user', 'ph-warning-circle', 'ph-whatsapp-logo', 'ph-wifi-high', 'ph-x', 'ph-x-logo'
];

const weights = ['bold', 'fill', 'regular', 'duotone'];
const nodeModules = path.join(__dirname, 'node_modules', '@phosphor-icons', 'web', 'src');
const outDir = path.join(__dirname, 'public', 'fonts');
const outCss = path.join(__dirname, 'src', 'styles', 'phosphor-subset.css');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let finalCss = '/* Auto-generated Phosphor subset */\n\n';

const fontFaceTemplate = (name, fileName) => `
@font-face {
  font-family: "${name}";
  src: url("/fonts/${fileName}") format("woff2");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
`;

weights.forEach(w => {
    const cssPath = path.join(nodeModules, w, 'style.css');
    if (!fs.existsSync(cssPath)) return;
    
    // Find the woff2 file
    const fileNames = fs.readdirSync(path.join(nodeModules, w));
    const woff2File = fileNames.find(f => f.endsWith('.woff2'));
    if (!woff2File) return;
    
    const fontFile = path.join(nodeModules, w, woff2File);
    fs.copyFileSync(fontFile, path.join(outDir, woff2File));
    
    const fontName = w === 'regular' ? 'Phosphor' : `Phosphor-${w.charAt(0).toUpperCase() + w.slice(1)}`;
    finalCss += fontFaceTemplate(fontName, woff2File);

    let css = fs.readFileSync(cssPath, 'utf8');
    
    const baseClass = w === 'regular' ? '.ph' : `.ph-${w}`;
    
    // Extract base class definition safely:
    // It's usually something like .ph-bold { font-family: "Phosphor-Bold" !important; ... }
    const baseStart = css.indexOf(`${baseClass} {`);
    if (baseStart !== -1) {
        let baseEnd = css.indexOf('}', baseStart);
        finalCss += css.substring(baseStart, baseEnd + 1) + "\n\n";
    }

    // Duotone global rules
    if(w === 'duotone') {
        const duotoneRule = css.match(/\[data-ph-color\][^}]*}/g);
        if(duotoneRule) {
            finalCss += ".ph-duotone" + duotoneRule[0] + "\n\n";
        }
    }

    // Extract exact classes used
    usedClasses.forEach(cls => {
        // e.g. .ph-bold.ph-archive:before
        const searchStr = `${baseClass}.${cls}:before {`;
        const idx = css.indexOf(searchStr);
        if (idx !== -1) {
            let endIdx = css.indexOf('}', idx);
            finalCss += css.substring(idx, endIdx + 1) + "\n";
        }
        
        // for duotone it's usually .ph-duotone.ph-archive:before, .ph-duotone.ph-archive:after {
        const duoSearch = `${baseClass}.${cls}:before,`;
        const dIdx = css.indexOf(duoSearch);
        if (dIdx !== -1) {
             let dEndIdx = css.indexOf('}', dIdx);
             finalCss += css.substring(dIdx, dEndIdx + 1) + "\n";
        }
    });
});

fs.writeFileSync(outCss, finalCss);
console.log("Subset CSS generated successfully at " + outCss);
