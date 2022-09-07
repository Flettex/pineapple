import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default (req: NextApiRequest, res: NextApiResponse) => {
    let cookie = req.cookies["auth-cookie"];
    if (cookie) {
        res.setHeader('Set-Cookie', serialize("auth-cookie", cookie, {
            httpOnly: true,
            secure: true,
            domain: "https://flettex-backend.fly.dev"
        }));
    }
    res.status(200).end();
}