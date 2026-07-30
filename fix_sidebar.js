const fs = require('fs');
const path = 'apps/web/src/features/catalogue/components/catalogue-sidebar.tsx';
let content = fs.readFileSync(path, 'utf8');

// Remove all count spans
content = content.replace(/<span className="text-\[[89]px\][^>]*>\(\{[^}]+\.count\}\)<\/span>/g, '');

// Counter-skew wrappers
content = content.replace(/\{preset\.label\}\s*<\/button>/g, '<span className="block skew-x-[12deg]">{preset.label}</span></button>');

content = content.replace(/\{logoUrl && \([\s\S]*?<\/span>\s*\)\}\s*<span>\{b\.label\}<\/span>\s*<\/button>/g, match => {
  return '<div className="flex items-center gap-1.5 skew-x-[12deg]">' + match.replace('</button>', '</div></button>');
});

content = content.replace(/\{q\.label\}\s*<\/button>/g, '<span className="block skew-x-[12deg]">{q.label}</span></button>');

content = content.replace(/\{swatch \? \([\s\S]*?\{c\.label\}<\/span>\s*<\/button>/g, match => {
  return '<div className="flex items-center gap-2 skew-x-[12deg]">' + match.replace('</button>', '</div></button>');
});

content = content.replace(/<span>\{s\.label\}<\/span>\s*<\/button>/g, '<span className="block skew-x-[12deg]">{s.label}</span></button>');

// Remove item counts from apply button
content = content.replace(/Apply Filters • \(\$\{previewMatchingProducts\.length\}\sItems\)/g, "'Apply Filters'");
content = content.replace(/\{hasChanges\s*\?\s*'Apply Filters'\s*:\s*'Filters Applied'\}\s*<\/button>/g, '<span className="block skew-x-[12deg]">{hasChanges ? "Apply Filters" : "Filters Applied"}</span></button>');

fs.writeFileSync(path, content, 'utf8');
