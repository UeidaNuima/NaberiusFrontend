import * as React from 'react';
import {
  withRouter,
  Switch,
  Route,
  RouteComponentProps,
} from 'react-router-dom';
import Home from './Routes/Home';
import UnitList from './Routes/UnitList';
import Unit from './Routes/Unit';
import QuestList from './Routes/QuestList';
import Quest from './Routes/Quest';
import ClassList from './Routes/ClassList';
import SkillList from './Routes/SkillList';
import AbilityList from './Routes/AbilityList';
import EmojiList from './Routes/EmojiList';

export default withRouter(
  class Router extends React.Component<RouteComponentProps<any>> {
    public render() {
      return (
        <Switch>
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
      );
    }
  },
);
