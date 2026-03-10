import fs from 'fs';
import path from 'path';

function renameFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            renameFiles(fullPath);
        } else {
            if (file.includes('createServerClient') || file.includes('createBrowserClient')) {
                let newName = file.replace('createServerClient', 'createServerIndobaseClient')
                    .replace('createBrowserClient', 'createBrowserIndobaseClient');
                const newPath = path.join(dir, newName);
                fs.renameSync(fullPath, newPath);
                console.log(`Renamed ${fullPath} to ${newPath}`);
            }
        }
    }
}

renameFiles('e:/Work/indobase sdk/ssr/src');
