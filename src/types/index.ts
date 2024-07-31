export interface User {
    id: string;
    email: string;
}

export interface Diary {
    id: string;
    content: string;
    imageUrl: string | null;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}