import path from 'path';
import fs from 'fs';

// don't add to index.ts
// this is a server-side utility
export const getSecretOrFail = (secret: string): string => {
    try {
        const filePath = path.join('/run/secrets/api-secrets', secret);
        const data = fs.readFileSync(filePath, 'utf8');
        if (data.trim()) return data.trim();
    } catch (err) {
        //
    }
    throw new Error(`Missing secret variable: ${secret}`);
};
