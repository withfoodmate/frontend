import styled from 'styled-components';
import { useCallback, useRef, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { UserProfileImage } from '../components/register/UserProfileImage';
import { Food } from '../components/register/food';
import { BasicPadding } from '../components/common/BasicPadding';
import { useNavigate } from 'react-router-dom';
import { registerMember, emailConfirm, nicknameConfirm } from '../api/memberApi';
import { removeDot } from '../utils/removeDot';

interface RegisterForm {
  nickname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  extraError?: string;
  image: File | null;
  food: string[];
}
// TODO : 1. 메뉴 선택 시 Dot 제거

export const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<RegisterForm>({ mode: 'onBlur' });

  // 비밀번호 재확인
  const passwordRef = useRef<string | null>(null);
  passwordRef.current = watch('password');

  // 회원가입 폼
  const [extraError, setExtraError] = useState<string>('');
  const [selectedFood, setSelectedFood] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleSelectedFood = useCallback(
    (selectedFood: string[]) => {
      const formattedFoods = selectedFood.map((item) => removeDot(item));
      setSelectedFood(formattedFoods);
    },
    [setSelectedFood],
  );

  const handleSelectedImage = (selectedImage: File | null) => {
    setSelectedImage(selectedImage);
  };

  const onSubmitHandler: SubmitHandler<RegisterForm> = async (data) => {
    try {
      const { email, nickname, password } = data;
      const food = selectedFood;
      const image = selectedImage;

      if (food.length < 1) {
        setExtraError('한개 이상의 메뉴를 선택해 주세요.');
        alert('한개 이상의 메뉴를 선택해 주세요.');
        return;
      }

      await registerMember({ email, nickname, password, image, food });
      alert('회원가입이 완료되었습니다. 이메일 인증 후 로그인 가능합니다.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      setExtraError('회원가입 중 오류가 발생했습니다.');
    }
  };

  // 이메일 중복확인
  const onEmailConfirm = async (email: string) => {
    try {
      const response = await emailConfirm({ email });
      if (response == true) {
        console.log('사용 가능한 이메일입니다.');
        alert('사용 가능한 이메일입니다.');
      } else {
        setExtraError('중복된 이메일입니다.');
        alert('중복된 이메일입니다.');
      }
    } catch {
      setExtraError('이메일 중복확인 오류');
    }
  };

  const emailCheck = () => {
    const email = watch('email');
    if (email) {
      onEmailConfirm(email);
    }
  };

  // 닉네임 중복확인
  const onNicknameConfirm = async (nickname: string) => {
    try {
      const response = await nicknameConfirm({ nickname });
      if (response == true) {
        alert('사용 가능한 닉네임입니다.');
      } else {
        setExtraError('중복된 닉네임입니다.');
        alert('중복된 닉네임입니다.');
      }
    } catch {
      setExtraError('닉네임 중복확인 오류');
    }
  };

  const nicknameCheck = () => {
    const nickname = watch('nickname');
    if (nickname) {
      onNicknameConfirm(nickname);
    }
  };

  return (
    <>
      <BasicPadding>
        <RegisterWrap>
          <RegisterTitle>회원가입</RegisterTitle>
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <UserProfileImage onImageSelect={handleSelectedImage} />

            <hr></hr>
            <RegisterBox>
              <RegisterInBox>
                <p>이메일</p>
                <InputBoxWrap>
                  <div>
                    <input
                      {...register('email', {
                        required: '필수 값입니다.',
                        pattern: {
                          value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                          message: '이메일을 올바르게 입력해주세요.',
                        },
                      })}
                      placeholder="이메일을 입력해주세요."
                    />
                    <p>{errors?.email?.message}</p>
                  </div>
                  <ConfirmButton type="button" onClick={() => emailCheck()}>
                    중복확인
                  </ConfirmButton>
                </InputBoxWrap>
              </RegisterInBox>

              <RegisterInBox>
                <p>비밀번호</p>
                <InputBoxWrap2>
                  <input
                    type="password"
                    {...register('password', {
                      required: '필수 값입니다.',
                      minLength: {
                        value: 8,
                        message: '비밀번호는 숫자, 영문자, 특수문자를 포함한 8글자 이상이어야 합니다.',
                      },
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                        message: '비밀번호는 숫자, 영문자, 특수문자를 포함한 8글자 이상이어야 합니다.',
                      },
                    })}
                    placeholder="비밀번호를 입력해주세요."
                  />
                  <p>{errors?.password?.message}</p>
                </InputBoxWrap2>
              </RegisterInBox>

              <RegisterInBox>
                <p>비밀번호 확인</p>
                <InputBoxWrap2>
                  <input
                    type="password"
                    {...register('passwordConfirm', {
                      required: '필수 값입니다.',
                      minLength: {
                        value: 8,
                        message: '비밀번호는 숫자, 영문자, 특수문자를 포함한 8글자 이상이어야 합니다.',
                      },
                      validate: (value) => value === passwordRef.current || '입력한 비밀번호와 일치하지 않습니다.',
                    })}
                    placeholder="비밀번호를 한번 더 입력해주세요"
                  />
                  <p>{errors?.passwordConfirm?.message}</p>
                </InputBoxWrap2>
              </RegisterInBox>

              <RegisterInBox>
                <p>닉네임</p>
                <InputBoxWrap>
                  <div>
                    <input
                      {...register('nickname', {
                        required: '필수 값입니다.',
                        minLength: {
                          value: 3,
                          message: '3글자 이상 입력해주세요.',
                        },
                        pattern: {
                          value: /^[A-za-z0-9가-힣]{3,10}$/,
                          message: '가능한 문자: 영문 대소문자, 글자 단위 한글, 숫자',
                        },
                      })}
                      placeholder="닉네임을 입력해주세요."
                    />
                    <p>{errors?.nickname?.message}</p>
                  </div>
                  <ConfirmButton type="button" onClick={() => nicknameCheck()}>
                    중복확인
                  </ConfirmButton>
                </InputBoxWrap>
              </RegisterInBox>

              <RegisterInBox>
                <p>
                  선호 음식
                  <span>
                    중복체크 가능
                    <br />
                    (최대 3개)
                  </span>
                </p>
                <Food onFoodSelection={handleSelectedFood} />
              </RegisterInBox>
            </RegisterBox>

            <hr></hr>

            <RegisterButton type="submit">회원가입</RegisterButton>
            {extraError && <p>{extraError}</p>}
          </form>
        </RegisterWrap>
      </BasicPadding>
    </>
  );
};

const RegisterWrap = styled.div`
  margin: 100px auto 0;
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media only screen and (max-width: 768px) {
    margin: 30px auto 0;
  }

  hr {
    width: 640px;
    border: 1px solid #f1f1f1;

    @media only screen and (max-width: 768px) {
      width: 410px;
    }
  }
`;
const RegisterTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 30px;
`;
const RegisterBox = styled.div`
  width: 640px;
  margin: 10px 0;
  padding: 0 20px;

  @media only screen and (max-width: 768px) {
    width: 410px;
  }
`;

const RegisterInBox = styled.div`
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

    span {
      font-size: 12px;
      font-weight: 400;
      line-height: 1;
      display: block;
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
`;

const RegisterButton = styled.button`
  width: 340px;
  height: 54px;
  padding: 8px 12px;
  background-color: #ffce00;
  border: 1px solid #ffce00;
  color: #212121;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  margin: 30px auto 130px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 768px) {
    width: 280x;
    height: 48px;
  }
`;

const ConfirmButton = styled.button`
  width: 120px;
  height: 48px;
  padding: 8px 12px;
  background-color: #ccc;
  border: 1px solid #ccc;
  color: #212121;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  margin-left: 8px;

  @media only screen and (max-width: 768px) {
    width: 80px;
    height: 32px;
    font-size: 13px;
  }
`;

const InputBoxWrap = styled.div`
  display: flex;
  align-items: flex-start;

  p {
    color: red;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.2;
    white-space: nowrap;
    margin-left: 10px;
    margin-top: 4px;
  }
`;
const InputBoxWrap2 = styled.div`
  p {
    color: red;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.2;
    white-space: nowrap;
    margin-left: 10px;
    margin-top: 4px;
  }
`;
