import React, { useState, useRef } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { Button, Tag,Select, message, Popconfirm } from 'antd';
import {
  deleteFeedback,
  listFeedbackByPage,
  updateFeedback
} from '@/services/yuanapi-bdckend/feedbackController'; // 替换为实际服务的导入路径

const FeedbackManagement = () => {
  // const [drawerVisible, setDrawerVisible] = useState(false);
  // const [selectedFeedback, setSelectedFeedback] = useState(null);
  const actionRef = useRef();

  const handleStatusChange = async (value, record) => {
    try {
      const response = await updateFeedback({
        id: record.id,
        feedbackStatusEnum: value,
      });
      if (response.code === 0) {
        message.success('Status updated successfully');
        actionRef.current?.reload();
      } else {
        message.error('Failed to update status');
      }
    } catch (error) {
      message.error('Error updating status');
    }
  };

  const handleDeleteFeedback = async (id) => {
    try {
      const response = await deleteFeedback({ id });
      if (response.code === 0) {
        message.success('Feedback deleted successfully');
        actionRef.current?.reload();
      }
    } catch (error) {
      message.error('Error deleting feedback');
    }
  };


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      hideInTable: true,
    },
    {
      title: '提交账号',
      dataIndex: 'userAccount',
      key: 'userAccount',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '反馈类型',
      dataIndex: 'feedbackType',
      key: 'feedbackType',
      render: (text) => {
        let color;
        switch (text) {
          case 'suggestion':
            color = 'blue';
            break;
          case 'bug':
            color = 'green';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '反馈内容',
      dataIndex: 'feedbackContent',
      key: 'feedbackContent',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '联系方式',
      dataIndex: 'contact',
      key: 'contact',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '反馈时间',
      dataIndex: 'createTime',
      key: 'createTime',
      valueType: "dateTime",
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <Select
          value={text}
          onChange={(value) => handleStatusChange(value, record)}
          style={{ width: 120 }}
        >
          <Select.Option value="PENDING">未处理</Select.Option>
          <Select.Option value="IN_PROGRESS">处理中</Select.Option>
          <Select.Option value="RESOLVED">已处理</Select.Option>
          <Select.Option value="IGNORED">忽略</Select.Option>
        </Select>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div>
          {/*<Button*/}
          {/*  type="link"*/}
          {/*  onClick={() => handleViewDetails(record.id)}*/}
          {/*>*/}
          {/*  详情*/}
          {/*</Button>*/}
          <Popconfirm
            title="Are you sure to delete this feedback?"
            onConfirm={() => handleDeleteFeedback(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];


  return (
    <div>
      <ProTable
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const response = await listFeedbackByPage({
            current: params.current,
            pageSize: params.pageSize,
          });
          return {
            data: response.data?.records,
            success: response.code === 0,
            total: response.data?.total,
          };
        }}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
        }}
        search={false}
        dateFormatter="string"
        headerTitle="反馈管理"
        scroll={{ x: 'max-content' }}
      />

      {/*<Drawer*/}
      {/*  title="反馈详情"*/}
      {/*  width={window.innerWidth * 0.8}*/}
      {/*  onClose={() => setDrawerVisible(false)}*/}
      {/*  visible={drawerVisible}*/}
      {/*  bodyStyle={{ paddingBottom: 80 }}*/}
      {/*>*/}
      {/*  {selectedFeedback && (*/}
      {/*    <Descriptions title="基础详情" bordered>*/}
      {/*      <Descriptions.Item label="反馈ID">{selectedFeedback.id}</Descriptions.Item>*/}
      {/*      <Descriptions.Item label="用户名">{selectedFeedback.userName}</Descriptions.Item>*/}
      {/*      <Descriptions.Item label="用户邮箱">{selectedFeedback.email}</Descriptions.Item>*/}
      {/*      <Descriptions.Item label="反馈问题">{selectedFeedback.problem}</Descriptions.Item>*/}
      {/*      <Descriptions.Item label="建议">{selectedFeedback.suggestion}</Descriptions.Item>*/}
      {/*      <Descriptions.Item label="状态">*/}
      {/*        <Tag color={selectedFeedback.status === 'RESOLVED' ? 'green' : 'orange'}>*/}
      {/*          {selectedFeedback.status}*/}
      {/*        </Tag>*/}
      {/*      </Descriptions.Item>*/}
      {/*      <Descriptions.Item label="创建时间">{selectedFeedback.createTime}</Descriptions.Item>*/}
      {/*    </Descriptions>*/}
      {/*  )}*/}
      {/*</Drawer>*/}
    </div>
  );
};

export default FeedbackManagement;
