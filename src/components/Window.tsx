import { FC, HTMLAttributes } from 'react'
import { styled } from 'goober'
import SearchBar, { SearchTheme } from './Search'

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
  contentBoxShadow?: string,
  contentPadding?: string,
  contentHeaderTextColor?: string,
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
  contentBoxShadow: '0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
  contentPadding: '30px',
  contentHeaderTextColor: '#aaa',
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

const ContentHeader = styled<ThemeElement>(({ theme, ...props }) => <div {...props} /> )(({ theme }) => `
  font-family: ${theme.fontFamily};
  color: ${theme.contentHeaderTextColor};
  margin-bottom: 20px;
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
  open?: boolean,
  title?: string,
  placeholder?: string,
  logo?: string,
  onSubmit?: (value: string) => void,
  onClose?: () => void,
} & WindowTheme> = ({
  modalTheme = {},
  searchBoxTheme = {},
  open = false,
  title = 'Ask Helix',
  placeholder,
  logo = 'https://app.tryhelix.ai/img/logo.png',
  onSubmit,
  onClose = () => {},
}) => {
  const useTheme = {
    ...DEFAULT_THEME,
    ...modalTheme,
  }
  if (!open) return null
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
          <ContentHeader
            theme={ useTheme }
          >
            Your Query:
          </ContentHeader>
          <SearchBar
            autoFocus
            theme={ searchBoxTheme }
            placeholder={ placeholder }
            onSubmit={ onSubmit }
          />
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
