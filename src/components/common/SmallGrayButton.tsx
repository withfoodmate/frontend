import React from 'react';
import styled from 'styled-components';

interface ButtonPropsType {
  children: React.ReactNode;
  onClick: () => void;
}

export const SmallGrayButton = ({ children, onClick }: ButtonPropsType) => {
  return <Button onClick={onClick}>{children}</Button>;
};
const Button = styled.button`
  background-color: #d8d8d8;
  border: none;
  padding: 4px 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.4s;

  &:hover {
    background-color: #cecece;
  }
`;
