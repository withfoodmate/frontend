import { styled } from 'styled-components';

export const BasicPadding = ({ children }: { children: React.ReactNode }) => {
  return <PaddingContainer>{children}</PaddingContainer>;
};

const PaddingContainer = styled.div`
  padding: 0 120px;

  @media only screen and (max-width: 768px) {
    padding: 0 30px;
  }
`;
