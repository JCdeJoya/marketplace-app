export interface User {
    id: number;
    email: string;
    full_name: string;
    is_admin: boolean;
    is_active: boolean;
}

export interface UserFormData {
    email: string;
    full_name: string;
    password?: string;
    is_admin: boolean;
}