import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            uid?: string;
            claims?: Claims;
        }
    }
}

interface Claims {
    admin?: boolean | undefined;
    tester?: boolean | undefined;
}