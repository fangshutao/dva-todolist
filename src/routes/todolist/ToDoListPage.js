'use strict';
import React, { useCallback, useEffect, useState, Fragment } from 'react';
import _ from 'lodash';
import { Button, Input, List, Tooltip, Modal, Form } from 'antd';
import {
  FireOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
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
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);

  const [searchParams, setSearchParams] = useState({
    gjz: '',
  });

  const [list, setList] = useState([]);

  useEffect(() => {
    getWaitData();
  }, []);

  const getWaitData = useCallback(async (args) => {
    setLoading(true);
    let params = searchParams;
    if (!_.isEmpty(args)) {
      params = args;
      setSearchParams(args);
    }
    const res = await queryToDoListData(params);
    if (+res.status === 200) {
      const newList = sortData(res.data);
      setList(newList);
      setLoading(false);
    }
  });

  const sortData = (data) => {
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
    const time0Sort = _.sortBy(status0Data, (o) => o.date);
    const time1Sort = _.sortBy(status1Data, (o) => o.date);
    const time2Sort = _.sortBy(status2Data, (o) => o.date);
    return [...time2Sort, ...time1Sort, ...time0Sort];
  };

  const onAddData = useCallback((values) => {
    const nowDate = new Date();
    const args = {
      ...values,
      status: 1,
      id: nowDate.getTime(),
      date: nowDate.getTime(),
    };
    const flag = addToDoListData(args);
    if (flag) {
      getWaitData();
      setShowAddModal(false);
    }
  });

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

  const onPointData = useCallback((id) => {
    const flag = pointToDoListData({ id });
    if (flag) {
      getWaitData();
    }
  });

  const onFinishData = useCallback((id) => {
    const flag = finishToDoListData({ id });
    if (flag) {
      getWaitData();
    }
  });

  const onResetData = useCallback(() => {
    getWaitData({
      gjz: '',
    });
  });

  const onItemChange = useCallback((value, field) => {
    setSearchParams({
      ...searchParams,
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
        <Button type="primary" onClick={() => getWaitData()}>
          查询
        </Button>
        <Button type="primary" onClick={onResetData}>
          重置
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setShowAddModal(true);
          }}
        >
          新增
        </Button>
      </div>
    );
  });

  const renderBody = useCallback(() => {
    return (
      <div className={`${prefixClass}_body`}>
        <List
          className="demo-loadmore-list"
          loading={loading}
          itemLayout="horizontal"
          dataSource={list}
          renderItem={({ id, title, description, status }) => (
            <List.Item
              key={id}
              className={
                status === 0
                  ? `${prefixClass}_item_finished`
                  : status === 2
                  ? `${prefixClass}_item_pointed`
                  : ''
              }
            >
              <div className={`${prefixClass}_item_title`}>
                <Tooltip title={title}>{title}</Tooltip>
              </div>
              <div className={`${prefixClass}_item_description`}>
                <Tooltip title={description}>{description}</Tooltip>
              </div>
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
            </List.Item>
          )}
        />
      </div>
    );
  });

  const renderModal = useCallback(() => {
    return (
      <Modal
        className={`${prefixClass}_modal`}
        title="新增待办事项"
        visible={showAddModal}
        footer={null}
        destroyOnClose={true}
        onCancel={() => setShowAddModal(false)}
      >
        <Form onFinish={onAddData}>
          <Form.Item
            name="title"
            label="标题"
            rules={[
              {
                required: true,
                message: '请输入待办事项标题',
              },
            ]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[
              {
                required: true,
                message: '请输入待办事项标题描述',
              },
            ]}
          >
            <Input.TextArea placeholder="请输入描述" />
          </Form.Item>
          <div className={`${prefixClass}_modal_btn`}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </div>
        </Form>
      </Modal>
    );
  });

  return (
    <div className={`${prefixClass}_container`}>
      {renderHeader()}
      {renderBody()}
      {renderModal()}
    </div>
  );
};

export default Index;
