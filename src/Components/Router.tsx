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
import UnitModal from './Routes/UnitModal';
import QuestList from './Routes/QuestList';
import Quest from './Routes/Quest';
import ClassList from './Routes/ClassList';
import SkillList from './Routes/SkillList';
import AbilityList from './Routes/AbilityList';
import EmojiList from './Routes/EmojiList';

export default withRouter(
  class Router extends React.Component<RouteComponentProps<any>> {
    private previousLocation = this.props.location;
    public componentWillUpdate(nextProps: RouteComponentProps<any>) {
      const { location } = this.props;

      // set previousLocation if props.location is not modal
      if (
        nextProps.history.action !== 'POP' &&
        (!location.state || !location.state.modal)
      ) {
        this.previousLocation = this.props.location;
      }
    }
    public render() {
      const { location } = this.props;

      const isModal = !!(
        location.state &&
        location.state.modal &&
        this.previousLocation !== location
      ); // not initial render

      return (
        <>
          <Switch location={isModal ? this.previousLocation : location}>
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
        </>
      );
    }
  },
);
