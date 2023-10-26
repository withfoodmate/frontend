import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LABELCOLOR } from '../../constants/menu';
import { MenuLabel } from '../common/MenuLabel';

export const Food = ({ onFoodSelection }: { onFoodSelection: (selectedMenus: string[]) => void }) => {
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);

  const handleLabels = (menu: string) => {
    if (selectedMenus.length < 3 || selectedMenus.includes(menu)) {
      const updatedSelectedMenus = selectedMenus.includes(menu)
        ? selectedMenus.filter((selectedMenu) => selectedMenu !== menu)
        : [...selectedMenus, menu];
      setSelectedMenus(updatedSelectedMenus);
    } else {
      alert('메뉴 중복선택은 최대 3개까지 가능합니다.');
    }
  };

  useEffect(() => {
    onFoodSelection(selectedMenus);
  }, [selectedMenus, onFoodSelection]);

  return (
    <MenuLabelsContainer>
      {LABELCOLOR.map((item, idx) => {
        const isSelected = selectedMenus.includes(item.menu);

        return (
          <MenuLabel $menuColor={item.color} key={idx} onClick={() => handleLabels(item.menu)} $isSelected={isSelected}>
            {item.menu}
          </MenuLabel>
        );
      })}
    </MenuLabelsContainer>
  );
};

const MenuLabelsContainer = styled.div`
  font-size: 12px;
  width: 430px;

  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 4px;

  span {
    display: flex;
    padding: 6px 12px;
    width: 140px;
    font-size: 13px;
    font-weight: 600;
    border-radius: 16px;
    cursor: pointer;
    justify-content: center;

    @media only screen and (max-width: 768px) {
      padding: 4px;
      width: 100px;
    }
  }
`;
