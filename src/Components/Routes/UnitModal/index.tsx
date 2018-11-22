import * as React from 'react';
import { Modal } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import Unit from '../Unit';

interface UnitModalStates {
  visible: boolean;
}

class UnitModal extends React.Component<
  RouteComponentProps<{ CardID: string }>,
  UnitModalStates
> {
  public state = {
    visible: true,
  };

  private handleCancel = () => {
    this.setState(
      {
        visible: false,
      },
      () => {
        setTimeout(() => {
          this.props.history.goBack();
        }, 500);
      },
    );
  };
  public render() {
    const { history, location, match } = this.props;
    return (
      <Modal
        footer={null}
        width="90%"
        visible={this.state.visible}
        onCancel={this.handleCancel}
      >
        <Unit history={history} location={location} match={match} />
      </Modal>
    );
  }
}

export default UnitModal;
