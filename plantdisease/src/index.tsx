import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import aws_exports from './aws-exports'
import { Amplify } from 'aws-amplify'
import { Layout } from './Layout'
Amplify.configure(aws_exports)

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Layout>
      <App />
    </Layout>
  </React.StrictMode>
)

reportWebVitals()
