'use strict';
/**
 * Created by fangst on 2020/09/29.
 * todolist Demo
 */
import React, { useCallback, useEffect, useState, Fragment } from 'react';
import _ from 'lodash';
import { Input, List, Tooltip, Modal, message } from 'antd';
import {
  FireOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {
  queryToDoListData,
  addToDoListData,
  deleteToDoListData,
  finishToDoListData,
  pointToDoListData,
} from '@/services/example';
import './index.less';

const prefixClass = 'toDoListPage';

const Index = (props) => {
  // 加载状态
  const [loading, setLoading] = useState(false);

  // 查询参数
  const [searchParams, setSearchParams] = useState({
    gjz: '',
  });

  // 新增参数
  const [addParams, setAddParams] = useState({
    title: '',
    description: '',
  });

  // 列表查询结果
  const [list, setList] = useState([]);

  useEffect(() => {
    const autoSearch = _.throttle(getWaitData, 1000);
    autoSearch();
  }, [searchParams.gjz]);

  // 获取数据
  const getWaitData = useCallback(async () => {
    setLoading(true);
    const res = await queryToDoListData(searchParams);
    if (+res.status === 200) {
      const newList = formatData(res.data);
      setList(newList);
      setLoading(false);
    }
  });

  // 格式化数据
  const formatData = useCallback((data) => {
    const status0Data = [];
    const status1Data = [];
    const status2Data = [];
    _.each(data, (item) => {
      switch (item.status) {
        case 0:
          status0Data.push(item);
          break;
        case 1:
          status1Data.push(item);
          break;
        case 2:
          status2Data.push(item);
          break;
        default:
          break;
      }
    });
    const editData = [
      {
        id: 'demo-list-add',
        title: '',
        description: '',
        time: '',
        status: 1,
      },
    ];
    const time0Sort = _.sortBy(status0Data, (o) => o.date);
    const time1Sort = _.sortBy(status1Data, (o) => o.date);
    const time2Sort = _.sortBy(status2Data, (o) => o.date);
    return [...editData, ...time2Sort, ...time1Sort, ...time0Sort];
  });

  // 新增数据
  const onAddData = useCallback(() => {
    if (addParams.title === '' && addParams.description === '') {
      message.warn({
        className: `${prefixClass}_message`,
        content: '请至少填写一项内容',
      });
      return;
    }
    const nowDate = new Date();
    const args = {
      ...addParams,
      status: 1,
      id: nowDate.getTime(),
      date: nowDate.getTime(),
    };
    if (addParams.title === '') {
      args.title = '未命名';
    }
    const flag = addToDoListData(args);
    if (flag) {
      getWaitData();
      setAddParams({
        title: '',
        description: '',
      });
    }
  });

  // 删除数据
  const onDeleteData = useCallback((id) => {
    Modal.confirm({
      title: '确认删除该条待办信息吗？',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const flag = deleteToDoListData({ id });
        if (flag) {
          getWaitData();
        }
      },
      onCancel() {},
    });
  });

  // 标注重要数据
  const onPointData = useCallback((id) => {
    const flag = pointToDoListData({ id });
    if (flag) {
      getWaitData();
    }
  });

  // 完成待办
  const onFinishData = useCallback((id) => {
    const flag = finishToDoListData({ id });
    if (flag) {
      getWaitData();
    }
  });

  // 查询参数改变
  const onItemChange = useCallback((value, field) => {
    setSearchParams({
      ...searchParams,
      [field]: value.trim(),
    });
  });

  // 新增参数改变
  const onAddItemChange = useCallback((value, field) => {
    setAddParams({
      ...addParams,
      [field]: value.trim(),
    });
  });

  const renderHeader = useCallback(() => {
    return (
      <div className={`${prefixClass}_header`}>
        <div>关键字：</div>
        <Input
          value={searchParams.gjz}
          onChange={(e) => onItemChange(e.target.value, 'gjz')}
        />
      </div>
    );
  });

  const renderBtnContainer = useCallback(({ id, status }) => {
    return (
      <div className={`${prefixClass}_item_btn_container`}>
        {status === 0 ? (
          '已完成'
        ) : (
          <Fragment>
            <Tooltip title="完成">
              <CheckCircleOutlined onClick={() => onFinishData(id)} />
            </Tooltip>
            <Tooltip title="重点标注" onClick={() => onPointData(id)}>
              <FireOutlined className={status === 2 ? 'active' : ''} />
            </Tooltip>
            <Tooltip title="删除">
              <DeleteOutlined onClick={() => onDeleteData(id)} />
            </Tooltip>
          </Fragment>
        )}
      </div>
    );
  });

  const renderListItem = useCallback((item) => {
    const { id, title, description } = item;
    return (
      <Fragment key={id}>
        <div className={`${prefixClass}_item_title`}>
          <Tooltip title={title}>{title}</Tooltip>
        </div>
        <div className={`${prefixClass}_item_description`}>
          <Tooltip title={description}>{description}</Tooltip>
        </div>
        {renderBtnContainer(item)}
      </Fragment>
    );
  });

  const renderEditItem = useCallback((item) => {
    const { id } = item;
    return (
      <Fragment key={id}>
        <div className={`${prefixClass}_item_title`}>
          <Input
            value={addParams.title || ''}
            onChange={(e) => onAddItemChange(e.target.value, 'title')}
          />
        </div>
        <div className={`${prefixClass}_item_description`}>
          <Input
            value={addParams.description || ''}
            onChange={(e) => onAddItemChange(e.target.value, 'description')}
          />
        </div>
        <div className={`${prefixClass}_item_btn_container`}>
          <Tooltip title="确认新增">
            <PlusCircleOutlined onClick={() => onAddData(id)} />
          </Tooltip>
        </div>
      </Fragment>
    );
  });

  const renderItemHeader = useCallback(() => {
    return (
      <div className={`${prefixClass}_item_header`}>
        <div className={`${prefixClass}_item_title`}>标题</div>
        <div className={`${prefixClass}_item_description`}>描述</div>
        <div className={`${prefixClass}_item_btn_container`}>操作</div>
      </div>
    );
  });

  const renderBody = useCallback(() => {
    return (
      <div className={`${prefixClass}_body`}>
        {renderItemHeader()}
        <List
          className="demo-loadmore-list"
          loading={loading}
          itemLayout="horizontal"
          dataSource={list}
          renderItem={(item, index) => (
            <List.Item
              key={item.id}
              className={
                item.status === 0
                  ? `${prefixClass}_item_finished`
                  : item.status === 2
                  ? `${prefixClass}_item_pointed`
                  : ''
              }
            >
              {index === 0 ? renderEditItem(item) : renderListItem(item)}
            </List.Item>
          )}
        />
      </div>
    );
  });

  return (
    <div className={`${prefixClass}_container`}>
      {renderHeader()}
      {renderBody()}
    </div>
  );
};

export default Index;
