import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { middleware } from '@/middleware';

// We can spy on these static methods on NextResponse
const mockRedirect = jest.spyOn(NextResponse, 'redirect');
const mockNext = jest.spyOn(NextResponse, 'next');

// A helper to build a mock NextRequest
function createMockRequest({
  url = 'http://localhost:3000/',
  path = '/',
  searchParams = '',
  cookies = {},
}: {
  url?: string;
  path?: string;
  searchParams?: string;
  cookies?: Record<string, string>;
}): NextRequest {
  // nextUrl is read-only, so we’ll create a fake object with the properties needed.
  // In real usage, `nextUrl` is an instance of `URL`. We'll mock it similarly:
  const mockedUrl = new URL(url + path + searchParams);

  return {
    // You can mock out whatever properties your code uses.
    // In this case, we rely on `nextUrl`, `cookies`, etc.
    nextUrl: mockedUrl,
    cookies: {
      get: (key: string) => {
        const value = cookies[key];
        return value ? { value } : undefined;
      },
    },
    // The `req.url` property in the middleware is typically `req.url`,
    // so let's just align them for consistency:
    url: url + path + searchParams,
  } as unknown as NextRequest;
}

describe('middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // reset between tests
  });

  it('should remove search params if on "/signUp" but no "socialMedia" in query', () => {
    const request = createMockRequest({
      path: '/signUp',
      searchParams: '?foo=bar',
    });

    middleware(request);

    // We expect a redirect with the same path but no search params
    expect(mockRedirect).toHaveBeenCalledTimes(1);

    const redirectUrl = mockRedirect.mock.calls[0][0];
    expect(redirectUrl.toString()).toBe('http://localhost:3000/signUp'); // no ?foo=bar
  });

  it('should allow "/signUp" if "socialMedia" is in the query', () => {
    const request = createMockRequest({
      path: '/signUp',
      searchParams: '?socialMedia=google',
    });

    middleware(request);

    // We expect NextResponse.next() in this scenario
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('should just call NextResponse.next() for static file paths (like /logo.png)', () => {
    const request = createMockRequest({
      path: '/images/logo.png',
    });

    middleware(request);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('should allow routes that start with "/verify/" to proceed', () => {
    const request = createMockRequest({
      path: '/verify/1234',
    });

    middleware(request);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('should allow routes that start with "/resetPassword/" to proceed', () => {
    const request = createMockRequest({
      path: '/resetPassword/abcdef',
    });

    middleware(request);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it('should redirect to "/signIn" when user is NOT authenticated and route is private', () => {
    const request = createMockRequest({
      path: '/private-route',
      cookies: {}, // no accessToken
    });

    middleware(request);

    expect(mockRedirect).toHaveBeenCalledTimes(1);
    const redirectUrl = mockRedirect.mock.calls[0][0];
    expect(redirectUrl.toString()).toBe('http://localhost:3000/signIn');
  });

  it('should redirect to "/" when user IS authenticated and route is public ("/signUp")', () => {
    const request = createMockRequest({
      path: '/signUp',
      cookies: { accessToken: 'myMockToken' },
    });

    middleware(request);

    expect(mockRedirect).toHaveBeenCalledTimes(1);
    const redirectUrl = mockRedirect.mock.calls[0][0];
    expect(redirectUrl.toString()).toBe('http://localhost:3000/');
  });

  it('should call NextResponse.next() when user is authenticated and route is private', () => {
    const request = createMockRequest({
      path: '/profile',
      cookies: { accessToken: 'myMockToken' },
    });

    middleware(request);

    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
