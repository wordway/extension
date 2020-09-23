import React from 'react';
import { Typography } from 'antd';

const { Text, Title, Paragraph } = Typography;

const TabExperimentalFeature = () => {
  return (
    <>
      <Title level={1}>实验性功能</Title>
      <Paragraph>
        <Text type="danger">警告：你所要使用的是实验性功能！</Text>
        这些功能处于开发的早期或中期阶段，你可以在新功能正式推出前抢先试用。我们非常期望收到你的反馈和 Bug 报告。 你可以在 <a href="https://github.com/wordway/wordway-extension">GitHub 源存储库</a>中提出问题。
      </Paragraph>
    </>
  );
};

export default TabExperimentalFeature;
