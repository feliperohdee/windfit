export default async (req, res) => {
    res.status(200)
        .json({
            VERCEL_ENV: process.env.VERCEL_ENV || '',
            VERCEL_URL: process.env.VERCEL_URL || '',
            NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV || '',
            NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL || ''
        });
};