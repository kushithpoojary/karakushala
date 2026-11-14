const fs = require('fs');
const file = 'd:/colossus/karakushala/frontend/src/components/Navbar.jsx';
let content = fs.readFileSync(file, 'utf8');

const target = '<div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">';
if (content.includes(target)) {
  content = content.replace(target, target + '\r\n\r\n            {/* Multilingual Selector Dropdown */}\r\n            <LanguageDropdown />');
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully inserted LanguageDropdown into Navbar.jsx');
} else {
  console.log('Target not found');
}
