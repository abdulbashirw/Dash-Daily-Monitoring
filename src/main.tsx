import { StrictMode } from 'react'
import { Node } from '@meonode/ui'
import Routes from '@src/routes'
import { Wrapper } from '@src/components/Wrapper.ts'
import '@src/assets/global.css'
import { render } from '@meonode/ui/client'
import '@fontsource/poppins/400.css'
import '@fontsource/poppins/800.css'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/500.css'

const App = Node(StrictMode, { children: Wrapper({ children: Routes() }) })
render(App, document.getElementById('root')!)
