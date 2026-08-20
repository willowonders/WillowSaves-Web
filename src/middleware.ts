import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { checkRateLimit } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
  if (request.method === 'POST') {
    const pathname = request.nextUrl.pathname;
    if (pathname === '/login' || pathname === '/signup') {
      const { success } = checkRateLimit(request);
      if (!success) {
        return new Response(
          JSON.stringify({ error: 'Too many attempts. Please wait a few seconds.' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
