import { styled } from 'goober'
import throttle from 'lodash/throttle'
import { FC, HTMLAttributes, useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import SearchBar, { SearchTheme } from './Search'
import useStreamingLLM from './useStreamingLLM'

export interface WindowTheme {
  logoWidth?: string,
  backdropColor?: string,
  backgroundColor?: string,
  width?: string,
  verticalMargin?: string,
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
  verticalMargin: '50px',
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
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
`);

//max-height: calc(100% - ${theme.verticalMargin});
const Window = styled<ThemeElement>(({ theme, ...props }) => <div {...props} /> )(({ theme }) => `
  margin-top: ${theme.verticalMargin};
  width: ${theme.width};
  max-width: 90%;
  max-height: calc(100% - ${theme.verticalMargin} - 50px);
  border-radius: ${theme.borderRadius};
  box-shadow: ${theme.shadow};
  background: ${theme.backgroundColor};
  z-index: 1001;
  display: flex;
  flex-direction: column;
`)

const Header = styled<ThemeElement>(({ theme, ...props }) => <div {...props} /> )(({ theme }) => `
  padding: 16px;
  color: ${theme.headerTextColor};
  font-size: ${theme.headerFontSize};
  font-family: ${theme.fontFamily};
  border-top-left-radius: ${theme.borderRadius};
  border-top-right-radius: ${theme.borderRadius};
  padding: ${theme.headerPadding};
  flex-grow: 0;
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
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
`)

const ContentShrink = styled('div')`
  flex-grow: 0;
`;

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
  line-height: 1.6;

  pre {
    background-color: #000;
    color: #fff;
    padding: 10px;
  }

  code {
    background-color: #000;
    color: #fff;
    padding: 4px;
  }
`)

const Error = styled<ThemeElement>(({ theme, ...props }) => <div {...props} /> )(({ theme }) => `
  font-family: ${theme.fontFamily};
  font-size: ${theme.errorFontSize};
  color: ${theme.errorTextColor};
  margin-top: 20px;
`)

const Footer = styled<ThemeElement>(({ theme, ...props }) => <div {...props} /> )(({ theme }) => `
  flex-grow: 0;
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
  const divRef = useRef<HTMLDivElement>(null)
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

  const handleScroll = throttle(() => {
    const divElement = divRef.current
    if(!divElement) return
    const scrollHeight = divElement.scrollHeight;
    const isScrolledToBottom = divElement.scrollHeight - divElement.clientHeight === divElement.scrollTop;
    if (!isScrolledToBottom) {
      setTimeout(() => {
        divElement.scrollTo({ top: scrollHeight, behavior: 'smooth' });
      }, 50)
    }
  }, 100, {
    leading: true,
    trailing: true,
  })

  useEffect(() => {
    if(!reply) return
    handleScroll()
  }, [
    reply,
  ])

  return (
    <Backdrop
      theme={ useTheme }
      onClick={ onClose }
    >
      <Window
        id="header"
        theme={ useTheme }
        onClick={(e) => e.stopPropagation()}
      >
        <Header
          id="header"
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
          id="content"
          theme={ useTheme }
        >
          <ContentShrink id="content-shrink">
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
              error && (
                <Error
                  theme={ useTheme }
                >
                  { error }
                </Error>
              )
            }
            {
              reply && (
                <Subtitle
                  theme={ useTheme }
                  marginTop="20px"
                  marginBottom="10px"
                >
                  Answer:
                </Subtitle>
              )
            }
          </ContentShrink>
          {
            reply && (
              <div
                id="content-reply-wrapper"
                ref={ divRef }
                style={{
                  flexGrow: '1',
                  overflowY: 'auto',
                  paddingRight: '20px',
                }}
              >
                <Reply
                  theme={ useTheme }
                >
                  <Markdown
                    children={reply}
                  />
                </Reply>
              </div>
            )
          }
        </Content>
        <Footer
          id="footer"
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
