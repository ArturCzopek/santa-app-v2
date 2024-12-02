import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'

const resources = {
    en: {
        translation: {
            greeting: 'Hello',
            login: 'Login',
            // Add other translations here
        },
    },
    pl: {
        translation: {
            greeting: 'Cześć',
            login: 'Zaloguj się',
            // Add other translations here
        },
    },
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // Default language
        interpolation: {
            escapeValue: false,
        },
    })

export default i18n
