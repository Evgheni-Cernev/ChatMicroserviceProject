import { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { createChat, getUserChats } from '../../services/api/chats';
import { useStore } from '../../stores/store';
import { getAllUsers } from '../../services/api/users';
import { useNavigate } from 'react-router-dom';

interface DataType {
  key: string;
  name: string;
  members: any[];
  ttl: number;
  admin: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Chats',
    dataIndex: 'name',
    align: 'center',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Members',
    dataIndex: 'members',
    align: 'center',
    key: 'members',
    render: (_, { members, admin }) => (
      <>
        {members?.map((member: any) => {
          console.log('members', members, admin);
          // let color = tag.length > 5 ? 'geekblue' : 'green';
          let color = 'green';

          if (member.username === admin) {
            color = 'volcano';
          }

          return (
            <Tag color={color} key={member}>
              {member.username?.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Message expiry (seconds)',
    dataIndex: 'ttl',
    align: 'center',
    key: 'ttl',
    render: (text) => <a>{text || 15}</a>,
  },
  {
    title: 'Admin',
    dataIndex: 'admin',
    key: 'admin',
    align: 'center',
    render: (text) => <a>{text}</a>,
  },
];

export const ChatsMenu = () => {
  const navigate = useNavigate();
  const { id, email, username, privateKey, publicKey } = useStore();
  const [creatingChat, setCreatingChat] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatName, setChatName] = useState('');
  const [chats, setChats] = useState<any[]>([]);

  const setUserChats = (chats: any[]) => {
    setChats(
      chats?.map((el: any) => {
        return {
          key: el?.id,
          name: el?.chatName,
          admin: el?.adminUser?.username,
          members: el?.participants,
          ttl: el?.messageExpirationTime,
        };
      })
    );
  };

  useEffect(() => {
    console.log('ChatsMenu', { id, email, username, privateKey, publicKey });

    if (id) {
      setLoading(true);
      // Get all user chats
      getUserChats({ userId: id })
        .then((res) => {
          console.log('getUserChats res', res);
          setUserChats(res);
        })
        .catch((err) => {
          console.error('getUserChats', err);
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        });

      // Fetch all available users
      getAllUsers({ userId: id })
        .then((res) => {
          console.log('getAllUsers res', res);

          setUsers(res);
        })
        .catch((err) => {
          console.error('getAllUsers', err);
        });
    } else {
      navigate('/login');
    }
  }, [id]);

  useEffect(() => {
    console.log('chats', chats);
  }, [chats]);

  useEffect(() => {
    console.log('selectedUsers', selectedUsers);
  }, [selectedUsers]);

  const handleCreateChat = () => {
    // Call the API to create a chat with the selected users

    if (id) {
      createChat({
        userIds: [...selectedUsers, id],
        chatName,
        adminUserId: id,
        isDirectMessage: false,
      })
        .then((res) => {
          console.log('createChat res', res);
          setLoading(true);
          getUserChats({ userId: id }).then((res) => {
            setUserChats(res);
          });
        })
        .catch((err) => {
          console.error('createChat', err);
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        });
    }
  };

  return (
    <>
      <Table
        onRow={(record, rowIndex: any) => {
          console.log('Table', { record, rowIndex });

          return {
            onClick: (event) => {
              console.log('event', rowIndex, event);
              navigate(`/chat/${record?.key}`, {
                state: { chat: chats[record?.key] },
              });
            },
          };
        }}
        columns={columns}
        // dataSource={data}
        dataSource={chats}
        loading={loading}
        pagination={{ pageSize: 2 }}
        style={{ marginBottom: '20px' }}
      />
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <Button
          onClick={() => {
            if (creatingChat) {
              setCreatingChat(false);
            } else {
              setCreatingChat(true);
            }
          }}
          type={creatingChat ? 'default' : 'primary'}
          style={{ width: '200px' }}
        >
          {creatingChat ? 'Cancel Creation' : 'Create Chat'}
        </Button>
      </div>
      {creatingChat && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Checkbox
            key='select-all-users'
            style={{ marginBottom: '10px' }}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedUsers(users.map((user) => user.id));
              } else {
                setSelectedUsers([]);
              }
            }}
          >
            Select All
          </Checkbox>
          {users.map((user) => (
            <Checkbox
              key={user.id}
              style={{ marginBottom: '10px' }}
              checked={selectedUsers.includes(user.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedUsers([...selectedUsers, user.id]);
                } else {
                  setSelectedUsers(
                    selectedUsers.filter((id) => id !== user.id)
                  );
                }
              }}
            >
              {user.username}
            </Checkbox>
          ))}
          <Input
            required={true}
            placeholder='Enter chat name'
            value={chatName}
            style={{ marginBottom: '10px', width: '200px' }}
            onChange={(e) => setChatName(e.target.value)}
          />
          <Button
            onClick={handleCreateChat}
            style={{ width: '200px' }}
            type='primary'
          >
            Confirm Creation
          </Button>
        </div>
      )}
    </>
  );
};
