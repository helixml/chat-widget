import React from 'react'
import ReactDOM from 'react-dom/client'
import Widget from './components/Widget'

let url = 'http://localhost/v1/chat/completions'
let model = 'mistral:7b-instruct'
let bearerToken = ''

const urlParams = new URLSearchParams(window.location.search)
const urlParamUrl = urlParams.get('url')
const urlParamModel = urlParams.get('model')
const urlParamToken = urlParams.get('token')

if (urlParamUrl) {
  url = urlParamUrl;
}

if (urlParamModel) {
  model = urlParamModel;
}

if (urlParamToken) {
  bearerToken = urlParamToken;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {
      bearerToken ? (
        <div
          style={{
            backgroundColor: '#070714',
          }}
        >
          <Widget
            url={url}
            model={model}
            bearerToken={bearerToken}
          />
        </div>
      ) : (
        <div>please include a ?token=XXX query param</div>
      )
    }
  </React.StrictMode>,
);
