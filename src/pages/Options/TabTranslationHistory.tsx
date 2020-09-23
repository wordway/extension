import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Popconfirm, Table, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { sharedDb } from '../../networking';

const { Title, Paragraph } = Typography;

const TabTranslationHistory = () => {
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState<Array<any>>([]);

  const loadData = async () => {
    setLoading(true);

    try {
      await sharedDb.read();
      // sharedDb.data?.messages?.push('abc1');
      // sharedDb.data?.messages?.push('abc2');
      // sharedDb.data?.messages?.push('abc3');
      // sharedDb.data?.messages?.push('abc4');
      // await sharedDb.write();

      setWords(
        (sharedDb.data?.messages || []).map((v) => {
          return { word: v };
        })
      );
      console.log(sharedDb.data?.messages || []);
    } catch (error) {
      // skip
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (word: any) => {
    try {
      while (true) {
        let index: number = sharedDb.data?.messages.indexOf(word) ?? -1;
        if (index !== -1) {
          sharedDb.data?.messages.splice(index, 1);
        } else {
          break;
        }
      }
      await sharedDb.write();
      await loadData();
    } catch (error) {
      // skip
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Title level={1}>翻译记录</Title>
      <Paragraph>
        当你使用划词翻译、阅读辅助等功能时将自动记录到你的浏览器中，以便你日后可以进行查阅。
      </Paragraph>
      <Table
        size="middle"
        columns={[
          {
            title: '单词',
            dataIndex: 'word',
            key: 'id',
            render: (value: any, record: any) => {
              return (
                <div style={{ display: 'flex' }} key={`${record.id}`}>
                  <div>
                    <label
                      style={{
                        fontSize: '18px',
                      }}
                    >
                      {value}
                    </label>
                  </div>
                </div>
              );
            },
          },
          {
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (value: any, record: any) => {
              return (
                <Popconfirm
                  title="确定删除该生词吗？"
                  onConfirm={() => {
                    handleDelete(record.word);
                  }}
                  okText="是"
                  cancelText="否"
                >
                  <DeleteOutlined />
                </Popconfirm>
              );
            },
          },
        ]}
        loading={loading}
        dataSource={words}
        bordered
        pagination={{ hideOnSinglePage: true }}
      />
    </>
  );
};

export default TabTranslationHistory;
