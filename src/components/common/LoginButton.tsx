import styled from 'styled-components';

interface LoginButtonPropsType {
  children: React.ReactNode;
  $fontSize: string;
  $fontColor?: string;
  $backgdColor?: string;
  $borderColor?: string;
  $hoverFontColor?: string;
  $hoverBackgdColor?: string;
  onClick?: () => void;
}

export const LoginButton = ({
  children,
  $fontColor = '#212121',
  $backgdColor = '#FFCE00',
  $borderColor = $backgdColor,
  $hoverFontColor,
  $hoverBackgdColor = '#ffbf00',
  $fontSize,
  onClick,
}: LoginButtonPropsType) => {
  return (
    <ButtonWrap>
      <Button
        $fontColor={$fontColor}
        $backgdColor={$backgdColor}
        $borderColor={$borderColor}
        $hoverFontColor={$hoverFontColor}
        $hoverBackgdColor={$hoverBackgdColor}
        $fontSize={$fontSize}
        onClick={onClick}
      >
        {children}
      </Button>
    </ButtonWrap>
  );
};

const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const Button = styled.button<LoginButtonPropsType>`
  padding: 8px 12px;
  background-color: ${(props) => props.$backgdColor};
  border: 1px solid ${(props) => props.$borderColor};
  color: ${(props) => props.$fontColor};
  border-radius: 8px;
  font-size: ${(props) => props.$fontSize};
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  width: 340px;
  height: 54px;
  margin-top: 50px;

  @media only screen and (max-width: 768px) {
    width: 280x;
    height: 48px;
  }

  &:hover {
    color: ${(props) => props.$hoverFontColor};
    background-color: ${(props) => props.$hoverBackgdColor};
  }
`;
