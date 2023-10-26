import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BasicPadding } from '../components/common/BasicPadding';
import { SideMenu } from '../components/common/SideMenu';
import { MEETING_INFO_MENU } from '../constants/menu';
import { MeetingInfoRequestCardList } from '../components/meetingInfo/MeetingInfoRequestCardList';
import { fetchCall } from '../api/fetchCall';
import { useQuery } from '@tanstack/react-query';
import { MeetingRequestDataType } from '../types/postCardType';
import { useSetRecoilState } from 'recoil';
import { requestCategory } from '../store/meetingInfo';

export const Inquiry = () => {
  const [selectedCategory, setSelectedCategory] = useState('받은 요청');
  const [decision, setDecision] = useState('unprocessed');
  const [currentData, setCurrentData] = useState<MeetingRequestDataType[]>();
  const setRequestCategory = useSetRecoilState(requestCategory);

  const handleCategory = (category: string) => {
    setSelectedCategory(category);
    if (category === '받은 요청') {
      setDecision('unprocessed');
      setRequestCategory('받은 요청');
    } else {
      setDecision('processed');
      setRequestCategory('수락한 요청');
    }
  };

  const { data } = useQuery(['requestData', selectedCategory], () =>
    fetchCall('get', `/enrollment/receive?decision=${decision}`),
  );

  useEffect(() => {
    if (data) {
      setCurrentData(data.content);
    }
  }, [currentData, data]);

  return (
    <BasicPadding>
      <InquiryContainer>
        <div className="contents-box">
          <SideMenu sideMenuList={MEETING_INFO_MENU} navMenuIdx={2} />
          <Contents>
            <h2>
              <span>#</span> 모임 정보 - 요청 조회
            </h2>
            <div className="category">
              <div className="category-list">
                <div
                  onClick={() => handleCategory('받은 요청')}
                  className={selectedCategory === '받은 요청' ? 'selected-category' : ''}
                >
                  받은 요청
                </div>
                <div
                  onClick={() => handleCategory('수락한 요청')}
                  className={selectedCategory === '수락한 요청' ? 'selected-category' : ''}
                >
                  수락한 요청
                </div>
              </div>
            </div>
            <hr />
            <p>3개월 이내의 신청 내역까지 확인할 수 있어요.</p>
            <MeetingInfoRequestCardList requestData={currentData} />
          </Contents>
        </div>
      </InquiryContainer>
    </BasicPadding>
  );
};

const InquiryContainer = styled.div`
  margin: 60px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  .contents-box {
    width: 100%;
    display: flex;
    gap: 12px;
  }
`;

const Contents = styled.div`
  flex: 1;
  padding: 0 100px;

  .category {
    display: flex;
    justify-content: space-between;

    .category-list {
      display: flex;
      gap: 26px;
      cursor: pointer;
    }
  }

  h2 {
    margin-bottom: 24px;

    span {
      color: ${(props) => props.theme.color.ORANGE};
    }
  }

  .selected-category {
    color: ${(props) => props.theme.color.ORANGE};
  }

  .selected-status {
    display: none;
  }

  p {
    font-size: 12px;
    color: ${(props) => props.theme.color.GRAY};
  }

  hr {
    margin: 12px 0;
  }
`;
