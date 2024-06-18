import React from 'react'
import ReactDOM from 'react-dom'
import Widget, { WidgetProps } from '@helixml/chat-widget'

const render = (config: WidgetProps = {
  url: '',
  model: '',
}) => {
  const widgetRootId = "helix-widget-root-" + Math.random().toString(36).substring(7);
  document.write(`<div id="${widgetRootId}"></div>`);
  ReactDOM.render(
    <>
      <Widget {...config} />
    </>,
    document.getElementById(widgetRootId)
  )
}

export default render