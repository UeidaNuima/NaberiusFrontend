import * as React from 'react';
import { Col, Row, Spin, Icon, Input } from 'antd';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import classNames from 'classnames';
import _ from 'lodash';
import styles from './index.module.less';

interface DescriptionInputProps {
  config?: {
    ID: number;
    Description: string;
  };
  ID: number;
  mutationFunction: string;
  // onIDFilterChange: (filter: number[]) => void;
  // IDFilter: number[];
  active: boolean;
  onToggleFilter: () => void;
}

interface DescriptionInputStates {
  value: string;
  success: boolean;
  error: boolean;
  editing: boolean;
}

export default class DescriptionInput extends React.Component<
  DescriptionInputProps,
  DescriptionInputStates
> {
  public state = {
    value: this.props.config ? this.props.config.Description : '',
    success: false,
    error: false,
    editing: false,
  };

  private ref: HTMLElement | null;
  private update: any;

  private flash = (state: 'success' | 'error') => {
    this.setState({ [state]: true } as any, () => {
      window.setTimeout(() => {
        this.setState({ [state]: false } as any);
      }, 500);
    });
  };

  private enableEdit = () => {
    this.setState({ editing: true });
    document.addEventListener('click', this.outerClick);
  };

  private outerClick = (e: MouseEvent) => {
    if (
      this.ref &&
      !(e.target === this.ref || this.ref.contains(e.target as Node))
    ) {
      this.handleUpdate();
    }
  };

  private handleUpdate = () => {
    this.update({
      variables: {
        ID: this.props.ID,
        Description: this.state.value ? this.state.value : undefined,
      },
    });
    this.setState({ editing: false });
    document.removeEventListener('click', this.outerClick);
  };

  public render() {
    const { ID } = this.props;
    return (
      <Mutation
        key={ID}
        mutation={gql`
          mutation updateDescription(
            $ID: Int!
            $Description: String
          ) {
            ${this.props.mutationFunction} (
              ID: $ID
              Description: $Description
            )
          }
        `}
        onCompleted={this.flash.bind(this, 'success')}
      >
        {(updateDescription, { loading }) => {
          this.update = updateDescription;
          return (
            <Spin spinning={loading}>
              <div
                ref={ref => (this.ref = ref)}
                className={classNames(
                  styles.influenceItem,
                  { [styles.success]: this.state.success },
                  { [styles.error]: this.state.error },
                )}
              >
                <Row type="flex" align="middle">
                  <Col span={6} onClick={this.props.onToggleFilter}>
                    <span
                      className={classNames('label', styles.IDTag, {
                        [styles.active]: this.props.active,
                      })}
                    >
                      {ID}
                    </span>
                  </Col>
                  {this.state.editing ? (
                    <>
                      <Col span={16}>
                        <Input
                          value={this.state.value}
                          className={styles.influenceInput}
                          onChange={e => {
                            this.setState({ value: e.target.value });
                          }}
                          autoFocus
                        />
                      </Col>
                      <Col span={2} className={styles.actionCol}>
                        <Icon
                          type="check-circle"
                          theme="twoTone"
                          onClick={this.handleUpdate}
                        />
                      </Col>
                    </>
                  ) : (
                    <Col
                      span={18}
                      onClick={this.enableEdit}
                      className={styles.valueCol}
                    >
                      {this.state.value}
                    </Col>
                  )}
                </Row>
              </div>
            </Spin>
          );
        }}
      </Mutation>
    );
  }
}
