import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MeetingInfoDataType } from '../../types/postCardType';
import { formatDateTime } from '../../utils/formatDate';
import { useNavigate } from 'react-router-dom';

export const MeetingInfoCard = ({ meetingInfoData }: { meetingInfoData: MeetingInfoDataType }) => {
  const navigation = useNavigate();
  const [status, setStatus] = useState('');
  const [dateTime, setDateTime] = useState<string>();

  useEffect(() => {
    setDateTime(formatDateTime(meetingInfoData.foodGroupGroupDateTime));
  }, [meetingInfoData.foodGroupGroupDateTime]);

  useEffect(() => {
    switch (meetingInfoData.status) {
      case 'ACCEPT':
        setStatus('수락됨');
        break;
      case 'CANCEL':
        setStatus('신청 취소');
        break;
      case 'SUBMIT':
        setStatus('신청 완료');
        break;
      case 'REFUSE':
        setStatus('거절됨');
        break;
      case 'GROUP_CANCEL':
        setStatus('모임 취소');
        break;
      case 'GROUP_COMPLETE':
        setStatus('모임 완료');
        break;
    }
  }, [meetingInfoData.status]);

  const handleCardSelect = () => {
    navigation(`/findfoodmate/${meetingInfoData.foodGroupId}`);
  };

  return (
    <CardContainer onClick={handleCardSelect}>
      <div className="profile-image">
        <img src={meetingInfoData.foodGroupMemberImage} alt="프로필 사진" />
      </div>
      <div>
        <div className="date">{dateTime}</div>
        <div className="location">{meetingInfoData.foodGroupStoreAddress}</div>
        <div className="info">
          {meetingInfoData.foodGroupStoreName} (총 {meetingInfoData.foodGroupMaximum}명)
        </div>
        <div className="state">{status}</div>
      </div>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  width: 100%;
  min-width: 400px;
  cursor: pointer;

  height: 140px;
  background-color: ${(props) => props.theme.color.GRAY}60;
  border-radius: 12px;
  padding: 0 24px;

  display: flex;
  align-items: center;
  gap: 24px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .profile-image {
    width: 80px;
    height: 80px;
    background-color: #fff;
    border-radius: 50%;
    overflow: hidden;
  }

  .date {
    font-weight: 900;
  }

  .location,
  .info {
    font-size: 14px;
    color: ${(props) => props.theme.color.DARK_GRAY};
    margin: 4px 0;
  }

  .state {
    font-size: 14px;
    font-weight: 900;
    color: ${(props) => props.theme.color.ORANGE};
  }
`;
