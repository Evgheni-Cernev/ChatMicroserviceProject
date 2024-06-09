import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
  key: string;
  name: string;
  participants: string[];
  ttl: number;
  admin: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    align: 'center',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Participants',
    dataIndex: 'participants',
    align: 'center',
    key: 'participants',
    render: (text: string[]) => {
      console.log('text', text);
      return text?.join(', ');
    },
  },
  {
    title: 'Message Time To Live (seconds)',
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
    participants: ['Nicolae', 'Eugen'],
    ttl: 60,
    admin: 'Nicolae',
  },
  {
    key: '2',
    name: 'Chat 2',
    participants: ['Nicolae', 'Eugen'],
    ttl: 60,
    admin: 'Nicolae',
  },
  {
    key: '3',
    name: 'Chat 3',
    participants: ['Nicolae', 'Eugen'],
    ttl: 60,
    admin: 'Nicolae',
  },
];
export const ChatsMenu = ({ onSelectChat }) => {
  return (
    <>
      <Table columns={columns} dataSource={data} />
    </>
  );
};
