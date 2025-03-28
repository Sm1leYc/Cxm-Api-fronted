import {DrawerForm, ProColumns, ProFormInstance, ProFormSelect, ProFormText} from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-table';
import '@umijs/max';
import { Form, Input } from 'antd';
import React, { useRef, useState } from 'react';

export type Props = {
  columns: ProColumns<API.BannedIps>[];
  // onCancel: () => void;
  onSubmit: (values : API.BannedIps) => Promise<void>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const CreateModal: React.FC<Props> = (props) => {

  const { visible, setVisible, onSubmit } = props;
  const formRef = useRef<ProFormInstance>();

  return (
    <DrawerForm<API.BannedIps>
      onFinish={async (value) => {
        onSubmit?.(value);
      }}
      formRef={formRef}
      formKey="update-modal-form"
      autoFocusFirstInput
      onOpenChange={setVisible}
      title="封IP"
      open={visible}
      drawerProps={{
        bodyStyle: { paddingBottom: 80 },
        width: window.innerWidth < 768 ? '100%' : '60%', // 修改点：根据屏幕宽度设置DrawerForm宽度
      }}
    >
      <ProFormText
        name="ipAddress"
        label="IP"
        rules={[{ required: true, message: 'IP不可为空！' }]}
      />

      <ProFormSelect
        name="reason"
        label="封禁原因"
        rules={[{ required: true, message: '封禁原因不可为空！' }]}
        options={[
          { label: '多次失败的登录尝试', value: '多次失败的登录尝试' },
          { label: '异常的流量或访问模式', value: '异常的流量或访问模式' },
          { label: '恶意活动或攻击', value: '恶意活动或攻击' },
          { label: '违反服务条款', value: '违反服务条款' },
          { label: '违规访问', value: '违规访问' },
        ]}
      />
    </DrawerForm>
  );
};

export default CreateModal;
