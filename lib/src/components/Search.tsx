import { styled } from 'goober'
import { FC, HTMLAttributes, useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import {
  HourglassIcon,
  MagnifyingGlassIcon,
  RightArrow,
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
  textColor?: string,
  fontFamily?: string,
}

type SearchThemeRequired = Required<SearchTheme>

type ThemeElement = {
  theme: SearchThemeRequired,
} & HTMLAttributes<HTMLDivElement>

export const DEFAULT_THEME: SearchThemeRequired = {
  borderColor: 'transparent',
  backgroundColor: 'rgba(235, 237, 240)',
  hoverBorderColor: 'rgba(255, 255, 255, 1)',
  borderRadius: '50px',
  iconPadding: '5px',
  iconColor: 'rgba(28, 30, 33, 1)',
  textPadding: '5px ',
  textSize: '14pt',
  textColor: 'rgba(28, 30, 33, 1)',
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
    color: ${theme.textColor};
    font-family: ${theme.fontFamily};
    font-size: ${theme.textSize};
  }
`)

const SearchIcon = styled<ThemeElement>(({ theme, ...props }) => <div {...props} /> )(({ theme }) => `
  padding: ${theme.iconPadding};
  background: none;
  border: none;
  outline: none;
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
  onEsc?: () => void,
}> = ({
  theme,
  autoFocus = false,
  loading = false,
  placeholder = 'Search...',
  onClick,
  onSubmit,
  onEsc = () => {},
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

  useHotkeys('esc', onEsc, [])

  return (
    <InputContainer
      theme={useTheme}
      opacity={loading ? '0.5' : '1'}
      onClick={onClick}
    >
      <SearchIcon
        theme={useTheme}
        onClick={() => {
          if (onSubmit) {
            onSubmit(query)
          }
        }}
      >
        <MagnifyingGlassIcon />
      </SearchIcon>
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
          if (e.key === 'Escape') {
            onEsc()
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
