import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../services/http/axios'; // Ensure this import is valid
import { login } from '../../services/api/auth'; // Ensure this import is valid

interface FormValues {
  email: string;
  password: string;
}

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onFinish = (values: FormValues) => {
    console.log('Received values of form: ', values);

    login(values)
      .then((res) => {
        const { token, user } = res;
        console.log('login res', res);
        // Handle successful login
      })
      .catch((err) => {
        console.log('Login failed', err);
        // Handle login failure
      });
  };

  return (
    <Form name='login' onFinish={onFinish} layout='vertical'>
      <Form.Item
        name='email'
        label='Email'
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email address!' },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Item>

      <Form.Item
        name='password'
        label='Password'
        rules={[
          { required: true, message: 'Please input your password!' },
          { min: 6, message: 'Password must be at least 6 characters long!' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Item>

      <Form.Item>
        <Button type='primary' htmlType='submit'>
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};
