import { registerType, emailType, nicknameType } from '../types/registerType';
import axios, { AxiosError } from 'axios';
import { ErrorResponse } from 'react-router-dom';
import { UserInfoType } from '../types/userInfoType';
import { ACCESS_TOKEN, AUTHORIZATION } from '../constants/auth';
import { getRefreshTokenCookie } from '../utils/getRefreshTokenCookie';

// 로그인
export const onSignIn = async (email: string, password: string) => {
  try {
    const result = await axios.post(`/api/member/signin`, {
      email,
      password,
    });
    return result.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response) {
      if (axiosError.response.status === 401) {
        try {
          const refreshResult = await axios.post(`/api/refresh`, {
            'Authorization-Refresh': `Bearer ${getRefreshTokenCookie()}`,
          });

          const newAccessToken = refreshResult.data.accessToken;

          const newResult = await axios.post(
            `/api/member/signin`,
            {
              email,
              password,
            },
            {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            },
          );

          return newResult.data;
        } catch (refreshError) {
          console.error('리프레시 토큰 오류:', refreshError);
        }
      } else {
        alert(axiosError.response.data);
      }
    } else {
      console.error('서버 응답 없음');
    }
  }
};

// 카카오로 로그인
export const kakaoSignIn = async () => {
  try {
    const result = await axios.get('/api/oauth2/authorization/kakao');
    return result.data;
  } catch (error) {
    console.error(error);
  }
};

// 회원가입
export const registerMember = async ({ email, nickname, password, image, food }: registerType) => {
  const imageFormData = new FormData();
  if (image) {
    imageFormData.append('file', image);
  }

  const jsonDataBlob = new Blob([JSON.stringify({ email, nickname, password, food })], {
    type: 'application/json',
  });

  const jsonFormData = new FormData();
  jsonFormData.append('request', jsonDataBlob);

  try {
    for (const [key, value] of jsonFormData.entries()) {
      imageFormData.append(key, value);
    }

    const result = await axios.post('/api/member/signup', imageFormData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return result.data;
  } catch (error) {
    console.error(error);
  }
};

// 이메일 중복확인
export const emailConfirm = async ({ email }: emailType) => {
  try {
    const response = await axios.get('/api/member/email', { params: { email } });
    console.log('response>>>>>>>>>>>>>>' + response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 닉네임 중복확인
export const nicknameConfirm = async ({ nickname }: nicknameType) => {
  try {
    const response = await axios.get('/api/member/nickname', { params: { nickname } });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

/**
 * 로그인 사용자 정보 조회
 * @returns UserInfoType
 */
export const getMyProfile = async (): Promise<UserInfoType> => {
  if (axios.defaults.headers.common[AUTHORIZATION] === undefined)
    axios.defaults.headers.common[AUTHORIZATION] = 'Bearer ' + sessionStorage.getItem(ACCESS_TOKEN);

  const { data } = await axios.get(`/api/member`);
  return data;
};
