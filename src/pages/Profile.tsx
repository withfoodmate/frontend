import { BasicPadding } from '../components/common/BasicPadding';
import { SideMenu } from '../components/common/SideMenu';
import { MYPAGE_CATEGORY } from '../constants/mypage';
import styled from 'styled-components';
import { Food } from '../components/mypage/food';
import { LoginButton } from '../components/common/LoginButton';
import { UserProfileImage } from '../components/mypage/UserProfileImage';
import { fetchCall } from '../api/fetchCall';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { imageAndFoodsModifiedData } from '../store/userInfo';
import axios from 'axios';
import { findMatchingMenu } from '../utils/addDot';

export const Profile = () => {
  const [myInfo, setMyInfo] = useState<{ image: string; foods: string[] }>({
    image: '',
    foods: [],
  });
  const modifiedData = useRecoilValue(imageAndFoodsModifiedData);
  const API_TOKEN = sessionStorage.getItem('accessToken');

  useEffect(() => {
    (async () => {
      try {
        const myInfoData = await fetchCall('get', '/member');
        const labeledFood = myInfoData.food.map((foodItem: string) => {
          const matchingMenu = findMatchingMenu(foodItem);
          return matchingMenu ? matchingMenu : foodItem;
        });

        setMyInfo({ image: myInfoData.image, foods: labeledFood });
      } catch (error) {
        console.error('myInfoData', error);
      }
    })();
  }, []);

  const handleModify = async () => {
    const imageFormData = new FormData();
    if (modifiedData.image) {
      imageFormData.append('imageFile', modifiedData.image);

      try {
        await axios.patch(`/api/member/image`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${API_TOKEN}`,
          },
        });
      } catch (error) {
        console.error('image', error);
      }
    }

    try {
      await fetchCall('patch', '/member/food', {
        food: modifiedData.food,
      });
    } catch (error) {
      console.error('foods', error);
    }

    alert('프로필 수정 완료!');
  };

  return (
    <>
      <BasicPadding>
        <ProfileWrap>
          <SideMenu sideMenuList={MYPAGE_CATEGORY} navMenuIdx={3} />
          <ProfileBox>
            <h3>
              <span>#</span> 프로필 수정
            </h3>
            <UserProfileImage currentImage={myInfo.image} />
            <hr></hr>
            <ProfilePadding>
              <ProfileInBox>
                <p>
                  선호 음식
                  <span>
                    중복체크 가능
                    <br />
                    (최대 3개)
                  </span>
                </p>
                <Food currentFoods={myInfo.foods} />
              </ProfileInBox>
            </ProfilePadding>
            <hr></hr>
            <LoginButton $fontSize="16px" onClick={handleModify}>
              수정하기
            </LoginButton>
          </ProfileBox>
        </ProfileWrap>
      </BasicPadding>
    </>
  );
};

const ProfileWrap = styled.div`
  display: flex;
  margin: 60px 0;
`;

const ProfileBox = styled.div`
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

const ProfileInBox = styled.div`
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
`;

const ProfilePadding = styled.div`
  margin: 10px 0;
  padding: 0 20px;
`;
