// import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
// import ShowModal from '@/pages/Admin/InterfaceInfo/components/ShowModal';
// import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
// import {
//   FooterToolbar,
//   PageContainer,
//   ProDescriptions,
//   ProTable,
// } from '@ant-design/pro-components';
// import { FormattedMessage, useIntl } from '@umijs/max';
// import {Button, Drawer, message, Popconfirm, Tag} from 'antd';
// import React, { useRef, useState } from 'react';
// import {
//   addInterfaceInfoUsingPost,
//   deleteInterfaceInfoUsingPost,
//   listInterfaceInfoByPageUsingGet,
//   offlineInterfaceInfoUsingPost,
//   onlineInterfaceInfoUsingPost,
//   updateInterfaceInfoUsingPost
// } from "@/services/yuanapi-bdckend/interfaceInfoController";
// import {SortOrder} from "antd/lib/table/interface";
// import CreateModal from "@/pages/Admin/ip/components/CreateModal";
// import UpdateModal from "@/pages/Admin/InterfaceInfo/components/UpdateModal";
// import {banIpsUsingPost, listIpsByPageUsingGet, unBanIpsUsingPost} from "@/services/yuanapi-bdckend/ipController";
//
// const TableList: React.FC = () => {
//   /**
//    * @en-US Pop-up window of new window
//    * @zh-CN 新建窗口的弹窗
//    *  */
//   const [createModalOpen, handleModalOpen] = useState<boolean>(false);
//   /**
//    * @en-US The pop-up window of the distribution update window
//    * @zh-CN 分布更新窗口的弹窗
//    * */
//   const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
//   const [showModalOpen, handleShowModalOpen] = useState<boolean>(false);
//
//   const actionRef = useRef<ActionType>();
//   const [currentRow, setCurrentRow] = useState<API.BannedIps>();
//   const [selectedRowsState, setSelectedRows] = useState<API.BannedIps[]>([]);
//
//   /**
//    * @en-US Add node
//    * @zh-CN 添加节点
//    * @param fields
//    */
//   const handleAdd = async (fields: API.BannedIps) => {
//     const hide = message.loading('正在添加');
//     try {
//       await banIpsUsingPost({ ...fields });
//       hide();
//       handleModalOpen(false);
//       // 刷新页面
//       actionRef.current?.reload();
//       return true;
//     } catch (error: any) {
//       hide();
//       message.error('加入黑名单失败,' + error.message);
//       return false;
//     }
//   };
//
//   /**
//    *  Delete node
//    * @zh-CN 删除节点
//    *
//    * @param selectedRows
//    */
//   const handleRemove = async (record: API.BannedIps) => {
//     const hide = message.loading('移除中');
//     if (!record) return true;
//     try {
//       await unBanIpsUsingPost({
//         id: record.id,
//       });
//       hide();
//       message.success('已移除黑名单');
//       actionRef.current?.reload();
//       return true;
//     } catch (error: any) {
//       hide();
//       message.error('移除失败，' + error.message);
//       return false;
//     }
//   };
//
//
//   /**
//    * @en-US International configuration
//    * @zh-CN 国际化配置
//    * */
//   const intl = useIntl();
//
//   const columns: ProColumns<API.BannedIps>[] = [
//     {
//       title: 'id',
//       dataIndex: 'id',
//       valueType: "index"
//     },
//     {
//       title: 'IP',
//       dataIndex: 'ipAddress',
//       valueType: "text",
//       formItemProps:{
//         rules: [{
//           required: true,
//         }],
//         required: true,
//       }
//     },
//     {
//       title: '封禁原因',
//       dataIndex: 'reason',
//       valueType: 'textarea',
//     },
//     {
//       title: '封禁时间',
//       dataIndex: 'bannedAt',
//       valueType: "dateTime",
//       // hideInTable: true,
//       hideInForm: true,
//     },
//     {
//       title: '操作人',
//       dataIndex: 'bannedBy',
//       valueType: 'textarea',
//       render: (_, record) => {
//         return record.bannedBy === 'system' ? (
//           <Tag color="red">system</Tag>
//         ) : (
//           <Tag color="green">admin</Tag>
//         );
//       },
//     },
//     {
//       title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
//       dataIndex: 'option',
//       valueType: 'option',
//       render: (_, record) => {
//         return [
//
//             // <Button
//             //   danger
//             //   key="remove"
//             //   onClick={() => {
//             //     handleRemove(record);
//             //   }}
//             // >
//             //   移除
//             // </Button>,
//
//           // eslint-disable-next-line react/jsx-key
//           <Popconfirm
//             title="你确定要移除这个黑名单ip吗？"
//             onConfirm={() => handleRemove(record)}
//             okText="是"
//             cancelText="否"
//           >
//             <a key="remove">
//               移除
//             </a>
//           </Popconfirm>,
//
//           ]
//       },
//     },
//   ];
//
//
//   return (
//     <PageContainer>
//       <ProTable<API.BannedIps, API.PageParams>
//         headerTitle={'黑名单管理'}
//         actionRef={actionRef}
//         rowKey="key"
//         search={{
//           labelWidth: 120,
//         }}
//         toolBarRender={() => [
//           <Button
//             type="primary"
//             key="primary"
//             onClick={() => {
//               handleModalOpen(true);
//             }}
//           >
//             <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
//           </Button>,
//         ]}
//         request={async (params, sort: Record<string, SortOrder>, filter: Record<string, (string | number)[] | null>) => {
//           const res : any = await listIpsByPageUsingGet({
//             ...params
//           })
//           if (res?.data){
//             return {
//               data: res?.data.records || [],
//               success : true,
//               total: res?.data.total || 0,
//             }
//           }else {
//             return {
//               data: [],
//               success: false,
//               total: 0,
//             };
//           }
//         }}
//         columns={columns}
//         // rowSelection={{
//         //   onChange: (_, selectedRows) => {
//         //     setSelectedRows(selectedRows);
//         //   },
//         // }}
//       />
//
//       {selectedRowsState?.length > 0 && (
//         <FooterToolbar
//           extra={
//             <div>
//               <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
//               <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
//               <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
//               &nbsp;&nbsp;
//             </div>
//           }
//         >
//           <Button
//             onClick={async () => {
//               await handleRemove(selectedRowsState);
//               setSelectedRows([]);
//               actionRef.current?.reloadAndRest?.();
//             }}
//           >
//             <FormattedMessage
//               id="pages.searchTable.batchDeletion"
//               defaultMessage="Batch deletion"
//             />
//           </Button>
//           <Button type="primary">
//             <FormattedMessage
//               id="pages.searchTable.batchApproval"
//               defaultMessage="Batch approval"
//             />
//           </Button>
//         </FooterToolbar>
//       )}
//
//
//       {/*<ShowModal*/}
//       {/*  setVisible={handleShowModalOpen}*/}
//       {/*  values={currentRow ?? {}}*/}
//       {/*  visible={showModalOpen}*/}
//       {/*  requestColumns={requestColumns}*/}
//       {/*  responseColumns={responseColumns}*/}
//       {/*/>*/}
//
//       <CreateModal
//         columns={columns}
//         setVisible={handleModalOpen}
//         onSubmit={(values) => {
//           return handleAdd(values).then((r) => {});
//         }}
//         visible={createModalOpen}
//       />
//
//     </PageContainer>
//   );
// };
//
// export default TableList;
