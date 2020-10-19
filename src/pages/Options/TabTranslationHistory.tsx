import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Table, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { sharedDb } from '../../networking';
import { WordItem } from '../../components';

const { Title, Paragraph } = Typography;

interface TabTranslationHistoryProps {
  visible: boolean;
}

const TabTranslationHistory = (props: TabTranslationHistoryProps) => {
  const [loading, setLoading] = useState(true);
  const [translationRecords, setTranslationRecords] = useState<Array<any>>([]);

  const loadData = async () => {
    setLoading(true);

    try {
      await sharedDb.read();
      setTranslationRecords(sharedDb.data?.translationRecords || []);
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

  const handleDelete = async (word: any) => {
    try {
      while (true) {
        let index: number =
          sharedDb.data?.translationRecords.findIndex(
            (v) => v.word === word.word
          ) ?? -1;
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
    if (!props.visible) return;
    loadData();
  }, [props.visible]);

  return (
    <>
      <Title level={1}>翻译记录</Title>
      <Paragraph>
        当你使用划词翻译功能时将自动记录到你的浏览器中，以便你日后可以进行查阅。
      </Paragraph>
      <div
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Popconfirm
          title="确定清空记录吗？"
          onConfirm={() => {
            handleClear();
          }}
          okText="是"
          cancelText="否"
        >
          <Button type="ghost" size="small">
            清空记录
          </Button>
        </Popconfirm>
      </div>
      <Table
        size="middle"
        columns={[
          {
            title: '单词',
            dataIndex: 'text',
            key: 'text',
            render: (_: any, record: any) => {
              return (
                <div key={`${record.word}`} style={{ display: 'flex' }}>
                  <div style={{ flex: 1 }}>
                    <WordItem word={record} />
                  </div>
                  <Popconfirm
                    title="确定删除该记录吗？"
                    onConfirm={() => {
                      handleDelete(record);
                    }}
                    okText="是"
                    cancelText="否"
                  >
                    <DeleteOutlined
                      style={{
                        fontSize: '16px',
                        marginTop: '10px',
                        marginLeft: '10px',
                        marginRight: '0px',
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
