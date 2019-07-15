import React from 'react';
import { Layout, Input, Form, Button, Icon } from 'antd';
import useForm from 'rc-form-hooks';
import UserContext from '../../../context/UserContext';
import styles from './Login.module.less';

const { Content } = Layout;

const Login: React.FC = () => {
  const { getFieldDecorator, validateFields } = useForm<{ token: string }>();
  const { login } = UserContext.useContainer();
  const handleLogin = async () => {
    const values = await validateFields();
    console.log(login);
    login(values.token);
  };
  return (
    <Content>
      <Form className={styles.loginForm}>
        <Form.Item>
          {getFieldDecorator('token')(
            <Input
              type="password"
              prefix={
                <Icon
                  onClick={handleLogin}
                  style={{ cursor: 'default' }}
                  type="lock"
                />
              }
            />,
          )}
        </Form.Item>
        <Button type="primary" block>
          登录
        </Button>
      </Form>
    </Content>
  );
};

export default Login;
