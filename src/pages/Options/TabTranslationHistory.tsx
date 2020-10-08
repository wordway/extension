import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Table, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { sharedDb } from '../../networking';

const { Title, Paragraph } = Typography;

const TabTranslationHistory = () => {
  const [loading, setLoading] = useState(true);
  const [translationRecords, setTranslationRecords] = useState<Array<any>>([]);

  const loadData = async () => {
    setLoading(true);

    try {
      await sharedDb.read();
      setTranslationRecords(
        (sharedDb.data?.translationRecords || []).map((v) => {
          return { text: v };
        })
      );
    } catch (error) {
      // skip
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      while ((sharedDb.data?.translationRecords?.length || 0) > 0) {
        sharedDb.data?.translationRecords.pop();
      }
      await sharedDb.write();
      await loadData();
    } catch (error) {
      // skip
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (text: any) => {
    try {
      while (true) {
        let index: number =
          sharedDb.data?.translationRecords.indexOf(text) ?? -1;
        if (index !== -1) {
          sharedDb.data?.translationRecords.splice(index, 1);
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
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button type="ghost" size="small" onClick={() => handleClear()}>
          清空翻译记录
        </Button>
      </div>
      <Table
        size="middle"
        columns={[
          {
            title: '单词或短语',
            dataIndex: 'text',
            key: 'text',
            render: (value: any, record: any) => {
              return (
                <div
                  style={{ display: 'flex', alignItems: 'center' }}
                  key={`${record.id}`}
                >
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        fontSize: '15px',
                      }}
                    >
                      {value}
                    </label>
                  </div>
                  <Popconfirm
                    title="确定删除该记录吗？"
                    onConfirm={() => {
                      handleDelete(record.text);
                    }}
                    okText="是"
                    cancelText="否"
                  >
                    <DeleteOutlined
                      style={{
                        fontSize: '16px',
                        marginLeft: '10px',
                        marginRight: '10px',
                      }}
                    />
                  </Popconfirm>
                </div>
              );
            },
          },
        ]}
        loading={loading}
        dataSource={translationRecords}
        bordered
        pagination={{ hideOnSinglePage: true }}
      />
    </>
  );
};

export default TabTranslationHistory;
