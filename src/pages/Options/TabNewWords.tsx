import React, { useEffect, useState } from 'react';
import { Popconfirm, Table, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { Result, Wordbook } from '../../interfaces';
import { sharedHttpClient } from '../../networking';
import { sharedConfigManager, Config } from '../../utils/config';

const { Title, Paragraph } = Typography;

const TabNewWords = () => {
  let [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [words, setWords] = useState<Array<any>>([]);

  const loadData = async () => {
    let config = await sharedConfigManager.getConfig();
    setConfig(config);
    setLoading(true);

    try {
      const currentUserId = config.currentUser?.id;
      const resp = await sharedHttpClient.get(
        `/wordbooks/newwords-for-user-${currentUserId}`,
        {
          params: { include: ['words'] },
        }
      );
      const r: Result<Wordbook> = resp.data as Result<Wordbook>;

      setWords(r.data?.words || []);
    } catch (error) {
      // skip
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (word: any) => {
    const currentUserId = config?.currentUser?.id;

    try {
      await sharedHttpClient.delete(
        `/wordbooks/newwords-for-user-${currentUserId}/words/${word}`
      );
      loadData();
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
      <Title level={1}>生词本</Title>
      <Paragraph></Paragraph>
      <Table
        size="middle"
        columns={[
          {
            title: '单词',
            dataIndex: 'word',
            key: 'word',
            render: (value: any, record: any) => {
              return (
                <div style={{ display: 'flex' }}>
                  <div>
                    <label
                      style={{
                        fontSize: '18px',
                      }}
                    >
                      {value}
                    </label>
                    {/* <div>
                      {record.definitions.map((e: any) => {
                        return <p key={JSON.stringify(e)}>{JSON.stringify(e)}</p>;
                      })}
                    </div> */}
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

export default TabNewWords;
