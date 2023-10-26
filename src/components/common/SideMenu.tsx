import styled from 'styled-components';
import { NAV_MENUS } from '../../constants/nav-menus';
import { useLocation, useNavigate } from 'react-router-dom';

interface SubMenuData {
  title: string;
  path?: string;
}

interface SideMenuListType {
  sideMenuList: {
    title: string;
    list: string[];
  };
  navMenuIdx: number;
  parentPath?: string;
}

export const SideMenu = (props: SideMenuListType) => {
  const navigation = useNavigate();
  const location = useLocation();
  const { sideMenuList } = props;

  const getSubListPath = (submenu: string) => {
    let subMenuData: SubMenuData | undefined;
    for (const navMenu of NAV_MENUS) {
      if (navMenu.subList) {
        subMenuData = navMenu.subList.find((sub) => sub.title === submenu);
        if (subMenuData) {
          return `/${subMenuData.path || ''}`;
        }
      }
    }
    return '';
  };

  const handleSideMenu = (subListPath: string) => {
    navigation(subListPath);
  };

  return (
    <SideMenuContainer>
      <div className="sidemenu-title">
        <div className="foodmate">FOODMATE</div>
        <div>{sideMenuList.title}</div>
      </div>

      {sideMenuList.list.map((menu: string, idx: number) => {
        const subListPath = getSubListPath(menu);

        return (
          <div
            key={idx}
            className={location.pathname === subListPath ? 'selected-sidemenu' : ''}
            onClick={() => handleSideMenu(subListPath)}
          >
            {menu}
          </div>
        );
      })}
    </SideMenuContainer>
  );
};

const SideMenuContainer = styled.aside`
  .sidemenu-title {
    border-top: 1px solid #c0c0c0;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    background-color: ${(props) => props.theme.color.DARK_GRAY};
    color: #fff;
    padding: 38px;

    display: flex;
    flex-direction: column;
    align-items: center;

    @media only screen and (max-width: 992px) {
      padding: 30px;
    }

    @media only screen and (max-width: 768px) {
      padding: 25px;
    }
  }

  .foodmate {
    color: ${(props) => props.theme.color.YELLOW};
    font-size: 12px;
  }

  & > div {
    padding: 16px 38px;
    border: 1px solid #c0c0c0;
    border-top: 0;

    @media only screen and (max-width: 992px) {
      padding: 12px 15px;
    }

    @media only screen and (max-width: 768px) {
      padding: 10px;
    }
  }

  & > div:last-child {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  & > div:not(:first-child) {
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background-color: ${(props) => props.theme.color.YELLOW};
    }
  }

  .selected-sidemenu {
    background-color: ${(props) => props.theme.color.YELLOW};
  }
`;
