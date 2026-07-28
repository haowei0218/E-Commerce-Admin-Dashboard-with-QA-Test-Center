import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";


export function proxy(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value

    if (!token) {
        // const loginUrl = new URL('/login', request.url)

        // // 登入後可以導回原本想進入的頁面
        // loginUrl.searchParams.set('redirect', request.nextUrl.pathname)

        return NextResponse.redirect(
            new URL('/login', request.url)
        )

    }
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/orders/:path*',
        '/products/:path*',
        '/reports/:path*',
        '/role-permissions/:path*',
        '/settings/:path*',
        '/test-center/:path*',
        '/users/:path*',
    ],
}