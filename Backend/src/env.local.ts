import "dotenv/config";

function requiredEnv(key: string) {
    const value = process.env[key];

    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }

    return value;
}

export const env = {
    port: Number(process.env.PORT ?? 4201),
    databaseUrl: requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    jwtSecret: requiredEnv("JWT_SECRET")
};