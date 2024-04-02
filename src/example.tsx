import React from 'react'
import ReactDOM from 'react-dom/client'
import Widget from './components/Widget'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Widget
      url="http://localhost/v1/chat/completions"
      model="mistral:7b-instruct"
      bearerToken="XXX"
    />
  </React.StrictMode>,
)
