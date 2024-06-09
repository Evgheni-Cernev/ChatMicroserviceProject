import { useEffect } from 'react';
import { Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { getUserChats } from '../../services/api/chats';

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
    // render: (text: string[]) => {
    //   console.log('text', text);
    //   return text?.join(', ');
    // },

    render: (_, { members }) => (
      <>
        {members.map((participant: string) => {
          // let color = tag.length > 5 ? 'geekblue' : 'green';
          let color = participant === 'Eugen' ? 'volcano' : 'green';

          if (participant === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={participant}>
              {participant.toUpperCase()}
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
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Admin',
    dataIndex: 'admin',
    key: 'admin',
    align: 'center',
    render: (text) => <a>{text}</a>,
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'Chat 1',
    members: ['Nicolae', 'Eugen'],
    ttl: 60,
    admin: 'Eugen',
  },
  {
    key: '2',
    name: 'Chat 2',
    members: ['Nicolae', 'Eugen'],
    ttl: 60,
    admin: 'Eugen',
  },
  {
    key: '3',
    name: 'Chat 3',
    members: ['Nicolae', 'Eugen'],
    ttl: 60,
    admin: 'Eugen',
  },
];
export const ChatsMenu = ({ onSelectChat }) => {
  useEffect(() => {
    console.log('ChatsMenu useEffect');

    getUserChats({ userId: 8 })
      .then((res) => {
        console.log('getUserChats res', res);
      })
      .catch((err) => {
        console.error('getUserChats', err);
      });
  }, []);

  return (
    <>
      <Table columns={columns} dataSource={data} />
    </>
  );
};
