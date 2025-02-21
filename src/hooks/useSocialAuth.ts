import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useSocialAuth() {
  const router = useRouter();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data?.socialData) {
          const { email, firstName, lastName, provider, socialId } =
            data.socialData;
          const query = new URLSearchParams({
            email,
            firstName,
            lastName,
            provider,
            socialId,
          }).toString();
          router.push(`/signUp?${query}`);
        }
        if (data?.accessToken && data?.refreshToken) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          router.push('/');
        }
      } catch (err) {
        console.error('Error processing social authentication messages:', err);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [router]);

  const handleSocialLogin = (provider: string) => {
    const width = 600;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const url = `/auth/${provider}`;
    window.open(
      url,
      'Social Login',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  return { handleSocialLogin };
}
