import { FC, createElement, useState } from 'react'
import { styled, setup } from 'goober'

import Window, { WindowTheme } from './Window'
import Search, { SearchTheme } from './Search'

setup(createElement)

const SearchContainer = styled("div")`
  background-color: #070714;
  padding: 200px;
`;

const Widget: FC<{
  url: string,
  model: string,
  bearerToken?: string,
  windowTheme?: WindowTheme,
  searchTheme?: SearchTheme,
  placeholder?: string,
}> = ({
  url,
  model,
  bearerToken,
  windowTheme = {},
  searchTheme = {},
  placeholder,
}) => {
  const [ open, setOpen ] = useState(false)
  
  return (
    <>
      <SearchContainer>
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
              modalTheme={ windowTheme }
              searchBoxTheme={ searchTheme }
              placeholder={ placeholder }
              onClose={ () => {
                setOpen(false)
              }}
            />
          )
        }
      </SearchContainer>
    </>
  )
}

export default Widget
