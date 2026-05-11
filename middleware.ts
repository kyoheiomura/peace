import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(request: NextRequest) {
  const authUser = process.env.BASIC_AUTH_USER;
  const authPass = process.env.BASIC_AUTH_PASS;

  if (!authUser || !authPass) {
    return NextResponse.next();
  }

  const authorization = request.headers.get("authorization");
  if (authorization && authorization.startsWith("Basic ")) {
    const [user, pass] = atob(authorization.split(" ")[1]).split(":");
    if (user === authUser && pass === authPass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="MBTI Games"',
    },
  });
}
