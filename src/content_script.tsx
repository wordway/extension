import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { InjectTransTooltip } from './components';
import UserConfig from './utils/user-config';

const ELEMENT_ID = '___wordway';

const injectTransTooltip = ({ autoload = false, scopes = [] }: any) => {
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

  if (
    !englishRegex.test(q) ||
    !(
      ((scopes || []).includes('word') && spaceCount === 0) ||  // 单词
      ((scopes || []).includes('phrase') && spaceCount <= 2) || // 词组
      ((scopes || []).includes('sentence') && spaceCount > 2)   // 短句
    )
  ) {
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
    <InjectTransTooltip
      q={q}
      autoload={autoload}
      boundingClientRect={selectionRect}
      onShow={() => {}}
      onHide={() => {
        if (el) el.remove();
      }}
    />,
    el
  );
};

const onMessage = (e: any) => {
  const { source = '', payload } = e.data || {};
  if (source !== 'wordway-extension-bridge') return;

  chrome.runtime.sendMessage(payload);
};

const onMouseUp = (e: any) => {
  const path = e.path || (e.composedPath && e.composedPath());
  if (path.length > 0) {
    const firstTagName = path[0].tagName;
    if (firstTagName === 'INPUT' || firstTagName === 'TEXTAREA') return;
    if (path.findIndex(({ id }: any) => id === ELEMENT_ID) >= 0) return;
  }

  const callback = (userConfig: UserConfig) => {
    const selectionTranslateMode = userConfig.selectionTranslateMode;
    const selectionTranslateScopes = userConfig.selectionTranslateScopes;

    if (selectionTranslateMode === 'disabled') return;

    injectTransTooltip({
      autoload: selectionTranslateMode === 'enable-translate-tooltip',
      scopes: selectionTranslateScopes
    });
  };
  UserConfig.load(callback);
};

const onMouseDown = (e: any) => {};

const onKeyDown = (e: KeyboardEvent) => {
  if (!e.shiftKey) return;

  const callback = (userConfig: UserConfig) => {
    const selectionTranslateScopes = userConfig.selectionTranslateScopes;

    injectTransTooltip({
      autoload: true,
      scopes: selectionTranslateScopes
    });
  };
  UserConfig.load(callback);
};

window.addEventListener('message', onMessage);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('keydown', onKeyDown);
