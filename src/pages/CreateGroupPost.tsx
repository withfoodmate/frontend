import { useState } from 'react';
import styled from 'styled-components';
import { BasicPadding } from '../components/common/BasicPadding';
import { TinyEditor } from '../components/groupPost/TinyEditor';
import { LABELCOLOR } from '../constants/menu';
import { MenuLabel } from '../components/common/MenuLabel';
import { BasicButton } from '../components/common/BasicButton';
import { useNavigate } from 'react-router-dom';
import { getGeocode } from '../components/kakao/getGeocode';
import { KakaoMap } from '../components/kakao/KakaoMap';
import { GeocodeType } from '../types/mapType';
import { removeDot } from '../utils/removeDot';
import DatePicker from 'react-datepicker';
import { fetchCall } from '../api/fetchCall';
import { AxiosError } from 'axios';
// import { createGroup } from '../api/groupApi';

export const CreateGroupPost = () => {
  const navigation = useNavigate();
  const [meetingPlaceGeocode, setMeetingPlaceGeocode] = useState<string[]>(['', '']);
  const [content, setContent] = useState('');
  const [time, setTime] = useState(new Date());
  const [groupData, setGroupData] = useState({
    title: '',
    name: '',
    food: '',
    date: '',
    maximum: 2,
    storeName: '',
    storeAddress: '',
    latitude: '',
    longitude: '',
  });

  const handleContent = (content: string) => {
    setContent(content);
  };

  const handleLabels = (menu: string) => {
    const modifiedFood = removeDot(menu);
    setGroupData((prev) => ({ ...prev, food: modifiedFood }));
  };

  const getAddress = () => {
    new daum.Postcode({
      oncomplete: async (data) => {
        const fullAddress = data.address;
        const extraAddress = '';
        setGroupData((prev) => ({ ...prev, storeAddress: fullAddress + ' ' + extraAddress }));
        const geocode: GeocodeType = await getGeocode(fullAddress);
        setMeetingPlaceGeocode([geocode.La, geocode.Ma]);
        setGroupData((prev) => ({ ...prev, latitude: geocode.La, longitude: geocode.Ma }));
      },
    }).open();
  };

  const handlePost = async () => {
    const timeString = time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    if (confirm('글을 작성할까요?')) {
      try {
        await fetchCall('post', '/group', {
          title: groupData.title,
          name: groupData.name,
          content,
          food: groupData.food,
          date: groupData.date,
          time: timeString,
          maximum: groupData.maximum,
          storeName: groupData.storeName,
          storeAddress: groupData.storeAddress,
          latitude: groupData.latitude,
          longitude: groupData.longitude,
        });
      } catch (error) {
        const axiosError = error as AxiosError;
        alert(axiosError.response?.data);
        return;
      }

      navigation('/findfoodmate');
    } else {
      return;
    }
  };

  return (
    <PostContainer>
      <BasicPadding>
        <PostBox>
          <div className="rows-align">
            <div>
              <label htmlFor="input-title" className="title">
                제목
              </label>
              <br />
              <input
                id="input-title"
                type="text"
                placeholder="제목을 입력해 주세요"
                onChange={(e) => setGroupData((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="input-group-name" className="title">
                모임명
              </label>
              <br />
              <input
                id="input-group-name"
                type="text"
                placeholder="모임명을 입력해 주세요"
                onChange={(e) => setGroupData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <div className="title">본문</div>
            <TinyEditor value={content} handleContent={handleContent} />
          </div>

          <div>
            <div className="title">음식 선택</div>
            <div className="menu-labels">
              {LABELCOLOR.map((item, idx) => {
                const isSelected = removeDot(groupData.food).includes(removeDot(item.menu));
                return (
                  <div className="menu-label" key={idx}>
                    <MenuLabel $menuColor={item.color} $isSelected={isSelected} onClick={() => handleLabels(item.menu)}>
                      {item.menu}
                    </MenuLabel>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rows-align">
            <div>
              <label htmlFor="date-title" className="title">
                모임 날짜
              </label>
              <br />
              <input
                type="date"
                id="date-title"
                onChange={(e) => setGroupData((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="time-title" className="title">
                모임 시간
              </label>
              <br />
              <DatePicker
                id="time-title"
                selected={time}
                onChange={(date) => date && setTime(date)}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="Time"
                dateFormat="h:mm aa"
              />
            </div>

            <div>
              <label htmlFor="input-maximum" className="title">
                모집 인원
              </label>
              <br />
              <div className="recruite">
                <input
                  id="input-maximum"
                  type="number"
                  max={8}
                  min={2}
                  placeholder="2"
                  onChange={(e) => setGroupData((prev) => ({ ...prev, maximum: parseInt(e.target.value) }))}
                />
                <span>명</span>
              </div>
            </div>
          </div>

          <div>
            <div className="title">모임 장소</div>
            <input
              type="text"
              readOnly
              onClick={getAddress}
              placeholder="주소를 입력해 주세요"
              value={groupData.storeAddress}
            />
            <input
              type="text"
              onChange={(e) => setGroupData((prev) => ({ ...prev, storeName: e.target.value }))}
              placeholder="가게명을 입력해 주세요"
            />
          </div>
          {meetingPlaceGeocode && <KakaoMap geoCode={meetingPlaceGeocode} />}

          <div className="buttons">
            <BasicButton $fontSize="12px" onClick={handlePost}>
              작성하기
            </BasicButton>
            <BasicButton
              $fontSize="12px"
              $backgdColor="#c0c0c0"
              $hoverBackgdColor="#a4a4a4"
              onClick={() => navigation(-1)}
            >
              취소
            </BasicButton>
          </div>
        </PostBox>
      </BasicPadding>
    </PostContainer>
  );
};

const PostContainer = styled.div`
  .title {
    font-size: 11px;
    font-weight: 900;
    width: 100%;
    margin-left: 6px;
    margin-bottom: 6px;
  }

  input {
    width: 100%;
    border: none;
    border-radius: 8px;
    padding: 12px 8px;
    font-size: 11px;
    margin-top: 6px;

    &::placeholder {
      font-size: 11px;
    }
  }

  .rows-align {
    display: flex;
    gap: 24px;

    & > div {
      width: 100%;
    }
  }

  .menu-labels {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    .menu-label {
      scale: 0.9;
    }
  }

  .recruite {
    display: flex;
    align-items: center;
    gap: 8px;
    span {
      font-size: 12px;
    }
  }
`;

const PostBox = styled.div`
  margin: 50px auto;
  width: 60%;
  height: fit-content;
  border-radius: 12px;
  padding: 32px 24px;
  background-color: ${(props) => props.theme.color.LIGHT_GRAY};

  display: flex;
  flex-direction: column;
  gap: 38px;

  .buttons {
    display: flex;
    gap: 4px;
    justify-content: flex-end;

    button {
      width: 120px;
    }
  }
`;
