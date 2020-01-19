import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { InjectTransTooltip } from './components';

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

  if (q.length === 0) {
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
}

const onMessage = (e: any) => {
  const { source = '', payload } = e.data || {};
  if (source !== 'wordway-extension-bridge') return;

  chrome.runtime.sendMessage(payload);
};

const onMouseUp = (e: any) => {}

const onMouseDown = (e: any) => {
  const path = e.path || (e.composedPath && e.composedPath());
  if (path.length > 0) {
    const firstTagName = path[0].tagName;
    if (firstTagName === 'INPUT' || firstTagName === 'TEXTAREA') return;
    if (path.findIndex(({ id }: any) => id === ELEMENT_ID) >= 0) return;
  }
  const keys = ['selectionTranslateMode'];
  const callback = (r: any) => {
    if (r.selectionTranslateMode === 'disabled') return;

    injectTransTooltip({
      autoload: r.selectionTranslateMode === "enable-translate-tooltip"
    });
  };
  chrome.storage.sync.get(keys, callback);
};

const onKeyDown = (e: KeyboardEvent) => {
  if (!e.shiftKey) return;

  injectTransTooltip({ autoload: true });
};

window.addEventListener('message', onMessage);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('keydown', onKeyDown);
