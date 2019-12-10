import { Layout } from 'antd';
import * as React from 'react';
import { HashRouter } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
// import { ApolloClient } from 'apollo-client';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { onError } from 'apollo-link-error';
// import { ApolloLink } from 'apollo-link';
// import { createUploadLink } from 'apollo-upload-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './App.less';
import UserContext from './context/UserContext';
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
              <Layout className="App" style={{ height: '100%' }}>
                <Router />
              </Layout>
            </UserContext.Provider>
          </ApolloProvider>
        </ConfigProvider>
      </HashRouter>
    );
  }
}

export default App;
