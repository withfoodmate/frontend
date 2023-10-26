import { useState, useEffect } from 'react';
import { BasicPadding } from '../components/common/BasicPadding';
import { SideMenu } from '../components/common/SideMenu';
import { MYPAGE_CATEGORY } from '../constants/mypage';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { LoginButton } from '../components/common/LoginButton';
import { IoCaretForwardOutline } from 'react-icons/io5';
import { fetchCall } from '../api/fetchCall';
import { AxiosError } from 'axios';
import { deleteCookie } from '../utils/deleteCookie';
import { useNavigate } from 'react-router-dom';

interface QuitForm {
  password: string;
  extraError?: string;
}

export const Quit = () => {
  const [myEmail, setMyEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const myInfoData = await fetchCall('get', '/member');
        setMyEmail(myInfoData.email);
      } catch (error) {
        console.error('myInfoData', error);
      }
    })();
  }, []);

  const {
    register,
    formState: { errors },
  } = useForm<QuitForm>({ mode: 'onBlur' });

  const handleSubmit = async () => {
    try {
      await fetchCall('delete', '/member/delete', {
        password,
      });
      sessionStorage.clear();
      deleteCookie('refreshToken');
      navigation('/');
    } catch (error) {
      const axiosError = error as AxiosError;
      alert(axiosError.response?.data);
    }
  };

  return (
    <>
      <BasicPadding>
        <QuitWrap>
          <SideMenu sideMenuList={MYPAGE_CATEGORY} navMenuIdx={3} />
          <QuitBox>
            <h3>회원 탈퇴</h3>
            <QuitText>
              <span>
                <IoCaretForwardOutline size="17px" color="#fff" text-align="center" />
              </span>
              <p>
                탈퇴한 이메일은 다시 사용할 수 없습니다.
                <br />
                입력하신 개인정보 모두 삭제 처리됩니다.
              </p>
            </QuitText>
            <hr></hr>
            <QuitPaddig>
              <QuitInBox>
                <p>이메일</p>
                <div>{myEmail}</div>
              </QuitInBox>

              <QuitInBox>
                <p>비밀번호</p>
                <div>
                  <input
                    type="password"
                    {...register('password', {
                      required: '필수 값입니다.',
                      minLength: {
                        value: 8,
                        message: '비밀번호는 숫자, 영문 대문자, 소문자, 특수문자를 포함한 8글자 이상이어야 합니다.',
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                        message: '비밀번호는 숫자, 영문 대문자, 소문자, 특수문자를 포함한 8글자 이상이어야 합니다.',
                      },
                    })}
                    placeholder="비밀번호를 입력해주세요."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <p>{errors?.password?.message}</p>
                </div>
              </QuitInBox>
            </QuitPaddig>
            <hr></hr>
            <LoginButton $fontSize="16px" onClick={handleSubmit}>
              회원 탈퇴
            </LoginButton>
          </QuitBox>
        </QuitWrap>
      </BasicPadding>
    </>
  );
};

const QuitWrap = styled.div`
  display: flex;
  margin: 120px 0 263px 0;
`;

const QuitBox = styled.div`
  width: 640px;
  margin: 0 auto;

  h3 {
    font-size: 24px;
    color: #212121;
    text-align: center;
    margin-bottom: 50px;

    @media only screen and (max-width: 768px) {
      margin-bottom: 30px;
      font-size: 20px;
    }
  }

  hr {
    width: 640px;
    border: 1px solid #f1f1f1;

    @media only screen and (max-width: 768px) {
      width: 410px;
    }
  }

  p {
    font-size: 14px;
    color: #212121;
    margin-bottom: 30px;
  }
`;

const QuitInBox = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;

  p {
    width: 140px;
    min-width: 140px;
    max-width: 140px;
    font-size: 14px;
    color: #212121;
    font-weight: 600;
    line-height: 48px;
    margin-bottom: 0;

    @media only screen and (max-width: 768px) {
      width: 100px;
      min-width: 100px;
      max-width: 100px;
      line-height: 32px;
      font-size: 13px;
    }
  }

  input {
    width: 300px;
    max-width: 300px;
    height: 48px;
    border-radius: 8px;
    border: 1px solid #ccc;
    padding-left: 15px;

    @media only screen and (max-width: 768px) {
      width: 220px;
      max-width: 220px;
      height: 32px;
    }
  }

  div {
    p {
      color: red;
      font-size: 12px;
      font-weight: 400;
      line-height: 1.2;
      white-space: nowrap;
      margin-left: 10px;
      margin-top: 4px;
    }
  }
`;

const QuitPaddig = styled.div`
  margin: 10px 0;
  padding: 0 20px;
`;

const QuitText = styled.div`
  display: flex;
  align-items: flex-start;

  span {
    display: inline-block;
    width: 16px;
    height: 16px;
    background-color: #ffc200;
    border-radius: 2px;
    margin: 2px 6px 0 0;
  }

  p {
    font-size: 14px;
    color: #212121;
  }
`;
