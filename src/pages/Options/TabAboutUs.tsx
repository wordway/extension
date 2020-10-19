import React from 'react';
import { Table, Typography } from 'antd';
import manifestJson from '../../../public/manifest.json';

const { Title, Paragraph } = Typography;

const TabAboutUs = () => {
  return (
    <>
      <Title level={1}>关于我们</Title>
      <Paragraph>© 2020 LiJianying 保留所有版权。</Paragraph>
      <Title level={4}>统计数据</Title>
      <Table
        size="middle"
        showHeader={false}
        columns={[
          {
            title: '数据名称',
            dataIndex: 'title',
            key: 'title',
            render: (value: any, record: any) => {
              return (
                <div style={{ display: 'flex' }}>
                  {record.title}
                  <div style={{ flex: 1 }} />
                  {record.value}
                </div>
              );
            },
          },
        ]}
        dataSource={[
          {
            key: 'version',
            title: '版本信息',
            value: `v${manifestJson.version}`,
          },
          // {
          //   key: '',
          //   title: '用户数量',
          //   value: '0',
          // },
        ]}
        bordered
        pagination={{ hideOnSinglePage: true }}
      />

      <Title level={4} style={{ marginTop: '32px' }}>
        联系我
      </Title>
      <Table
        size="middle"
        showHeader={false}
        columns={[
          {
            title: '渠道',
            dataIndex: 'name',
            key: 'name',
            render: (value, record) => {
              return (
                <span>
                  {record.name}:&nbsp;&nbsp;{record.link}
                </span>
              );
            },
          },
        ]}
        dataSource={[
          {
            key: 'email',
            name: '邮箱',
            link: (
              <a
                href={'mailto:lijy91@foxmail.com'}
                target="_blank"
                rel="noopener noreferrer"
              >
                {'lijy91@foxmail.com'}
              </a>
            ),
          },
          {
            key: 'wechat',
            name: '微信',
            link: 'lijy91',
          },
        ]}
        bordered
        pagination={{ hideOnSinglePage: true }}
      />
      <Title level={4} style={{ marginTop: '32px' }}>
        讨论组
      </Title>
      <Table
        size="middle"
        columns={[
          {
            title: '渠道',
            dataIndex: 'name',
            key: 'name',
            render: (value, record) => {
              return (
                <a href={record.link} target="_blank" rel="noopener noreferrer">
                  {value}
                </a>
              );
            },
          },
        ]}
        dataSource={[
          {
            key: 'qq',
            name: 'QQ 群',
            link: 'https://jq.qq.com/?_wv=1027&k=r407PHqM',
          },
          {
            key: 'telegram',
            name: '电报群',
            link: 'https://t.me/joinchat/I4jz1FJ4Y7d5TE8PpDxMmA',
          },
        ]}
        bordered
        pagination={{ hideOnSinglePage: true }}
      />
    </>
  );
};

export default TabAboutUs;
