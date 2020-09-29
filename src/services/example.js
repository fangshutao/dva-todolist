import axios from 'axios';
import _ from 'lodash';

export const queryToDoListData = async (params) => {
  const oldItems = localStorage.getItem('todolist');
  const res = await axios.get('/server/getIninTodoList');
  if (oldItems) {
    const temp = JSON.parse(oldItems);
    let filterData = [];
    if (params) {
      filterData = _.filter(temp, ({ title, description }) => {
        return (
          title.indexOf(params.gjz) !== -1 ||
          description.indexOf(params.gjz) !== -1
        );
      });
    }
    res.data = filterData;
  } else {
    res.data = [];
  }
  return res;
};

export const addToDoListData = (item) => {
  const oldItems = localStorage.getItem('todolist');
  let newItems = [];
  if (oldItems) {
    newItems = [...JSON.parse(oldItems), item];
  } else {
    newItems = [item];
  }
  localStorage.setItem('todolist', JSON.stringify(newItems));
  return true;
};

export const deleteToDoListData = ({ id: deleteId }) => {
  const oldItems = JSON.parse(localStorage.getItem('todolist'));
  const newItems = _.filter(oldItems, ({ id }) => id !== deleteId);
  localStorage.setItem('todolist', JSON.stringify(newItems));
  return true;
};

export const finishToDoListData = ({ id }) => {
  const oldItems = JSON.parse(localStorage.getItem('todolist'));
  _.each(oldItems, (item) => {
    if (item.id === id) {
      item.status = 0;
      return false;
    }
    return true;
  });
  localStorage.setItem('todolist', JSON.stringify(oldItems));
  return true;
};

export const pointToDoListData = ({ id }) => {
  const oldItems = JSON.parse(localStorage.getItem('todolist'));
  _.each(oldItems, (item) => {
    if (item.id === id) {
      item.status = item.status === 1 ? 2 : 1;
      return false;
    }
    return true;
  });
  localStorage.setItem('todolist', JSON.stringify(oldItems));
  return true;
};
