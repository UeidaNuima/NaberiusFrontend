import { Layout } from 'antd';
import * as React from 'react';
import { HashRouter } from 'react-router-dom';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloProvider } from 'react-apollo';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './App.less';
import Header from './Components/Header';
import Router from './Components/Router';
import { API_URL } from './consts';

moment.locale('zh-cn');

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ),
        );
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    createUploadLink({
      uri: API_URL,
      credentials: 'same-origin',
    }),
  ]),
  cache: new InMemoryCache(),
});

class App extends React.Component {
  public render() {
    return (
      <HashRouter>
        <LocaleProvider locale={zhCN}>
          <ApolloProvider client={client}>
            <Layout className="App" style={{ height: '100%' }}>
              <Header />
              <Layout style={{ height: '100%', overflow: 'auto' }}>
                <Router />
              </Layout>
            </Layout>
          </ApolloProvider>
        </LocaleProvider>
      </HashRouter>
    );
  }
}

export default App;
