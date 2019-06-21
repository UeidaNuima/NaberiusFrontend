import * as React from 'react';
import {
  Layout,
  Row,
  Col,
  Spin,
  Icon,
  Popconfirm,
  Drawer,
  Tag,
  Modal,
} from 'antd';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import classNames from 'classnames';
import styles from './index.module.less';
import { EMOJI_URL } from '../../../consts';

const { Content } = Layout;

interface Data {
  emojis: Array<{
    _id: string;
    emoji: string;
    name: string;
    group: number[];
  }>;
}

interface EmojiListStates {
  drawerVisible: boolean;
  currentEmoji: {
    _id: string;
    name: string[];
    emoji: string[];
    group: number[];
  };
  modalVisible: boolean;
  currentImage: string;
}
export default class EmojiList extends React.Component<any, EmojiListStates> {
  public state: EmojiListStates = {
    drawerVisible: false,
    currentEmoji: {
      _id: '',
      name: [],
      emoji: [],
      group: [],
    },
    modalVisible: false,
    currentImage: '',
  };

  public isImg = (img: string) => {
    const [, ext] = img.split('.');
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].indexOf(ext) !== -1) {
      return true;
    }
    return false;
  };

  public render() {
    return (
      <Query<Data>
        query={gql`
          query {
            emojis {
              _id
              emoji
              name
              group
            }
          }
        `}
      >
        {({ loading, error, data, refetch }) => (
          <Content className="container">
            <Spin spinning={loading}>
              <Row className="sorter-block">
                <Col span={2}>#</Col>
                <Col span={7}>名称</Col>
                <Col span={9}>存在的群</Col>
                <Col span={6}>数量</Col>
              </Row>
            </Spin>
            {data &&
              data.emojis &&
              data.emojis.map((emoji: any, index: number) => (
                <Row
                  className="list-card"
                  key={emoji._id}
                  onClick={() => {
                    this.setState({ drawerVisible: true, currentEmoji: emoji });
                  }}
                >
                  <Col span={2}>{index + 1}</Col>
                  <Col span={7} className="important">
                    {emoji.name.join(', ')}
                  </Col>
                  <Col span={9}>{emoji.group.join(', ')}</Col>
                  <Col span={6}>{emoji.emoji && emoji.emoji.length}</Col>
                  <div
                    className={classNames(
                      'list-card-addon',
                      styles.deleteIconContainer,
                    )}
                    onClick={e => {
                      e.stopPropagation();
                    }}
                  >
                    <Mutation
                      mutation={gql`
                        mutation removeEmoji($ID: String!) {
                          removeEmoji(ID: $ID)
                        }
                      `}
                    >
                      {(removeEmoji: any, { data }: any) => (
                        <Popconfirm
                          title="是否要删除这个emoji？"
                          onConfirm={() => {
                            removeEmoji({
                              variables: {
                                ID: emoji._id,
                              },
                            }).then(() => {
                              refetch();
                            });
                          }}
                        >
                          <Icon
                            className={styles.deleteIcon}
                            type="delete"
                            theme="outlined"
                          />
                        </Popconfirm>
                      )}
                    </Mutation>
                  </div>
                </Row>
              ))}
            <Drawer
              width={'70%'}
              className={styles.emojiDrawer}
              title="emojij详情"
              onClose={() => this.setState({ drawerVisible: false })}
              visible={this.state.drawerVisible}
            >
              <div style={{ marginBottom: 10 }}>
                <span className="label">名称:</span>
                {this.state.currentEmoji.name.map(name => (
                  <Tag key={name} color="blue">
                    {name}
                  </Tag>
                ))}
              </div>
              <div style={{ marginBottom: 10 }}>
                <span className="label">分组:</span>
                {this.state.currentEmoji.group.map(group => (
                  <Tag key={group} color="blue">
                    {group}
                  </Tag>
                ))}
              </div>
              <div className={styles.imageContainer}>
                {this.state.currentEmoji.emoji.map(
                  (emoji: any, index: number) => {
                    return (
                      <div key={emoji} className={styles.imageBox}>
                        <div className={styles.imageCover}>
                          <div className={styles.imageActionContainer}>
                            <Icon
                              className={styles.imageAction}
                              type="eye"
                              theme="outlined"
                              onClick={() => {
                                this.setState({
                                  modalVisible: true,
                                  currentImage: emoji,
                                });
                              }}
                            />
                            <Mutation
                              mutation={gql`
                                mutation removeEmojiItem(
                                  $ID: String!
                                  $index: Int!
                                ) {
                                  removeEmojiItem(ID: $ID, index: $index)
                                }
                              `}
                            >
                              {(removeEmojiItem: any) => {
                                return (
                                  <Popconfirm
                                    title="是否要删除这个emoji？"
                                    onConfirm={() => {
                                      removeEmojiItem({
                                        variables: {
                                          ID: this.state.currentEmoji._id,
                                          index,
                                        },
                                      }).then((data: any) => {
                                        if (data && data.data.removeEmojiItem) {
                                          refetch();
                                          this.setState(({ currentEmoji }) => ({
                                            currentEmoji: {
                                              ...currentEmoji,
                                              emoji: [
                                                ...currentEmoji.emoji.slice(
                                                  0,
                                                  index,
                                                ),
                                                ...currentEmoji.emoji.slice(
                                                  index + 1,
                                                ),
                                              ],
                                            },
                                          }));
                                        }
                                      });
                                    }}
                                  >
                                    <Icon
                                      className={styles.imageAction}
                                      type="delete"
                                      theme="outlined"
                                    />
                                  </Popconfirm>
                                );
                              }}
                            </Mutation>
                          </div>
                        </div>
                        {this.isImg(emoji) ? (
                          <img alt={emoji} src={`${EMOJI_URL}/${emoji}`} />
                        ) : (
                          <span>{emoji}</span>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            </Drawer>
            <Modal
              onCancel={() => this.setState({ modalVisible: false })}
              visible={this.state.modalVisible}
              footer={null}
              style={{ textAlign: 'center' }}
            >
              {this.isImg(this.state.currentImage) ? (
                <img
                  alt={this.state.currentImage}
                  src={`${EMOJI_URL}/${this.state.currentImage}`}
                />
              ) : (
                <span>{this.state.currentImage}</span>
              )}
            </Modal>
          </Content>
        )}
      </Query>
    );
  }
}
