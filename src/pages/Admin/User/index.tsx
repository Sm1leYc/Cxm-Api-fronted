import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import {  useIntl } from '@umijs/max';
import { FormattedMessage } from 'umi';
import {Button, Tag, message, Popconfirm} from 'antd';
import React, { useRef, useState } from 'react';
import {SortOrder} from "antd/lib/table/interface";
import {
  banUser,
  deleteUser,
  listUserVoByPage, updateUser
} from "@/services/yuanapi-bdckend/userController";
import UpdateModal from "@/pages/Admin/User/components/UpdateModal";

const TableList: React.FC = () => {

  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.UserVO>();
  const [selectedRowsState, setSelectedRows] = useState<API.BannedIps[]>([]);

  const handleUpdate = async (fields: API.UserUpdateRequest) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('修改中');
    try {
      const response = await updateUser({
        id: currentRow.id,
        ...fields,
      });
      hide();

      // 检查返回结果
      if (response.code === 0) {
          message.success('操作成功'); // 成功提示
      } else {
        message.error('操作失败!' + response.message); // 错误提示
      }
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败!' + error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 移除用户
   *
   * @param selectedRows
   */
  const handleRemove = async (record: API.UserVO) => {
    const hide = message.loading('移除中');
    if (!record) return true;
    try {
      await deleteUser({
        id: record.id,
      });
      hide();
      message.success('已移除该用户');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('移除失败，' + error.message);
      return false;
    }
  };

  /**
   *  Ban or unban user
   * @zh-CN 封禁或解封用户
   *
   * @param record
   */
  const handleBanUser = async (record) => {
    const hide = message.loading(record.status === 0 ? '封禁中' : '解封中');
    if (!record) return true;
    try {
      await banUser({
        userId: record.id,
        status: record.status === 1 ? 0 : 1, // 假设 0 为正常，1 为封禁
      });
      hide();
      message.success(record.status === 0 ? '已解封该用户' : '已封禁该用户');
      actionRef.current?.reload();
      return true;
    } catch (error : any) {
      hide();
      message.error(record.status === 0 ? '封禁失败，' + error.message : '解封失败，' + error.message);
      return false;
    }
  };


  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.UserVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      valueType: "index",
      hideInTable: true
    },
    {
      title: '账号',
      dataIndex: 'userAccount',
      valueType: "text",
      copyable: true,
      ellipsis: true,
    },
    {
      title: '昵称',
      dataIndex: 'userName',
      valueType: "text",
      copyable: true,
      ellipsis: true,
    },
    {
      title: 'accessKey',
      dataIndex: 'accessKey',
      valueType: "text",
      // hideInTable: true
      copyable: true,
      ellipsis: true,
    },
    {
      title: 'secretKey',
      dataIndex: 'secretKey',
      valueType: "text",
      hideInTable: true
      // copyable: true,
      // ellipsis: true,
    },
    {
      title: '头像',
      dataIndex: 'userAvatar',
      valueType: 'text',
      render: (_, record) => (
        <img
          src={record.userAvatar}
          alt="头像"
          style={{ width: 40, height: 40, borderRadius: '50%' }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/path/to/default/avatar.png'; }}
        />
      ),
    },
    {
      title: '角色',
      dataIndex: 'userRole',
      valueType: "textarea",
      render: (_, record) => {
        return record.userRole === 'admin' ? (
          <Tag color="red">admin</Tag>
        ) : (
          <Tag color="green">user</Tag>
        );
      },
    },
    {
      title: '积分',
      dataIndex: 'points',
      valueType: "textarea",
      render: (_, record) => {
        const points = record.points;
        let color = "default";
        let text = "无积分";
        color = "blue";
        text = `${points}`;
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLoginTime',
      valueType: "dateTime",
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
      render: (_, record) => {
        return record.status === 0 ? (
          <Tag color="red">封禁</Tag>
        ) : (
          <Tag color="green">正常</Tag>
        );
      },
    },

    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating"/>,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return record.status === 0
          ? [
            <a
              key="update"
              onClick={() => {
                handleUpdateModalOpen(true);
                setCurrentRow(record);
              }}
            >
              修改
            </a>,
            // eslint-disable-next-line react/jsx-key
            <Popconfirm
              title="你确定要解封这个用户吗？"
              onConfirm={() => handleBanUser(record)}
              okText="是"
              cancelText="否"
            >
              <a key="remove">
                解封
              </a>
            </Popconfirm>,

            // eslint-disable-next-line react/jsx-key
            <Popconfirm
              title="你确定要移除这个用户吗？"
              onConfirm={() => handleRemove(record)}
              okText="是"
              cancelText="否"
            >
              <a key="remove" style={{ color: 'red' }}>
                移除
              </a>
            </Popconfirm>,

          ]
          : [
            <a
              key="update"
              onClick={() => {
                handleUpdateModalOpen(true);
                setCurrentRow(record);
              }}
            >
              修改
            </a>,
            // eslint-disable-next-line react/jsx-key
            <Popconfirm
              title="你确定要封禁这个用户吗？"
              onConfirm={() => handleBanUser(record)}
              okText="是"
              cancelText="否"
            >
              <a key="remove">
                封禁
              </a>
            </Popconfirm>,

            // eslint-disable-next-line react/jsx-key
            <Popconfirm
              title="你确定要移除这个用户吗？"
              onConfirm={() => handleRemove(record)}
              okText="是"
              cancelText="否"
            >
              <a key="remove" style={{ color: 'red' }}>
                移除
              </a>
            </Popconfirm>,

          ];
      },


    },

  ];


  return (
    <PageContainer>

      <ProTable<API.UserVO, API.PageParams>
        headerTitle={'用户管理'}
        actionRef={actionRef}
        rowKey="key"
        search={false}
        toolBarRender={() => [
          // <Button
          //   type="primary"
          //   key="primary"
          //   onClick={() => {
          //     handleModalOpen(true);
          //   }}
          // >
          //   <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          // </Button>,
        ]}
        request={async (params, sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>) => {
          const res : any = await listUserVoByPage({
            ...params
          })
          if (res?.data){
            return {
              data: res?.data.records || [],
              success : true,
              total: res?.data.total || 0,
            }
          }else {
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}

        scroll={{ x: 'max-content' }}
      />

      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            <FormattedMessage
              id="pages.searchTable.batchDeletion"
              defaultMessage="Batch deletion"
            />
          </Button>
          <Button type="primary">
            <FormattedMessage
              id="pages.searchTable.batchApproval"
              defaultMessage="Batch approval"
            />
          </Button>
        </FooterToolbar>
      )}

      <UpdateModal
        columns={columns}
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        setVisible={handleUpdateModalOpen}
        visible={updateModalOpen}
        values={currentRow ?? {}}
      />

    </PageContainer>
  );
};

export default TableList;
