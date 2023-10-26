import { PostCard } from './PostCard';
import { AllPostCardType } from '../../types/postCardType';
import styled from 'styled-components';

export const PostCardsList = ({ groupsData }: { groupsData: AllPostCardType[] }) => {
  return (
    <CardsContainer>
      {groupsData?.map((card: AllPostCardType, idx: number) => <PostCard cardData={card} key={idx} />)}
    </CardsContainer>
  );
};

const CardsContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 12px;
`;
