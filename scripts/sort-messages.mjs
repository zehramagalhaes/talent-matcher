import fs from 'fs';
import path from 'path';

const FILE_PATH = path.resolve('src/locales/messages.ts');

try {
    let content = fs.readFileSync(FILE_PATH, 'utf8');

    const sortBlock = (blockName, fileContent) => {
        // Regex looks for the start of the block and matches everything until the matching closing brace
        // This version handles empty lines and maintains the object structure
        const regex = new RegExp(`(${blockName}: \\{)([\\s\\S]*?)(\\n\\s{2}\\},)`, 'm');
        const match = fileContent.match(regex);

        if (!match) return fileContent;

        const prefix = match[1]; // "en: {"
        const internalContent = match[2]; // The actual keys
        const suffix = match[3]; // "  },"

        // 1. Split by lines
        // 2. Filter valid key-value lines
        // 3. Ensure every line ends with a comma (fixes the "missing comma" bug)
        // 4. Sort
        const lines = internalContent
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.includes(':'))
            .map(line => line.endsWith(',') ? line : `${line},`) 
            .sort((a, b) => a.localeCompare(b));

        // Reconstruct with standard 4-space indentation
        const sortedInternal = lines.map(line => `    ${line}`).join('\n');
        
        // Reassemble the block
        return fileContent.replace(
            match[0], 
            `${prefix}\n${sortedInternal}\n${suffix}`
        );
    };

    let updatedContent = sortBlock('en', content);
    updatedContent = sortBlock('pt', updatedContent);

    fs.writeFileSync(FILE_PATH, updatedContent);
    console.log("✅ Messages sorted and structure preserved.");
} catch (error) {
    console.error("❌ Failed to sort messages:", error);
}