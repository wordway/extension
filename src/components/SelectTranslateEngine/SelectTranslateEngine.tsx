import React from 'react';
import { Select } from 'antd';

import options from './options';

const SelectTranslateEngine = ({ value, ...rest }: any) => {
  return (
    <Select value={value} {...rest}>
      {options.map((e) => (
        <Select.Option key={e.key} value={e.key}>
          {e.label}
        </Select.Option>
      ))}
    </Select>
  );
};

export default SelectTranslateEngine;
