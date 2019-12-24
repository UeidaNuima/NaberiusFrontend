import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { useLocation } from 'react-router-dom';
import logo from '../../logo.png';
import styles from './Header.module.less';

const { Header } = Layout;
const { SubMenu, Item } = Menu;

const HeaderBar: React.FC = () => {
  const [active, setActive] = useState('/');
  const location = useLocation();
  useEffect(() => {
    setActive(location.pathname.split('/')[1]);
  }, [location]);

  return (
    <Header className={styles.header}>
      <Link to="/">
        <img alt="logo" src={logo} className={styles.logo} />
      </Link>
      <Menu
        mode="horizontal"
        className={styles.headerMenu}
        selectedKeys={[active]}
      >
        <Item key="unit">
          <Link to="/unit">单位</Link>
        </Item>
        <Item key="quest">
          <Link to="/quest">关卡</Link>
        </Item>
        <SubMenu title="...">
          <Item key="class">
            <Link to="/class">职业</Link>
          </Item>
          <Item key="skill">
            <Link to="/skill">技能</Link>
          </Item>
          <Item key="ability">
            <Link to="/ability">被动</Link>
          </Item>
        </SubMenu>
        {/* <Item key="emoji">
              <Link to="/emoji">机器狗</Link>
            </Item> */}
      </Menu>
    </Header>
  );
};

export default HeaderBar;
