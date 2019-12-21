import { Layout } from 'antd';
import * as React from 'react';
import { HashRouter } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './App.less';
import UserContext from './context/UserContext';
import MediaContext from './context/MediaContext';
import Router from './Components/Router';
import { API_URL } from './consts';

moment.locale('zh-cn');

const client = new ApolloClient({
  uri: API_URL,
});

class App extends React.Component {
  public render() {
    return (
      <HashRouter>
        <ConfigProvider locale={zhCN}>
          <ApolloProvider client={client}>
            <UserContext.Provider>
              <MediaContext.Provider>
                <Layout className="App" style={{ height: '100%' }}>
                  <Router />
                </Layout>
              </MediaContext.Provider>
            </UserContext.Provider>
          </ApolloProvider>
        </ConfigProvider>
      </HashRouter>
    );
  }
}

export default App;
