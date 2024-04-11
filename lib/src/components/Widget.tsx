import { FC, createElement, useState } from 'react'
import { setup } from 'goober'

import Window, { WindowTheme } from './Window'
import Search, { SearchTheme } from './Search'
import Error from './Error'

setup(createElement)

export interface WidgetProps {
  url: string,
  model: string,
  bearerToken?: string,
  windowTheme?: WindowTheme,
  searchTheme?: SearchTheme,
  title?: string,
  placeholder?: string,
  logo?: string,
}

const Widget: FC<WidgetProps> = ({
  url,
  model,
  bearerToken,
  windowTheme = {},
  searchTheme = {},
  title,
  placeholder,
  logo,
}) => {
  const [ open, setOpen ] = useState(false)

  if(!url) {
    return (
      <Error text="no url config found" />
    )
  }

  if(!model) {
    return (
      <Error text="no model config found" />
    )
  }
  
  return (
    <>
      <Search
        theme={ searchTheme }
        placeholder={ placeholder }
        onClick={ () => setOpen(true) }
      />
      {
        open && (
          <Window
            url={ url }
            model={ model }
            bearerToken={ bearerToken }
            title={ title }
            logo={ logo }
            modalTheme={ windowTheme }
            searchBoxTheme={ searchTheme }
            placeholder={ placeholder }
            onClose={ () => {
              setOpen(false)
            }}
          />
        )
      }
    </>
  )
}

export default Widget
