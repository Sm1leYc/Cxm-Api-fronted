import {
  DrawerForm,
  ProColumns,
  ProFormInstance,
  ProFormSelect,
  ProFormSwitch,
  ProFormText, ProFormTextArea
} from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-table';
import '@umijs/max';
import { Form } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type Props = {
  values: API.InterfaceInfoVO;
  columns: ProColumns<API.InterfaceInfoVO>[];
  setVisible: (visible: boolean) => void;
  onSubmit: (values: API.InterfaceInfoVO) => Promise<void>;
  visible: boolean;
  requestColumns: ProColumns<API.RequestParamsRemarkVO>[];
  responseColumns: ProColumns<API.ResponseParamsRemarkVO>[];
};

const UpdateModal: React.FC<Props> = (props) => {

  const { values, visible, setVisible, onSubmit,  requestColumns, responseColumns } = props;
  const formRef = useRef<ProFormInstance>();

  // @ts-ignore
  const [requestEditableKeys, setRequestEditableKeys] = useState<React.Key[]>(() => {
    return values.requestParamsRemark?.map((item) => item.id) || [];
  });
  const [requestDataSource, setRequestDataSource] = useState<
    readonly API.RequestParamsRemarkVO[]
  >(() => values.requestParamsRemark || []);

  // @ts-ignore
  const [responseEditableKeys, setResponseEditableKeys] = useState<React.Key[]>(() => {
    return values.responseParamsRemark?.map((item) => item.id) || [];
  });
  const [responseDataSource, setResponseDataSource] = useState<
    readonly API.ResponseParamsRemarkVO[]
  >(() => values.responseParamsRemark || []);

  const [durationUnit, setDurationUnit] = useState<'秒' | '分钟' | '小时' | '天' | '永久'>('秒');
  const [convertedDuration, setConvertedDuration] = useState<number | string>(values.cacheDuration || '');


  useEffect(() => {
    if (formRef) {

      if (values.requestParamsRemark){
        let requestIds =
          values.requestParamsRemark?.map((item) => item.id as unknown as string) || [];
        setRequestEditableKeys(requestIds);
        setRequestDataSource(values.requestParamsRemark || []);
      }

      if (values.responseParamsRemark){
        let responseIds =
          values.responseParamsRemark?.map((item) => item.id as unknown as string) || [];
        setResponseEditableKeys(responseIds);
        setResponseDataSource(values.responseParamsRemark || []);
      }
      }
      formRef.current?.setFieldsValue(values);

  }, [values]);

  // 自动根据秒数转换时间单位
  useEffect(() => {
    if (values.cacheDuration) {
      const seconds = values.cacheDuration;

      if (seconds === -1) {
        setDurationUnit('永久'); // 如果后端返回-1，设置为永久
        setConvertedDuration(''); // 不需要显示数字
      } else if (seconds >= 86400) {
        setDurationUnit('天');
        setConvertedDuration((seconds / 86400).toFixed(0)); // 天数
      } else if (seconds >= 3600) {
        setDurationUnit('小时');
        setConvertedDuration((seconds / 3600).toFixed(0)); // 小时数
      } else if (seconds >= 60) {
        setDurationUnit('分钟');
        setConvertedDuration((seconds / 60).toFixed(0)); // 分钟数
      } else {
        setDurationUnit('秒');
        setConvertedDuration(seconds.toString()); // 秒数
      }
    }
  }, [values.cacheDuration]);

  useEffect(() => {
    if (visible) {
      formRef.current?.setFieldsValue({
        ...values,
        cacheDuration: convertedDuration,
        durationUnit,
      });
    }
  }, [values, visible, convertedDuration, durationUnit]);

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
      title="修改接口"
      open={visible}
      drawerProps={{
        bodyStyle: { paddingBottom: 80 },
        width: window.innerWidth < 768 ? '100%' : '60%', // 修改点：根据屏幕宽度设置DrawerForm宽度
      }}
    >
      <ProFormText
        name="name"
        label="接口名称"
        initialValue={values.name}
        rules={[{ required: true, message: '接口名称不可为空！' }]}
      />

      <ProFormText
        name="description"
        label="接口描述"
        initialValue={values.description}
        rules={[{ required: true, message: '描述不可为空！' }]}
      />
      <ProFormSelect
        name="remarkType"
        label="备注类型"
        options={[
          { label: 'success', value: 'success' },
          { label: 'info', value: 'info' },
          { label: 'warning', value: 'warning' },
          { label: 'error', value: 'error' },
          // { label: 'info', value: 'info' },
        ]}
      />
      <ProFormText
        name="remarkContent"
        label="备注内容"
        initialValue={values.remarkContent}
      />
      <ProFormSelect
        name="status"
        label="接口状态"
        options={[
          { label: '上线', value: 1 },
          { label: '下线', value: 0 },
          { label: '测试', value: 2 },
        ]}
        initialValue={values.status} // 设置初始值为当前接口状态
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
        initialValue={values.requiredPoints}
        rules={[{ required: true, message: '所需积分不可为空！' }]}
      />

      <Form.Item name="requestParamsRemark" label="请求参数说明">
        <EditableProTable<API.RequestParamsRemarkVO>
          rowKey="id"
          toolBarRender={false}
          columns={requestColumns.map(col => ({
            ...col,
            width: col.width || 100, // 设置默认宽度
            ellipsis: true, // 启用省略号
          }))}
          value={requestDataSource}
          onChange={setRequestDataSource}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            position: 'bottom',
            record: () => ({
              id: Date.now(),
              name: '1',
              remark: '1',
              isRequired: 'no',
              type: 'String',
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
          scroll={{ x: '100%' }}  // 允许横向滚动
        />
      </Form.Item>


      <Form.Item name="responseParamsRemark" label="响应参数说明">
        <EditableProTable<API.ResponseParamsRemarkVO>
          rowKey="id"
          toolBarRender={false}
          columns={responseColumns.map(col => ({
            ...col,
            width: col.width || 100, // 设置默认宽度
            ellipsis: true, // 启用省略号
          }))}
          value={responseDataSource}
          onChange={setResponseDataSource}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            position: 'bottom',
            record: () => ({
              id: Date.now(),
              type: 'String',
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
          scroll={{ x: '100%' }}  // 允许横向滚动
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
    </DrawerForm>
  );
};
export default UpdateModal;
