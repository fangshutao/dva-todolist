'use strict';
/**
 * Created by fangst on 2020/09/30.
 * todolist 编辑模态框
 */
import React, { useEffect, useCallback } from 'react';
import { Input, Modal, Button, Form, message } from 'antd';
import _ from 'lodash';

const prefixClass = 'toDoListPage_modal';

const Index = (props) => {
  const { modalStatus, modalDisplay, onFinish } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (!_.isEmpty(modalStatus.item)) {
      form.setFieldsValue({
        title: modalStatus.item.title,
        description: modalStatus.item.description,
      });
    }
  }, [props.modalStatus.item]);

  const onSubmit = useCallback((values) => {
    if (values.title === '' && values.description === '') {
      message.warn({
        className: `${prefixClass}_message`,
        content: '请至少填写一项内容',
      });
      return;
    }
    onFinish({
      ...values,
      id: modalStatus.item.id,
    });
    modalDisplay({ show: false, item: null });
  });

  return (
    <Modal
      className={`${prefixClass}_container`}
      title="编辑待办事项"
      visible={modalStatus.show}
      footer={null}
      destroyOnClose={true}
      onCancel={() => modalDisplay({ show: false, item: null })}
    >
      <Form form={form} onFinish={onSubmit}>
        <Form.Item name="title" label="标题">
          <Input placeholder="请输入标题" />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea placeholder="请输入描述" />
        </Form.Item>
        <div className={`${prefixClass}_btn`}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default Index;
