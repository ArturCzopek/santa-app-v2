import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'

const resources = {
    en: {
        translation: {
            'loginPage': {
                'title': 'Santa App',
                'loginWithGoogle': 'Login with Google'
            }
        }

    },
    pl: {
        translation: {
            'loginPage': {
                'title': 'Santa App',
                'loginWithGoogle': 'Zaloguj przez Google'
            }
        }

    },
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'pl', // Default language
        interpolation: {
            escapeValue: false,
        },
    })

export default i18n
