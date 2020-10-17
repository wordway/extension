import React, { useEffect, useState } from 'react';
import { Popconfirm, Table, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { Result, Wordbook } from '../../interfaces';
import { sharedHttpClient } from '../../networking';
import { sharedConfigManager, Config } from '../../utils/config';

import { WordItem } from '../../components';

const { Title, Paragraph } = Typography;

interface TabNewWordsProps {
  visible: boolean;
}

const TabNewWords = (props: TabNewWordsProps) => {
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
    if (!props.visible) return;
    loadData();
  }, [props.visible]);

  return (
    <div className="tab-newwords">
      <Title level={1}>我的生词本</Title>
      <Paragraph></Paragraph>
      <Table
        size="middle"
        columns={[
          {
            title: '单词',
            dataIndex: 'word',
            key: 'word',
            render: (_: any, record: any) => {
              return (
                <div key={record.word} style={{ display: 'flex' }}>
                  <div style={{ flex: 1 }}>
                    <WordItem word={record} />
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
        dataSource={words}
        bordered
        pagination={{ hideOnSinglePage: true }}
      />
    </div>
  );
};

export default TabNewWords;
