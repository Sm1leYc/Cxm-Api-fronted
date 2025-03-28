import {
  DrawerForm,
  ProColumns,
  ProFormInstance,
  ProFormText,
  ProFormSelect,
  ProFormSwitch, ProFormTextArea
} from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-table';
import '@umijs/max';
import { Form, Input } from 'antd';
import React, {useEffect, useRef, useState} from 'react';

export type Props = {
  columns: ProColumns<API.InterfaceInfoVO>[];
  // onCancel: () => void;
  onSubmit: (values : API.InterfaceInfoVO) => Promise<void>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  requestColumns: ProColumns<API.RequestParamsRemarkVO>[];
  responseColumns: ProColumns<API.RequestParamsRemarkVO>[];
};

const CreateModal: React.FC<Props> = (props) => {

  const { visible, setVisible, onSubmit, requestColumns, responseColumns } = props;
  const formRef = useRef<ProFormInstance>();

  // @ts-ignore
  const [requestEditableKeys, setRequestEditableKeys] = useState<React.Key[]>(() => []);
  const [requestDataSource, setRequestDataSource] = useState<
    readonly API.RequestParamsRemarkVO[]
  >([]);

  // @ts-ignore
  const [responseEditableKeys, setResponseEditableKeys] = useState<React.Key[]>(() => []);
  const [responseDataSource, setResponseDataSource] = useState<
    readonly API.ResponseParamsRemarkVO[]
  >([]);
  const [durationUnit, setDurationUnit] = useState<'秒' | '分钟' | '小时' | '天'| '永久'>('秒');

  const handleSubmit = async (value: API.InterfaceInfoVO) => {
    // 获取缓存持续时间和选择的单位
    const cacheDuration = parseInt(value.cacheDuration, 10);
    let durationInSeconds = cacheDuration;

    // 判断是否选择了“永久”
    if (durationUnit === '永久') {
      durationInSeconds = -1; // 设置为永久的特殊值
    } else {
      // 根据选择的单位将缓存持续时间转换为秒
      switch (durationUnit) {
        case '分钟':
          durationInSeconds = cacheDuration * 60;
          break;
        case '小时':
          durationInSeconds = cacheDuration * 3600;
          break;
        case '天':
          durationInSeconds = cacheDuration * 86400;
          break;
        default:
          break;
      }
    }

    // 将转换后的时间赋值给 value 传给后端
    value.cacheDuration = durationInSeconds;

    // 提交数据
    await onSubmit?.(value);
  };

  return (
    <DrawerForm<API.InterfaceInfoVO>
      onFinish={handleSubmit}
      formRef={formRef}
      formKey="update-modal-form"
      autoFocusFirstInput
      onOpenChange={setVisible}
      title="新增接口"
      open={visible}
      drawerProps={{
        bodyStyle: { paddingBottom: 80 },
        width: window.innerWidth < 768 ? '100%' : '60%', // 修改点：根据屏幕宽度设置DrawerForm宽度
      }}
    >
      <ProFormText
        name="name"
        label="接口名称"
        rules={[{ required: true, message: '接口名称不可为空！' }]}
      />

      <ProFormText
        name="description"
        label="描述"
        rules={[{ required: true, message: '描述不可为空！' }]}
      />
      <ProFormSelect
        name="remarkType"
        label="备注类型"
        options={[
          // { label: 'success', value: 'success' },
          { label: 'info', value: 'info' },
          { label: 'warning', value: 'warning' },
          { label: 'error', value: 'error' },
        ]}
      />
      <ProFormText
        name="remarkContent"
        label="备注内容"
      />
      <ProFormSelect
        name="status"
        label="接口状态"
        options={[
          { label: '上线', value: 1 },
          { label: '下线', value: 0 },
          { label: '测试', value: 2 },
        ]}
        rules={[{ required: true, message: '请选择接口状态！' }]}
      />
      <ProFormSelect
        name="type"
        label="请求类型"
        rules={[{ required: true, message: '请求类型不可为空！' }]}
        options={[
          { label: 'HTTP', value: 'http' },
          { label: 'SOAP', value: 'soap' }
        ]}
      />
      <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.type !== curValues.type}>
        {({ getFieldValue }) => {
          const type = getFieldValue('type');
          if (type === 'http') {
            return (
              <>
                <ProFormText
                  name="method"
                  label="请求方法"
                  rules={[{ required: true, message: '请求方法不可为空！' }]}
                />
                <ProFormText
                  name="host"
                  label="主机名"
                  rules={[{ required: true, message: '主机名不可为空！' }]}
                />
                <ProFormText
                  name="url"
                  label="接口地址"
                  rules={[{ required: true, message: '接口地址不可为空！' }]}
                />
                <ProFormText
                  name="documentationUrl"
                  label="接口文档地址"
                  rules={[{ required: true, message: '接口文档地址不可为空！' }]}
                />
                <ProFormText
                  name="request"
                  label="SDK请求对象"
                  rules={[{ required: true, message: 'SDK请求对象不可为空！' }]}
                />
                <ProFormText
                  name="client"
                  label="SDK client对象"
                  rules={[{ required: true, message: 'SDK client对象不可为空！' }]}
                />
                <ProFormText
                  name="clientMethod"
                  label="SDK client调用方法"
                  rules={[{ required: true, message: 'SDK client调用方法不可为空！' }]}
                />
              </>
            );
          }
          if (type === 'soap') {
            return (
              <>
                <ProFormText
                  name="webserviceUrl"
                  label="webserviceUrl"
                />
                <ProFormText
                  name="webserviceMethod"
                  label="webserviceMethod"
                />
              </>
            );
          }
          return null;
        }}
      </Form.Item>
      <ProFormText
        name="requiredPoints"
        label="所需积分"
        rules={[{ required: true, message: '所需积分不可为空！' }]}
      />

      <Form.Item name="requestParamsRemark" label="请求参数说明">
        <EditableProTable<API.RequestParamsRemarkVO>
          rowKey="id"
          toolBarRender={false}
          columns={requestColumns}
          value={requestDataSource}
          onChange={setRequestDataSource}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            position: 'bottom',
            record: () => ({
              id: Date.now(),
              isRequired: 'no',
              type: 'string',
            }),
          }}
          editable={{
            type: 'multiple',
            editableKeys: requestEditableKeys,
            onChange: setRequestEditableKeys,
            actionRender: (row, _, dom) => {
              return [dom.delete];
            },
            onValuesChange: (record, recordList) => {
              setRequestDataSource(recordList);
              formRef.current?.setFieldsValue({
                requestParamsRemark: recordList,
              });
            },
          }}
        />
      </Form.Item>

      <Form.Item name="responseParamsRemark" label="响应参数说明">
        <EditableProTable<API.ResponseParamsRemarkVO>
          rowKey="id"
          toolBarRender={false}
          columns={responseColumns}
          value={responseDataSource}
          onChange={setResponseDataSource}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            position: 'bottom',
            record: () => ({
              id: Date.now(),
              type: 'string',
            }),
          }}
          editable={{
            type: 'multiple',
            editableKeys: responseEditableKeys,
            onChange: setResponseEditableKeys,
            actionRender: (row, _, dom) => {
              return [dom.delete];
            },
            onValuesChange: (record, recordList) => {
              setResponseDataSource(recordList);
              formRef.current?.setFieldsValue({
                responseParamsRemark: recordList,
              });
            },
          }}
        />
      </Form.Item>

      <ProFormTextArea
        name="responseExample"
        label="返回结果示例"
      />

      <ProFormSwitch
        name="cacheEnabled"
        label="是否开启缓存"
        checkedChildren="开启"
        unCheckedChildren="关闭"
      />
      {/* 修改 cacheEnabled 为开关组件 */}
      <ProFormText
        name="cacheDuration"
        label="缓存持续时间"
        rules={[
          { required: durationUnit !== '永久', message: '缓存持续时间不可为空，除非选择永久！' },
        ]}
        disabled={durationUnit === '永久'} // 如果选择了永久，禁用输入
      />
      {/* 添加 ProFormSelect 来选择时间单位 */}
      <ProFormSelect
        name="durationUnit"
        label="时间单位"
        options={[
          { label: '秒', value: '秒' },
          { label: '分钟', value: '分钟' },
          { label: '小时', value: '小时' },
          { label: '天', value: '天' },
          { label: '永久', value: '永久' }, // 添加“永久”选项
        ]}
        initialValue="秒"
        fieldProps={{
          onChange: setDurationUnit,
        }}
      />
      {/*<Form.Item name="requestHeader" label="请求头">*/}
      {/*  <Input.TextArea />*/}
      {/*</Form.Item>*/}
      {/*<Form.Item name="responseHeader" label="响应头">*/}
      {/*  <Input.TextArea />*/}
      {/*</Form.Item>*/}
    </DrawerForm>
  );
};

export default CreateModal;
