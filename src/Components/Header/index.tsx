import * as React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import logo from '../../logo.png';

const { Header } = Layout;
const { SubMenu, Item } = Menu;

interface HeaderBarStates {
  active: string;
}

export default withRouter(
  class HeaderBar extends React.Component<
    RouteComponentProps<any>,
    HeaderBarStates
  > {
    public state = {
      active: '/',
    };
    public componentDidMount() {
      this.setState({
        active: this.props.location.pathname.split('/')[1],
      });
    }
    public componentWillReceiveProps(nextProps: any) {
      this.setState({
        active: nextProps.location.pathname.split('/')[1],
      });
    }
    public render() {
      return (
        <Header className="header">
          <Link to="/">
            <img src={logo} className="logo" />
          </Link>
          <Menu
            mode="horizontal"
            className="headerMenu"
            selectedKeys={[this.state.active]}
          >
            <Item key="unit">
              <Link to="/unit">单位</Link>
            </Item>
            <Item key="quest">
              <Link to="/quest">关卡</Link>
            </Item>
            <SubMenu title="其他属性">
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
            <Item key="emoji">
              <Link to="/emoji">机器狗</Link>
            </Item>
          </Menu>
        </Header>
      );
    }
  },
);
