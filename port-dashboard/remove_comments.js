import fs from 'fs';
import path from 'path';

const COMMENT_REGEX = /\/\/.*|\/\*[\s\S]*?\*\//g;

function stripCommentsFromFile(filePath) {
    const ext = path.extname(filePath);
    const allowedExts = ['.ts', '.tsx', '.js', '.jsx', '.html'];
    if (!allowedExts.includes(ext)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    const stripped = content.replace(COMMENT_REGEX, '').replace(/\n{2,}/g, '\n');
    fs.writeFileSync(filePath, stripped, 'utf8');
}

function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
            walkDir(fullPath);
        } else {
            stripCommentsFromFile(fullPath);
        }
    }
}

const projectRoot = path.resolve('src');
walkDir(projectRoot);
console.log('Comment removal completed.');
