import { FC, createElement, useState, useCallback } from 'react'
import { styled, setup } from 'goober'

import Window, { WindowTheme } from './Window'
import Search, { SearchTheme } from './Search'

setup(createElement)

const SearchContainer = styled("div")`
  background-color: #070714;
  padding: 200px;
`;

const Widget: FC<{
  windowTheme?: WindowTheme,
  searchTheme?: SearchTheme,
  placeholder?: string,
}> = ({
  windowTheme = {},
  searchTheme = {},
  placeholder,
}) => {
  const [ open, setOpen ] = useState(false)

  const handleQuery = useCallback((query: string) => {
    console.log('--------------------------------------------')
    console.log(query)
  }, [])

  return (
    <>
      <SearchContainer>
        <Search
          theme={ searchTheme }
          placeholder={ placeholder }
          onClick={ () => setOpen(true) }
        />
        <Window
          open={ open }
          modalTheme={ windowTheme }
          searchBoxTheme={ searchTheme }
          placeholder={ placeholder }
          onSubmit={ handleQuery }
          onClose={ () => {
            setOpen(false)
          }}
        />
      </SearchContainer>
    </>
  )
}

export default Widget
