import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'
import App from './App'
import i18n from './i18n' // Import i18n configuration
import {I18nextProvider} from 'react-i18next'
import {ThemeProvider, CssBaseline} from '@mui/material'
import theme from './styles/theme'

const rootElement = document.getElementById('root') as HTMLElement
const root = ReactDOM.createRoot(rootElement)

root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        <I18nextProvider i18n={i18n}>
            <App/>
        </I18nextProvider>
    </ThemeProvider>
)
