import fs from 'fs';
import path from 'path';

const FILE_PATH = path.resolve('src/locales/messages.ts');

try {
    let content = fs.readFileSync(FILE_PATH, 'utf8');

    const sortBlock = (blockName, fileContent) => {
        /**
         * Enhanced Regex:
         * 1. Finds the block (en: { or pt: {)
         * 2. Captures internal content
         * 3. Finds the matching closing brace followed by a comma or semicolon
         */
        const regex = new RegExp(`(${blockName}: \\{)([\\s\\S]*?)(\\n\\s{2}\\})`, 'm');
        const match = fileContent.match(regex);

        if (!match) return fileContent;

        const prefix = match[1]; 
        const internalContent = match[2];
        const suffix = match[3];

        const lines = internalContent
            .split('\n')
            .map(line => line.trim())
            // Only keep lines that look like "key": "value"
            .filter(line => {
                const parts = line.split(':');
                // Ensure there is a key and a value part, and the value isn't empty
                return parts.length >= 2 && parts[1].trim().length > 0;
            })
            .map(line => {
                // Remove existing trailing comma for clean sorting
                let cleaned = line.endsWith(',') ? line.slice(0, -1) : line;
                // Re-add comma to every line for valid TS syntax
                return `${cleaned},`;
            })
            // Sort by the key (first part before the colon)
            .sort((a, b) => {
                const keyA = a.split(':')[0].toLowerCase();
                const keyB = b.split(':')[0].toLowerCase();
                return keyA.localeCompare(keyB);
            });

        // Use 4-space indentation to match Prettier/TS standards
        const sortedInternal = lines.map(line => `    ${line}`).join('\n');
        
        return fileContent.replace(
            match[0], 
            `${prefix}\n${sortedInternal}\n${suffix}`
        );
    };

    let updatedContent = sortBlock('en', content);
    updatedContent = sortBlock('pt', updatedContent);

    fs.writeFileSync(FILE_PATH, updatedContent);
    console.log("✅ Messages sorted (En/Pt) and structure verified.");
} catch (error) {
    console.error("❌ Failed to sort messages:", error);
    process.exit(1); // Exit with error so lint-staged stops
}