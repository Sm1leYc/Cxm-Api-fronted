import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import {Button, message, Popconfirm, Tag} from 'antd';
import React, { useRef, useState } from 'react';
import {
  addInterfaceInfo,
  deleteInterfaceInfo,
  listInterfaceInfoAdmin,
  offlineInterfaceInfo,
  onlineInterfaceInfo,
  updateInterfaceInfo
} from "@/services/yuanapi-bdckend/interfaceInfoController";
import {SortOrder} from "antd/lib/table/interface";
import CreateModal from "@/pages/Admin/InterfaceInfo/components/CreateModal";
import UpdateModal from "@/pages/Admin/InterfaceInfo/components/UpdateModal";
import {history} from "@umijs/max";

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfoVO>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfaceInfo[]>([]);

  /**
   *
   * 添加接口
   */
  const handleAdd = async (fields: API.InterfaceInfoVO) => {
    const hide = message.loading('正在添加');
    try {
      await addInterfaceInfo({ ...fields });
      hide();
      message.success('接口创建成功');
      handleModalOpen(false);
      // 刷新页面
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('接口创建失败,' + error.message);
      return false;
    }
  };

  /**
   *
   * 更新接口
   */
  const handleUpdate = async (fields: API.InterfaceInfoVO) => {
    if (!currentRow) {
      return;
    }
    const hide = message.loading('修改中');
    try {
      const response = await updateInterfaceInfo({
        id: currentRow.id,
        ...fields,
      });
      hide();

      // 检查返回结果
      if (response.code === 0) {
        if (response.message !== "ok") {
          message.warning(response.message); // 提示自定义消息
        } else {
          message.success('操作成功'); // 成功提示
        }
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
   *
   * 删除接口
   */
  const handleRemove = async (record: API.InterfaceInfoVO) => {
    const hide = message.loading('正在删除');
    if (!record) return true;
    try {
      await deleteInterfaceInfo({
        id: record.id,
      });
      hide();
      message.success('删除成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  /**
   *
   *  发布接口
   */
  const handleOnline = async (record: API.InterfaceInfoInvokeRequest) => {
    const hide = message.loading('发布中');
    if (!record) return true;
    try {
      await onlineInterfaceInfo({
        host: record.host,
        id: record.id,
        method: record.method,
      });
      hide();
      message.success('操作成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return false;
    }
  };

  /**
   *
   *  下线接口
   */
  const handleOffine = async (record: API.IdRequest) => {
    const hide = message.loading('下线中');
    if (!record) return true;
    try {
      await offlineInterfaceInfo({
        id: record.id,
      });
      hide();
      message.success('操作成功');
      actionRef.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('操作失败，' + error.message);
      return false;
    }
  };

  const apiLink = '/interface/';
  const columns: ProColumns<API.InterfaceInfoVO>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true,
      valueType: "index"
    },
    {
      title: '接口名称',
      dataIndex: 'name',
      valueType: "text",
      formItemProps:{
        rules: [{
          required: true,
        }],
        required: true,
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
      hideInTable: true,
      // ellipsis: true,
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      render: (text) => {
        let color;
        switch (text) {
          case 'POST':
            color = 'green';
            break;
          case 'PUT':
            color = 'orange';
            break;
          case 'DELETE':
            color = 'red';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '接口类型',
      dataIndex: 'type',
      hideInTable: true,
      // render: (text) => {
      //   let color;
      //   switch (text) {
      //     case 'http':
      //       color = 'blue';
      //       break;
      //     case 'soap':
      //       color = 'green';
      //       break;
      //     default:
      //       color = 'default';
      //   }
      //   return <Tag color={color}>{text}</Tag>;
      // },
      // valueType: "select",
      // valueEnum: {
      //   HTTP : { text: 'HTTP' },
      //   SOAP : { text: 'SOAP' },
      // },
    },
    // {
    //   title: '请求参数',
    //   dataIndex: 'requestParams',
    //   hideInTable: true,
    //   valueType: "jsonCode",
    // },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      hideInTable: true,
      valueType: "jsonCode",
    },
    {
      title: '响应头',
      dataIndex: 'responseHeader',
      hideInTable: true,
      valueType: "jsonCode",
    },
    {
      title: '返回结果示例',
      dataIndex: 'responseExample',
      hideInTable: true,
      valueType: "jsonCode",
    },
    {
      title: 'path',
      dataIndex: 'url',
      valueType: "text",
      render: (text) => {
        return <Tag color={"gold"}>{text}</Tag>;
      },
    },
    {
      title: '接口文档URL',
      dataIndex: 'documentationUrl',
      valueType: "text",
      hideInTable: true,
    },
    {
      title: '请求类型',
      dataIndex: 'type',
      valueType: "text",
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'webserviceUrl',
      dataIndex: 'webserviceUrl',
      valueType: "text",
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'webserviceMethod',
      dataIndex: 'webserviceMethod',
      valueType: "text",
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'SDK调用对象',
      dataIndex: 'request',
      valueType: "text",
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'SDK client',
      dataIndex: 'client',
      valueType: "text",
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'SDK client调用方法',
      dataIndex: 'clientMethod',
      valueType: "text",
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: '主机名',
      dataIndex: 'host',
      valueType: 'text',
      hideInTable: true,
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: '所需积分',
      dataIndex: 'requiredPoints',
      valueType: "text",
      hideInSearch: true,
      render: (text) => {
        return <Tag color={'geekblue'}>{text}</Tag>;
      },
    },
    {
      title: '接口状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: (
            <FormattedMessage
              id="pages.searchTable.nameStatus.default"
              defaultMessage="Shut down"
            />
          ),
          status: 'Default',
        },
        1: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.running" defaultMessage="Running" />
          ),
          status: 'Processing',
        },
        2: {
          text: '测试', // 直接使用文本字符串
          status: 'Warning',
        },

      },
    },

    {
      title: '缓存有效时间（秒）',
      dataIndex: 'cacheDuration',
      render: (text) => {
        return (
          <Tag color={'orange'}>
            {text === -1 ? '永久' : `${text}`}
          </Tag>
        );
      },
    },
    {
      title: '缓存状态',
      dataIndex: 'cacheEnabled',
      hideInForm: true,
      render: (value) => {
        return value ? (
          <Tag color="green">开启</Tag>
        ) : (
          <Tag color="red">关闭</Tag>
        );
      },
    },

    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: "dateTime",
      hideInForm: true,
      hideInTable: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: "dateTime",
      hideInTable: true,
      hideInForm: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return record.status === 0
          ? [
            <a
              key={record.id}
              onClick={() => history.push(`${apiLink}${record.id}`)}
              style={{ cursor: 'pointer', color: 'blue' }}
            >
              详情
            </a>,
            <a
              key="update"
              onClick={() => {
                handleUpdateModalOpen(true);
                setCurrentRow(record);
              }}
            >
              修改
            </a>,
            <a
              key="online"
              onClick={() => {
                handleOnline(record);
              }}
            >
              发布
            </a>,
            <Popconfirm
              title="删除数据"
              key="remove"
              description="确认删除该数据吗？"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => {
                handleRemove(record);
              }}
            >
              <a key="remove" style={{ color: 'red' }}>
                删除
              </a>
            </Popconfirm>,
          ]
          : [
            <a
              key={record.id}
              onClick={() => history.push(`${apiLink}${record.id}`)}
              style={{ cursor: 'pointer', color: 'blue' }}
            >
              详情
            </a>,
            <a
              key="update"
              onClick={() => {
                handleUpdateModalOpen(true);
                setCurrentRow(record);
              }}
            >
              修改
            </a>,
            <a
              key="online"
              onClick={() => {
                handleOffine(record);
              }}
            >
              下线
            </a>,
            <Popconfirm
              title="删除数据"
              key="remove"
              description="确认删除该数据吗？"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => {
                handleRemove(record);
              }}
            >
              <a key="remove" style={{ color: 'red' }}>
                删除
              </a>
            </Popconfirm>

          ];
      },
    },
  ];

  const requestColumns: ProColumns<API.RequestParamsRemarkVO>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '必填',
      key: 'isRequired',
      dataIndex: 'isRequired',
      valueType: 'select',
      valueEnum: {
        yes: {
          text: '是',
        },
        no: {
          text: '否',
        },
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '说明',
      dataIndex: 'remark',
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
    },
    {
      title: '操作',
      valueType: 'option',
      render: () => {
        return null;
      },
    },
  ];
  const responseColumns: ProColumns<API.RequestParamsRemarkVO>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
    },
    {
      title: '说明',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      valueType: 'option',
      render: () => {
        return null;
      },
    },
  ];

  return (
    <PageContainer>

      <ProTable<API.InterfaceInfoVO, API.PageParams>
        headerTitle={'接口管理'}
        actionRef={actionRef}
        rowKey="key"
        search={false}  // 禁用搜索框
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={async (params, sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>) => {
          const res : any = await listInterfaceInfoAdmin({
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
              // Handle each selected row individually
              for (const record of selectedRowsState) {
                await handleRemove(record as API.InterfaceInfoVO);
              }
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
        requestColumns={requestColumns}
        responseColumns={responseColumns}
      />

      <CreateModal
        columns={columns}
        setVisible={handleModalOpen}
        onSubmit={(values) => {
          return handleAdd(values).then((r) => {});
        }}
        visible={createModalOpen}
        requestColumns={requestColumns}
        responseColumns={responseColumns}
      />

    </PageContainer>
  );
};

export default TableList;
