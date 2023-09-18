import styled from 'styled-components';

const ButtonReset = styled.button`
  width: 110px;
  height: 56px;
  overflow: visible;
  background: transparent;
  margin: 0;
  padding: 0;
  border-radius: 8px;
  border: 1px solid #ffce00;
  color: #212121;
  font-size: 16px;
  font-family: 'Spoqa Han Sans Neo', 'sans-serif';
`;

const StyledSignInButton = styled(ButtonReset)`
  background-color: #fff;
`;
const StyledSignUpButton = styled(ButtonReset)`
  background-color: #ffce00;
`;

export type SignInButtonProps = {
  text: string;
  fill: string;
};
export default function SignInUpButton({ text, fill }: SignInButtonProps) {
  let button;

  if (text === '로그인' && fill === 'none') {
    button = <StyledSignInButton>{text}</StyledSignInButton>;
  } else if (text === '회원가입' && fill === 'fill') {
    button = <StyledSignUpButton>{text}</StyledSignUpButton>;
  }
  return button;
}
