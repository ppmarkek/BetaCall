import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { middleware } from '@/middleware';


const mockRedirect = jest.spyOn(NextResponse, 'redirect');
const mockNext = jest.spyOn(NextResponse, 'next');

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
  const mockedUrl = new URL(url + path + searchParams);

  return {
    nextUrl: mockedUrl,
    cookies: {
      get: (key: string) => {
        const value = cookies[key];
        return value ? { value } : undefined;
      },
    },
    url: url + path + searchParams,
  } as unknown as NextRequest;
}

describe('middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should remove search params if on "/signUp" but no "socialMedia" in query', () => {
    const request = createMockRequest({
      path: '/signUp',
      searchParams: '?foo=bar',
    });

    middleware(request);

    expect(mockRedirect).toHaveBeenCalledTimes(1);

    const redirectUrl = mockRedirect.mock.calls[0][0];
    expect(redirectUrl.toString()).toBe('http://localhost:3000/signUp');
  });

  it('should allow "/signUp" if "socialMedia" is in the query', () => {
    const request = createMockRequest({
      path: '/signUp',
      searchParams: '?socialMedia=google',
    });

    middleware(request);

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
      cookies: {},
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
