import React, { useState } from 'react';
import {
  message,
  Button,
  Checkbox,
  Form,
  Input,
  Typography,
  Modal,
} from 'antd';
import { sharedHttpClient } from '../../networking';
import { ModalProps } from 'antd/lib/modal';

import env from '../../utils/env';

const { Title } = Typography;

interface LoginModalProps extends ModalProps {
  onLoginSuccess: (user: any) => void;
}

const LoginModal = (props: LoginModalProps) => {
  const [processing, setProcessing] = useState(false);

  const handleOnFinish = async (values: any) => {
    try {
      setProcessing(true);
      await new Promise((r) => setTimeout(() => r(), 600));
      const resp = await sharedHttpClient.post('/account/login', values);

      const {
        data: { data: user },
      } = resp;
      props.onLoginSuccess(user);
    } catch (error) {
      message.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal footer={null} width={460} {...props}>
      <div
        style={{
          // paddingTop: '20px',
          paddingBottom: '10px',
          paddingLeft: '10px',
          paddingRight: '10px',
        }}
      >
        <Form
          name="login_form"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={handleOnFinish}
        >
          <Form.Item>
            <Title level={3} style={{ fontWeight: 400, marginBottom: 0 }}>
              登录到你的帐户
            </Title>
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱地址"
            rules={[{ required: true, message: '请输入你的邮箱地址！' }]}
          >
            <Input placeholder="your@example.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入你的密码！' }]}
          >
            <Input.Password placeholder="·····" />
          </Form.Item>
          <Form.Item>
            <Form.Item
              name="remember"
              valuePropName="checked"
              style={{
                display: 'inline-block',
                width: '50%',
                marginBottom: '0px',
              }}
            >
              <Checkbox>保持我的登录状态</Checkbox>
            </Form.Item>
            <Form.Item
              style={{
                display: 'inline-block',
                width: '50%',
                marginBottom: '0px',
              }}
            >
              <a
                style={{ float: 'right' }}
                href={`${env.webURL}/account/reset_password`}
                target="_blank"
                rel="noopener noreferrer"
              >
                找回密码
              </a>
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={processing}>
              登录
            </Button>
          </Form.Item>
        </Form>
        <p
          style={{
            marginTop: 16,
          }}
        >
          还没有帐号？
          <a
            href={`${env.webURL}/account/register`}
            target="_blank"
            rel="noopener noreferrer"
          >
            立即注册
          </a>
        </p>
      </div>
    </Modal>
  );
};

export default LoginModal;
