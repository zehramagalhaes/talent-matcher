import fs from 'fs';
import path from 'path';

const FILE_PATH = path.resolve('src/locales/messages.ts');

try {
    const content = fs.readFileSync(FILE_PATH, 'utf8');

    const sortBlock = (blockName, fileContent) => {
        // Regex to capture the object content accurately
        const regex = new RegExp(`(${blockName}: \\{)([\\s\\S]*?)(\\n\\s{2}\\})`, 'm');
        const match = fileContent.match(regex);

        if (!match) return fileContent;

        const prefix = match[1]; 
        const internalContent = match[2];
        const suffix = match[3];

        // 1. Split into raw entries using a Lookbehind/Lookahead for commas between quotes
        // This regex splits by comma ONLY if it's followed by a newline and a quote (start of next key)
        const entries = internalContent
            .split(/,(?=\s*\n\s*["'])/g) 
            .map(entry => entry.trim())
            .filter(entry => entry.length > 0 && entry.includes(':'));

        // 2. Sort entries by key
        entries.sort((a, b) => {
            const keyA = a.split(':')[0].replace(/["']/g, '').trim().toLowerCase();
            const keyB = b.split(':')[0].replace(/["']/g, '').trim().toLowerCase();
            return keyA.localeCompare(keyB);
        });

        // 3. Clean and Format: Ensure every entry has exactly one comma at the end
        const formattedEntries = entries.map(entry => {
            let cleanEntry = entry.endsWith(',') ? entry.slice(0, -1) : entry;
            
            // Re-indent every line of the entry (handles multi-line values)
            return cleanEntry
                .split('\n')
                .map(line => `    ${line.trim()}`)
                .join('\n') + ','; // Add the single trailing comma back
        });

        // 4. Reconstruct: Ensure no extra newlines or missing braces
        const sortedBody = formattedEntries.join('\n');
        
        return fileContent.replace(
            match[0], 
            `${prefix}\n${sortedBody}\n${suffix}`
        );
    };

    let updatedContent = sortBlock('en', content);
    updatedContent = sortBlock('pt', updatedContent);

    // Final sanity check: remove any double commas that might have slipped through
    updatedContent = updatedContent.replace(/,,/g, ',');

    fs.writeFileSync(FILE_PATH, updatedContent);
    console.log("✅ Messages sorted and validated.");
} catch (error) {
    console.error("❌ Failed to sort messages:", error);
    process.exit(1);
}