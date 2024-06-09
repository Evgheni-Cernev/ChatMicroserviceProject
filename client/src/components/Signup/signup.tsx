import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Image } from 'antd';
import { signup } from '../../services/api/auth';

export const Signup = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Received values from form: ', values);

    const { email, password, username } = values;

    console.log({ email, password, username });

    signup({ email, password, name: username })
      .then((res) => {
        console.log('Signup res', res);
      })
      .catch((err) => {
        console.error(err);
      });
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
            len: 10,
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
    </Form>
  );
};
