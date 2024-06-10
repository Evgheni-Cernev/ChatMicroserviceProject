import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Image } from 'antd';
import { login } from '../../services/api/auth'; // Ensure this import is valid
import { useStore } from '../../stores/store';
import { useEffect } from 'react';
import Title from 'antd/es/typography/Title';

interface FormValues {
  email: string;
  password: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const { id, setUserInfo } = useStore();

  console.log('LOGIN USER ID', id);

  useEffect(() => {
    if (id) {
      navigate('/chats');
    }
  }, [id]);

  const onFinish = (values: FormValues) => {
    console.log('Received values from LOGIN form: ', values);

    const { email, password } = values;

    console.log({ email, password });

    login({ email, password })
      .then((res: any) => {
        console.log('Login res', res);
        const { id, email, username, privateKey, publicKey } = res;
        console.log({ id, email, username, privateKey, publicKey });

        if (id) {
          setUserInfo({ id, email, username, privateKey, publicKey });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <Form name='login' onFinish={onFinish} layout='vertical'>
      <Image
        src='src/assets/images/privy-text-logo.png'
        width={70}
        preview={false}
        style={{ marginBottom: '20px' }}
      />
      <Title level={3} style={{ marginBottom: '20px' }}>
        Login
      </Title>
      <Form.Item
        name='email'
        label='Email'
        rules={[
          { required: true, message: 'Please input your email!' },
          { type: 'email', message: 'Please enter a valid email address!' },
        ]}
      >
        <Input prefix={<MailOutlined />} placeholder='Email' />
      </Form.Item>

      <Form.Item
        name='password'
        label='Password'
        rules={[
          { required: true, message: 'Please input your password!' },
          {
            min: 10,
            message: 'Password must be at least 10 characters long!',
          },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder='Password' />
      </Form.Item>

      <Form.Item>
        <Button type='primary' htmlType='submit'>
          Login
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type='link' onClick={handleSignUp}>
          Need an account? Sign up
        </Button>
      </Form.Item>
    </Form>
  );
};
