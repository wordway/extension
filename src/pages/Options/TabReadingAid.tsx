import React from 'react';
import { Typography } from 'antd';
import Mark from 'mark.js';

const { Title, Paragraph } = Typography;

const TabReadingAid = () => {
  setTimeout(() => {
    var instance = new Mark('body');
    instance.mark('custom');
  }, 1000);

  return (
    <>
      <Title level={1}>阅读辅助</Title>
      <Paragraph>
        mark.js is a text highlighter written in JavaScript. It can be used to
        dynamically mark search terms or custom regular expressions and offers
        you built-in options like diacritics support, separate word search,
        custom synonyms, iframes support, custom filters, accuracy definition,
        custom element, custom class name and more.
      </Paragraph>
    </>
  );
};

export default TabReadingAid;
