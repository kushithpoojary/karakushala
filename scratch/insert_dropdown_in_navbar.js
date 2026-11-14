const fs = require('fs');

const path = 'd:/colossus/karakushala/frontend/src/components/Navbar.jsx';
let content = fs.readFileSync(path, 'utf8');

// Ensure import exists
if (!content.includes("import LanguageDropdown from './LanguageDropdown';")) {
  content = content.replace(
    "import VoiceSearchBar from './VoiceSearchBar';",
    "import VoiceSearchBar from './VoiceSearchBar';\r\nimport LanguageDropdown from './LanguageDropdown';"
  );
  if (!content.includes("import LanguageDropdown")) {
    content = content.replace(
      "import VoiceSearchBar from './VoiceSearchBar';",
      "import VoiceSearchBar from './VoiceSearchBar';\nimport LanguageDropdown from './LanguageDropdown';"
    );
  }
}

// Target to insert LanguageDropdown
const targetCRLF = `          {/* Controls: Mode Switcher, Login, Care & Cart (Always comfortably fits in viewport) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">

            {/* Accessibility Voice Guidance Button */}`;

const replacementCRLF = `          {/* Controls: Mode Switcher, Login, Care & Cart (Always comfortably fits in viewport) */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">

            {/* Multilingual Selector Dropdown */}
            <LanguageDropdown />

            {/* Accessibility Voice Guidance Button */}`;

if (content.includes(targetCRLF)) {
  content = content.replace(targetCRLF, replacementCRLF);
  console.log('Inserted LanguageDropdown into Navbar.jsx (CRLF)');
} else if (content.includes(targetCRLF.replace(/\r\n/g, '\n'))) {
  content = content.replace(targetCRLF.replace(/\r\n/g, '\n'), replacementCRLF.replace(/\r\n/g, '\n'));
  console.log('Inserted LanguageDropdown into Navbar.jsx (LF)');
} else {
  console.log('Could not find target in Navbar.jsx');
}

fs.writeFileSync(path, content, 'utf8');
