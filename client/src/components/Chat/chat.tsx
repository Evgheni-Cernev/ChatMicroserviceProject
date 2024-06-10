import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../stores/store';
import { useEffect, useState } from 'react';
import { sendMessage } from '../../services/api/chats';
import { List, Input, Button } from 'antd';

const data = [
  { id: 1, sender: 'Nicolae', message: 'Hello everyone' },
  { id: 2, sender: 'Eugen', message: 'Hi' },
  {
    id: 2,
    sender: 'Nicolae',
    message: 'Is 10 hours enough to finish this PIS? :)',
  },
  {
    id: 2,
    sender: 'Eugen',
    message: 'You never find out unless you try, ho-ho ',
  },
];

export const Chat = () => {
  const location = useLocation();
  const chat = location.state?.chat;
  const { messages } = chat || {};
  const { id, username, email, publicKey, privateKey } = useStore();
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('Chat', chat);
  }, [chat]);

  const handleSendMessage = () => {
    sendMessage(chat.id, message);
    setMessage('');
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ textAlign: 'left', maxWidth: '600px' }}>
          {messages && (
            <div
              style={{
                maxHeight: '300px',
                overflowY: 'auto',
                marginBottom: '10px',
              }}
            >
              <List
                dataSource={chat?.messages}
                renderItem={(item: any) => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.sender}
                      description={item.message}
                    />
                  </List.Item>
                )}
              />
            </div>
          )}
          {/* Dummy section */}
          <List
            dataSource={data}
            renderItem={(item: any) => (
              <List.Item>
                <List.Item.Meta
                  title={item.sender}
                  description={item.message}
                />
              </List.Item>
            )}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ marginRight: '10px' }}
            />
            <Button onClick={handleSendMessage} type='primary'>
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
