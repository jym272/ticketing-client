import path from 'path';
import fs from 'fs';

export const getEnvOrFail = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        try {
            const filePath = path.join('/run/secrets/api-secrets', key);
            const data = fs.readFileSync(filePath, 'utf8');
            if (data.trim()) return data.trim();
        } catch (err) {
            //
        }
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};
