import { FC, HTMLAttributes, useState } from 'react'
import { styled } from 'goober'
import SearchBar, { SearchTheme } from './Search'
import useStreamingLLM from './useStreamingLLM'

export interface WindowTheme {
  logoWidth?: string,
  backdropColor?: string,
  backgroundColor?: string,
  width?: string,
  borderRadius?: string,
  shadow?: string,
  fontFamily?: string,
  headerTextColor?: string,
  headerFontSize?: string,
  headerPadding?: string,
  errorTextColor?: string,
  errorFontSize?: string,
  contentBoxShadow?: string,
  contentPadding?: string,
  replyTextColor?: string,
  replyFontSize?: string,
  subtitleTextColor?: string,
  subtitleFontSize?: string,
  footerPadding?: string,
  closeButtonBorderRadius?: string,
  closeButtonColor?: string,
  closeButtonPadding?: string,
  closeButtonFontSize?: string,
}

type WindowThemeRequired = Required<WindowTheme>

type ThemeElement = {
  theme: WindowThemeRequired,
} & HTMLAttributes<HTMLDivElement>
 
export const DEFAULT_THEME: WindowThemeRequired = {
  logoWidth: '32px',
  backdropColor: 'rgba(0, 0, 0, 0.5)',
  backgroundColor: '#383838',
  width: '800px',
  borderRadius: '8px',
  shadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px;',
  fontFamily: 'Assistant,Helvetica,Arial,sans-serif',
  headerTextColor: 'white',
  headerFontSize: '1.25rem',
  headerPadding: '30px',
  subtitleTextColor: '#aaa',
  subtitleFontSize: '1rem',
  errorTextColor: 'red',
  errorFontSize: '1rem',
  contentBoxShadow: '0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
  contentPadding: '30px',
  replyTextColor: 'white',
  replyFontSize: '1.1rem',
  footerPadding: '20px',
  closeButtonBorderRadius: '10px',
  closeButtonColor: '#00bfe4',
  closeButtonPadding: '12px',
  closeButtonFontSize: '1.25rem',
}

const Backdrop = styled<ThemeElement>(({ theme, ...props }) => <div {...props} /> )(({ theme }) => `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${theme.backdropColor};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`);

const Window = styled<ThemeElement>(({ theme, ...props }) => <div {...props} /> )(({ theme }) => `
  width: ${theme.width};
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.shadow};
  background: ${theme.backgroundColor};
  z-index: 1001;
`)

const Header = styled<ThemeElement>(({ theme, ...props }) => <div {...props} /> )(({ theme }) => `
  padding: 16px;
  color: ${theme.headerTextColor};
  font-size: ${theme.headerFontSize};
  font-family: ${theme.fontFamily};
  border-top-left-radius: ${theme.borderRadius};
  border-top-right-radius: ${theme.borderRadius};
  padding: ${theme.headerPadding};
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    flex: 0;
    width: ${theme.logoWidth};
    margin-right: 16px;
  }
`)

const Title = styled<ThemeElement>(({ theme, ...props }) => <div {...props} /> )(() => `
  flex: 1;
  margin: 0;
  padding-top: 5px;
`)

const Content = styled<ThemeElement>(({ theme, ...props }) => <div {...props} /> )(({ theme }) => `
  padding: ${theme.contentPadding};
  boxShadow: ${theme.contentBoxShadow};
`)

const Subtitle = styled<ThemeElement & {marginBottom?: string, marginTop?: string}>(({ theme, marginBottom, marginTop, ...props }) => <div {...props} /> )(({ theme, marginBottom = '20px', marginTop = '0px' }) => `
  font-family: ${theme.fontFamily};
  font-size: ${theme.subtitleFontSize};
  color: ${theme.subtitleTextColor};
  margin-bottom: ${marginBottom};
  margin-top: ${marginTop};
`)

const Reply = styled<ThemeElement>(({ theme, ...props }) => <div {...props} /> )(({ theme }) => `
  font-family: ${theme.fontFamily};
  font-size: ${theme.replyFontSize};
  color: ${theme.replyTextColor};
  margin-top: 20px;
`)

const Error = styled<ThemeElement>(({ theme, ...props }) => <div {...props} /> )(({ theme }) => `
  font-family: ${theme.fontFamily};
  font-size: ${theme.errorFontSize};
  color: ${theme.errorTextColor};
  margin-top: 20px;
`)

const Footer = styled<ThemeElement>(({ theme, ...props }) => <div {...props} /> )(({ theme }) => `
  padding: ${theme.footerPadding};
  text-align: right;
`)

const CloseButton = styled<{
  theme: WindowThemeRequired,
} & HTMLAttributes<HTMLButtonElement>>(({ theme, ...props }) => <button {...props} /> )(({ theme }) => `
  background: none;
  border: 1px solid ${theme.closeButtonColor};
  color: ${theme.closeButtonColor};
  padding: ${theme.closeButtonPadding};
  border-radius: ${theme.closeButtonBorderRadius};
  cursor: pointer;
  font-size: ${theme.closeButtonFontSize};
`)

const SimpleWindow: FC<{
  modalTheme: WindowTheme,
  searchBoxTheme: SearchTheme,
  url: string,
  model: string,
  bearerToken?: string,
  title?: string,
  placeholder?: string,
  logo?: string,
  onClose?: () => void,
} & WindowTheme> = ({
  modalTheme = {},
  searchBoxTheme = {},
  url,
  model,
  bearerToken,
  title = 'Ask Helix',
  placeholder,
  logo = 'https://app.tryhelix.ai/img/logo.png',
  onClose = () => {},
}) => {
  const [ error, setError ] = useState('')
  const [ reply, setReply ] = useState('')

  const useTheme = {
    ...DEFAULT_THEME,
    ...modalTheme,
  }

  const {
    loading,
    handleQuery,
  } = useStreamingLLM({
    url,
    model,
    bearerToken,
    onStart: () => {
      setReply('')
      setError('')
    },
    onChunk: (chunk) => {
      setReply(reply => reply + chunk)
    },
    onError: (err) => {
      setError(err)
    }
  })

  return (
    <Backdrop
      theme={ useTheme }
      onClick={ onClose }
    >
      <Window
        theme={ useTheme }
        onClick={(e) => e.stopPropagation()}
      >
        <Header
          theme={ useTheme }
        >
          {
            logo && (
              <img
                src={ logo }
              />
            )
          }
          <Title
            theme={ useTheme }
          >
            {title}
          </Title>
        </Header>
        <Content
          theme={ useTheme }
        >
          <Subtitle
            theme={ useTheme }
          >
            Your Query:
          </Subtitle>
          <SearchBar
            autoFocus
            loading={ loading }
            theme={ searchBoxTheme }
            placeholder={ placeholder }
            onSubmit={ handleQuery }
          />
          {
            reply && (
              <>
                <Subtitle
                  theme={ useTheme }
                  marginTop="20px"
                >
                  Answer:
                </Subtitle>
                <Reply
                  theme={ useTheme }
                >
                  { reply }
                </Reply>
              </>
            )
          }
          {
            error && (
              <Error
                theme={ useTheme }
              >
                { error }
              </Error>
            )
          }
        </Content>
        <Footer
          theme={ useTheme }
        >
          <CloseButton
            theme={ useTheme }
            onClick={ onClose }
          >
            Close
          </CloseButton>
        </Footer>
      </Window>
    </Backdrop>
  )
}

export default SimpleWindow
