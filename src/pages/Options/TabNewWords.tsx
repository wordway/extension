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
      const loggedInUserId = config.loggedInUser?.id;
      const resp = await sharedHttpClient.get(
        `/wordbooks/newwords-for-user-${loggedInUserId}`,
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
    const loggedInUserId = config?.loggedInUser?.id;

    try {
      await sharedHttpClient.delete(
        `/wordbooks/newwords-for-user-${loggedInUserId}/words/${word}`
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
                    title="确定删除该生词吗？"
                    onConfirm={() => {
                      handleDelete(record.word);
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
        dataSource={words}
        bordered
        pagination={{ hideOnSinglePage: true }}
      />
    </>
  );
};

export default TabNewWords;
