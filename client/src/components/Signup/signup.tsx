import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Image, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../services/api/auth';
import { useStore } from '../../stores/store';
import { useEffect } from 'react';

const { Title } = Typography;

export const Signup = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const store = useStore();
  const { setToken, token } = useStore();

  useEffect(() => {
    console.log('store', store);

    if (!store.token) {
      console.log({ setToken, token });

      setToken('tokenset');
    }
  }, [token]);

  const onFinish = (values: any) => {
    console.log('Received values from form: ', values);

    const { email, password, username } = values;

    console.log({ email, password, username });

    signup({ email, password, name: username })
      .then((res: any) => {
        console.log('Signup res', res);
        const { id, email, username, privateKey, publicKey } = res;

        if (id) {
          navigate('/login');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Form
      form={form}
      name='register'
      onFinish={onFinish}
      scrollToFirstError
      layout='vertical'
    >
      <Image
        src='src/assets/images/privy-text-logo.png'
        width={70}
        preview={false}
        style={{ marginBottom: '20px' }}
      />
      <Title level={3} style={{ marginBottom: '20px' }}>
        Sign up
      </Title>
      <Form.Item
        name='username'
        label='Username'
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder='Username' />
      </Form.Item>

      <Form.Item
        name='email'
        label='Email'
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder='Email' />
      </Form.Item>

      <Form.Item
        name='password'
        label='Password'
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
          {
            min: 10,
            message: 'Password must be at least 10 characters long!',
          },
        ]}
        hasFeedback
      >
        <Input.Password prefix={<LockOutlined />} placeholder='Password' />
      </Form.Item>

      <Form.Item
        name='confirm'
        label='Confirm Password'
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('The two passwords that you entered do not match!')
              );
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          placeholder='Confirm Password'
        />
      </Form.Item>

      <Form.Item>
        <Button type='primary' htmlType='submit'>
          Sign up
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type='link' onClick={handleLogin}>
          Already have an account?
        </Button>
      </Form.Item>
    </Form>
  );
};
