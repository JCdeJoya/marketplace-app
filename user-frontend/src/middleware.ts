import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const protectedPaths = ['/cart', '/checkout', '/orders'];
    const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));
    const isAuthPath = ['/login', '/register'].some(path => request.nextUrl.pathname.startsWith(path));

    if (!token && isProtectedPath) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isAuthPath) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}