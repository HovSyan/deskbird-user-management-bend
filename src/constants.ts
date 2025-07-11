export const ACCESS_TOKEN = 'access_token';

export const PASSWORD_HASH_SALT_ROUND = 10;

export const enum ROLES {
    ADMIN = 1,
    REGULAR = 2,
}

export const COOKIE_OPTIONS = {
    sameSite: 'none',
    secure: true,
    httpOnly: true,
} as const;
