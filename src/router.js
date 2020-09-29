import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import ToDoListPage from './routes/todolist/ToDoListPage';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={ToDoListPage} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
