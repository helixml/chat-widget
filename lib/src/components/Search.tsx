import { FC, HTMLAttributes, useEffect, useRef, useState } from 'react'
import { styled } from 'goober'
import {
  RightArrow,
  HourglassIcon,
} from './Icons'

export interface SearchTheme {
  borderColor?: string,
  backgroundColor?: string,
  hoverBorderColor?: string,
  borderRadius?: string,
  iconPadding?: string,
  iconColor?: string,
  textPadding?: string,
  textSize?: string,
  fontFamily?: string,
}

type SearchThemeRequired = Required<SearchTheme>

type ThemeElement = {
  theme: SearchThemeRequired,
} & HTMLAttributes<HTMLDivElement>

export const DEFAULT_THEME: SearchThemeRequired = {
  borderColor: 'rgba(255, 255, 255, 0.23)',
  backgroundColor: 'transparent',
  hoverBorderColor: 'rgba(255, 255, 255, 1)',
  borderRadius: '5px',
  iconPadding: '20px',
  iconColor: 'rgba(255, 255, 255, 1)',
  textPadding: '20px',
  textSize: '14pt',
  fontFamily: 'Arial',
}

const InputContainer = styled<ThemeElement & {opacity?: string}>(({ theme, opacity, ...props }) => <div {...props} /> )(({ theme, opacity = '1' }) => `
  display: flex;
  align-items: center;
  border: 1px solid ${theme.borderColor};
  border-radius: ${theme.borderRadius};
  background-color: ${theme.backgroundColor};
  padding-right: ${theme.iconPadding};
  opacity: ${opacity};
  &:hover {
    border-color: ${theme.hoverBorderColor};
  }

  input {
    flex-grow: 1;
    border: none;
    outline: none;
    padding: ${theme.textPadding};
    background-color: transparent;
    color: white;
    font-family: ${theme.fontFamily};
    font-size: ${theme.textSize};
  }
`)

const SearchIcon = styled<ThemeElement>(({ theme, ...props }) => <div {...props} /> )(({ theme }) => `
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.iconColor};
`)

const SearchBar: FC<{
  theme: SearchTheme,
  autoFocus?: boolean,
  loading?: boolean,
  placeholder?: string,
  onClick?: () => void,
  onSubmit?: (value: string) => void,
}> = ({
  theme,
  autoFocus = false,
  loading = false,
  placeholder = 'Ask a question...',
  onClick,
  onSubmit,
}) => {
  const [ query, setQuery ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const useTheme = {
    ...DEFAULT_THEME,
    ...theme,
  }
  useEffect(() => {
    if(!inputRef.current || !autoFocus) return
    inputRef.current.focus()
  }, [
    autoFocus,
  ])
  return (
    <InputContainer
      theme={useTheme}
      opacity={loading ? '0.5' : '1'}
      onClick={onClick}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSubmit) {
            onSubmit(query)
          }
        }}
        disabled={loading}
      />
      <SearchIcon
        theme={useTheme}
        onClick={() => {
          if (onSubmit) {
            onSubmit(query)
          }
        }}
      >
        {
          loading ? (
            <HourglassIcon />
          ) : (
            <RightArrow />
          )
        }
      </SearchIcon>
    </InputContainer>
  )
}

export default SearchBar
