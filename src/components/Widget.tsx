import { FC, createElement, useState } from 'react'
import { setup } from 'goober'

import Window, { WindowTheme } from './Window'
import Search, { SearchTheme } from './Search'

setup(createElement)

const Widget: FC<{
  url: string,
  model: string,
  bearerToken?: string,
  windowTheme?: WindowTheme,
  searchTheme?: SearchTheme,
  title?: string,
  placeholder?: string,
  logo?: string,
}> = ({
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
