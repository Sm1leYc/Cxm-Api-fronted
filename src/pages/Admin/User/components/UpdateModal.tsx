import {
  DrawerForm,
  ProColumns,
  ProFormInstance,
  ProFormSelect, ProFormSwitch,
  ProFormText
} from '@ant-design/pro-components';
import '@umijs/max';
import React, { useEffect, useRef, useState } from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type Props = {
  values: API.UserUpdateRequest;
  columns: ProColumns<API.UserUpdateRequest>[];
  setVisible: (visible: boolean) => void;
  onSubmit: (values: API.UserUpdateRequest) => Promise<void>;
  visible: boolean;
};

const UpdateModal: React.FC<Props> = (props) => {

  const { values, visible, setVisible, onSubmit } = props;
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (formRef) {

      }
      formRef.current?.setFieldsValue(values);

  }, [values]);

  const handleSubmit = async (value: API.UserUpdateRequest) => {

    // 提交数据
    await onSubmit?.(value);
  };

  return (
    <DrawerForm<API.UserUpdateRequest>
      onFinish={handleSubmit}
      formRef={formRef}
      formKey="update-modal-form"
      autoFocusFirstInput
      onOpenChange={setVisible}
      title="修改用户"
      open={visible}
      drawerProps={{
        bodyStyle: { paddingBottom: 80 },
        width: window.innerWidth < 768 ? '100%' : '60%', // 修改点：根据屏幕宽度设置DrawerForm宽度
      }}
    >
      <ProFormText
        name="userAccount"
        label="用户账号"
        initialValue={values.userAccount}
      />

      <ProFormText
        name="userName"
        label="用户昵称"
        initialValue={values.userName}
      />

      <ProFormText
        name="userAvatar"
        label="用户头像"
        initialValue={values.userAvatar}
      />

      <ProFormSelect
        name="userRole"
        label="角色"
        options={[
          { label: 'user', value: 'user' },
          { label: 'admin', value: 'admin' }
        ]}
      />

      <ProFormText
        name="points"
        label="积分"
        initialValue={values.points}
      />

      <ProFormText
        name="accessKey"
        label="accessKey"
        initialValue={values.accessKey}
      />

      <ProFormText
        name="secretKey"
        label="secretKey"
        initialValue={values.secretKey}
      />

    </DrawerForm>
  );
};
export default UpdateModal;
