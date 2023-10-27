import axios from 'axios';

export const getRefreshTokenCookie = () => {
  const cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i++) {
    const parts = cookies[i].split('=');
    const name = parts[0];
    const value = parts[1];
    if (name === 'refreshToken') {
      return value;
    }
  }
  return null;
};

export const refreshTokens = async () => {
  try {
    const response = await axios.get('/api/group/all', {
      headers: {
        'Authorization-Refresh': `Bearer ${getRefreshTokenCookie()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('토큰 재발급 실패', error);
    return null;
  }
};
