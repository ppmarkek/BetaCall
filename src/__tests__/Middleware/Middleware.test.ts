import 'isomorphic-fetch';
import { NextRequest } from 'next/server';
import { middleware } from '@/middleware';

interface NextUrl extends URL {
  clone: () => URL;
}

function createMockRequest({
  url = 'http://localhost:3000',
  path = '/',
  searchParams = '',
  cookies = {},
}: {
  url?: string;
  path?: string;
  searchParams?: string;
  cookies?: Record<string, string>;
}): NextRequest {
  const fullUrl = new URL(url);
  fullUrl.pathname = path;
  fullUrl.search = searchParams;

  const mockedUrl = fullUrl as NextUrl;
  mockedUrl.clone = () => new URL(mockedUrl.toString());

  return {
    nextUrl: mockedUrl,
    cookies: {
      get: (key: string) => {
        const value = cookies[key];
        return value ? { value } : undefined;
      },
    },
    url: mockedUrl.toString(),
  } as unknown as NextRequest;
}

describe('middleware', () => {
  it('should remove search params if on "/signUp" but no "socialMedia" in query', () => {
    const request = createMockRequest({
      path: '/signUp',
      searchParams: '?foo=bar',
    });

    const response = middleware(request);
    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/signUp'
    );
  });

  it('should allow "/signUp" if "socialMedia" is in the query', () => {
    const request = createMockRequest({
      path: '/signUp',
      searchParams: '?socialMedia=google',
    });

    const response = middleware(request);
    expect(response.headers.get('location')).toBeNull();
  });

  it('should just call NextResponse.next() for static file paths (like /logo.png)', () => {
    const request = createMockRequest({
      path: '/images/logo.png',
    });

    const response = middleware(request);
    expect(response.headers.get('location')).toBeNull();
  });

  it('should allow routes that start with "/verify/" to proceed', () => {
    const request = createMockRequest({
      path: '/verify/1234',
    });

    const response = middleware(request);
    expect(response.headers.get('location')).toBeNull();
  });

  it('should allow routes that start with "/resetPassword/" to proceed', () => {
    const request = createMockRequest({
      path: '/resetPassword/abcdef',
    });

    const response = middleware(request);
    expect(response.headers.get('location')).toBeNull();
  });

  it('should redirect to "/signIn" when user is NOT authenticated and route is private', () => {
    const request = createMockRequest({
      path: '/private-route',
      cookies: {},
    });

    const response = middleware(request);
    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/signIn'
    );
  });

  it('should redirect to "/" when user IS authenticated and route is public ("/signUp")', () => {
    const request = createMockRequest({
      path: '/signUp',
      cookies: { accessToken: 'myMockToken' },
    });

    const response = middleware(request);
    expect(response.headers.get('location')).toBe('http://localhost:3000/');
  });

  it('should call NextResponse.next() when user is authenticated and route is private', () => {
    const request = createMockRequest({
      path: '/profile',
      cookies: { accessToken: 'myMockToken' },
    });

    const response = middleware(request);
    expect(response.headers.get('location')).toBeNull();
  });
});
