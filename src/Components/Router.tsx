import React, { useEffect, useRef } from 'react';
import { Layout } from 'antd';
import {
  withRouter,
  Switch,
  Route,
  RouteComponentProps,
  Redirect,
} from 'react-router-dom';
import useRouter from 'use-react-router';
import UserContext from '../context/UserContext';
import Header from './Header';

import Home from './Routes/Home';
import UnitList from './Routes/UnitList';
import Unit from './Routes/Unit';
import UnitModal from './Routes/UnitModal';
import QuestList from './Routes/QuestList';
import Quest from './Routes/Quest';
import ClassList from './Routes/ClassList';
import SkillList from './Routes/SkillList';
import AbilityList from './Routes/AbilityList';
import EmojiList from './Routes/EmojiList';
import Login from './Routes/Login';

const Router: React.FC<RouteComponentProps> = () => {
  const { isLoggedIn } = UserContext.useContainer();
  const { location, history } = useRouter();
  const prevLocationRef = useRef(location);

  useEffect(() => {
    // set previousLocation if props.location is not modal
    if (
      history.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      prevLocationRef.current = location;
    }
  }, [history.action, location]);

  const isModal = !!(
    location.state &&
    location.state.modal &&
    prevLocationRef.current !== location
  ); // not initial render

  console.log(isLoggedIn);

  return !isLoggedIn ? (
    <Switch>
      <Route path="/" exact component={Login} />
      <Redirect to="/" />
    </Switch>
  ) : (
    <Layout>
      <Header />
      <Switch location={isModal ? prevLocationRef.current : location}>
        >
        <Route path="/unit/:CardID" component={Unit} />
        <Route path="/quest/:QuestID" component={Quest} />
        <Route path="/unit" exact component={UnitList} />
        <Route path="/quest" exact component={QuestList} />
        <Route path="/class" exact component={ClassList} />
        <Route path="/skill" exact component={SkillList} />
        <Route path="/ability" exact component={AbilityList} />
        <Route path="/emoji" exact component={EmojiList} />
        <Route component={Home} />
      </Switch>
      {isModal && <Route path="/unit/:CardID" component={UnitModal} />}
    </Layout>
  );
};

export default withRouter(Router);
