import { BasicPadding } from '../components/common/BasicPadding';
import { SideMenu } from '../components/common/SideMenu';
import { MYPAGE_CATEGORY } from '../constants/mypage';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useRef, useState } from 'react';
import { LoginButton } from '../components/common/LoginButton';
import { fetchCall } from '../api/fetchCall';
import { AxiosError } from 'axios';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  passwordConfirm: string;
  extraError?: string;
}

export const Password = () => {
  const {
    register,
    formState: { errors },
  } = useForm<PasswordForm>({ mode: 'onBlur' });

  const passwordRef = useRef<string | null>(null);

  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async () => {
    if (password.newPassword !== password.confirmPassword) {
      alert('새 비밀번호를 확인해주세요');
      return;
    }
    try {
      await fetchCall('patch', '/member/password', {
        oldPassword: password.currentPassword,
        newPassword: password.newPassword,
      });
      setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('비밀번호가 변경되었습니다.');
    } catch (error) {
      const axiosError = error as AxiosError;
      alert(axiosError.response?.data);
    }
  };

  return (
    <>
      <BasicPadding>
        <PasswordWrap>
          <SideMenu sideMenuList={MYPAGE_CATEGORY} navMenuIdx={3} />
          <PasswordBox>
            <h3>
              <span>#</span> 비밀번호 변경
            </h3>
            <hr></hr>
            <PasswordPaddig>
              <PasswordInBox>
                <p>현재 비밀번호</p>
                <div>
                  <input
                    type="password"
                    {...register('currentPassword', {
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
                    placeholder="현재 비밀번호를 입력해주세요."
                    onChange={(e) => setPassword((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    value={password.currentPassword}
                  />
                  <p>{errors?.newPassword?.message}</p>
                </div>
              </PasswordInBox>

              <PasswordInBox>
                <p>새 비밀번호</p>
                <div>
                  <input
                    type="password"
                    {...register('newPassword', {
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
                    placeholder="새로운 비밀번호를 입력해주세요."
                    onChange={(e) => setPassword((prev) => ({ ...prev, newPassword: e.target.value }))}
                    value={password.newPassword}
                  />
                  <p>{errors?.newPassword?.message}</p>
                </div>
              </PasswordInBox>

              <PasswordInBox>
                <p>새 비밀번호 확인</p>
                <div>
                  <input
                    type="password"
                    {...register('passwordConfirm', {
                      required: '필수 값입니다.',
                      minLength: {
                        value: 8,
                        message: '비밀번호는 숫자, 영문 대문자, 소문자, 특수문자를 포함한 8글자 이상이어야 합니다.',
                      },
                      validate: (value) => value === passwordRef.current,
                    })}
                    placeholder="비밀번호를 한번 더 입력해주세요"
                    onChange={(e) => setPassword((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    value={password.confirmPassword}
                  />
                  <p>{errors?.passwordConfirm?.message}</p>
                </div>
              </PasswordInBox>
            </PasswordPaddig>
            <hr></hr>
            <LoginButton $fontSize="16px" onClick={handleSubmit}>
              변경하기
            </LoginButton>
          </PasswordBox>
        </PasswordWrap>
      </BasicPadding>
    </>
  );
};

const PasswordWrap = styled.div`
  display: flex;
  margin: 60px 0;
`;

const PasswordBox = styled.div`
  width: 640px;
  margin: 0 auto;

  @media only screen and (max-width: 768px) {
    width: 410px;
  }

  h3 {
    font-size: 24px;
    color: #212121;
    text-align: center;
    margin-bottom: 50px;


    span {
      color: ${(props) => props.theme.color.ORANGE};
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
`;

const PasswordInBox = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 10px 0;

  p {
    width: 140px;
    min-width: 140px;
    max-width: 140px;
    font-size: 14px;
    color: #212121;
    font-weight: 600;
    line-height: 48px;

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

const PasswordPaddig = styled.div`
  margin: 10px 0;
  padding: 0 20px;
`;
