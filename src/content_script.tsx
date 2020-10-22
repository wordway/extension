import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import Hotkeys from 'hotkeys-js';

import { InjectTransPopover } from './components';
import { Config, sharedConfigManager, ConfigListener } from './utils/config';

const ELEMENT_ID = '___wordway';

const injectTransTooltip = ({ autoload = false }: any) => {
  const selection: any = document.getSelection();

  if (selection.rangeCount === 0) return;

  const selectionRange = selection.getRangeAt(0);
  const selectionRect = selectionRange.getBoundingClientRect();
  // 未获取 x/y 轴的值，不进行任何操作
  if (selectionRect.x === 0 && selectionRect.y === 0) return;

  const q = selection.toString().trim() || '';

  let el = document.getElementById(ELEMENT_ID);

  // 未选中文字或超过200个字符
  if (q.length === 0 || q.length > 200) {
    if (el) el.remove();
    return;
  }

  // 过滤非英文字符
  const englishRegex = /^[a-zA-Z0-9 .?!,:…;-–—()[\]{}"'/]+$/;
  const spaceCount = (q.match(/\s/g) ?? []).length;

  if (!englishRegex.test(q) || !(spaceCount < 100)) {
    if (el) el.remove();
    return;
  }

  if (el && el.getAttribute('data-q') !== q) {
    el.remove();
    el = null;
  }

  if (!el) {
    el = document.createElement('div');
    el.setAttribute('id', ELEMENT_ID);
    el.setAttribute('data-q', q);

    document.body.appendChild(el);
  }

  ReactDOM.render(
    <ConfigProvider autoInsertSpaceInButton={false}>
      <InjectTransPopover
        q={q}
        autoload={autoload}
        boundingClientRect={selectionRect}
        onShow={() => {}}
        onHide={() => {
          if (el) el.remove();
        }}
      />
    </ConfigProvider>,
    el
  );
};

window.onmessage = (e: any) => {
  const { source = '', payload } = e.data || {};
  if (source !== 'wordway-extension-bridge') return;

  chrome.runtime.sendMessage(payload);
};

window.onload = async () => {
  // 获取扩展程序配置
  let config: Config = await sharedConfigManager.getConfig();

  // 处理鼠标事件
  const onMouseUp = (e: any) => {
    const path = e.path || (e.composedPath && e.composedPath());
    if (path.length > 0) {
      const firstTagName = path[0].tagName;
      if (firstTagName === 'INPUT' || firstTagName === 'TEXTAREA') return;
      if (path.findIndex(({ id }: any) => id === ELEMENT_ID) >= 0) return;
    }

    if (config.selectionTranslateMode === 'disabled') return;

    const autoload =
      config.selectionTranslateMode === 'enable-translate-popover';

    injectTransTooltip({ autoload });
  };
  window.addEventListener('mouseup', onMouseUp);

  // 处理快捷键事件
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.type !== 'keydown') return;
    injectTransTooltip({ autoload: true });
  };
  let selectionTranslateShortcut = config.selectionTranslateShortcut;
  Hotkeys(config.selectionTranslateShortcut, onKeyDown);

  // 处理配置发生变化时重新相关绑定事件
  const configListener: ConfigListener = {
    onConfigChange: (newConfig: Config) => {
      Hotkeys.unbind(selectionTranslateShortcut, onKeyDown);
      Hotkeys(newConfig.selectionTranslateShortcut, onKeyDown);

      config = newConfig;
    },
  };
  sharedConfigManager.addListener(configListener);
};
