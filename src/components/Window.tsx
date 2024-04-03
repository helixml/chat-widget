import { FC, HTMLAttributes, useState } from 'react'
import { styled } from 'goober'
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

const ContentReplyWrapper = styled('div')`
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 20px;
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
  const [ error, setError ] = useState('')
  const [ reply, setReply ] = useState(`Title: The Enchanted Forest of Whispers

  Once upon a time, in a land far, far away, there existed an enchanted forest known as the "Forest of Whispers." This mystical place was nestled between the towering mountains and the endless expanse of crystal-clear blue waters. The forest was unlike any other place on earth, for it held secrets, wonders, and dangers that could only be found within its magical borders.
  
  In the heart of this enchanted forest dwelt a wise old tree named Eldertree. Eldertree was believed to be over a thousand years old, and he had seen and experienced the passage of countless seasons. He was revered by the creatures of the forest, who sought his guidance in matters both big and small. The other trees in the forest leaned on Eldertree for wisdom, while the forest animals relied on him for protection.
  
  One sunny day, as Eldertree stood tall and proud, a young bird named Chirpy fluttered towards him. Chirpy was an inquisitive bird and had heard tales of Eldertree's wisdom from his elders. He wanted to learn the secrets that only Eldertree knew.
  
  "Eldertree, oh wise one, may I ask you a question?" asked Chirpy. Eldertree, who was known for his patience, listened intently as the young bird spoke. "What lies beyond the enchanted forest of whispers?"
  
  Eldertree pondered for a moment before answering. "Beyond these forests lie wonders and dangers, Chirpy. There are lands of riches and beauty, but there are also lands filled with fearsome beasts and treacherous terrain."
  
  Chirpy was not deterred by Eldertree's answer. Instead, he became more curious. "I must see these wonders and dangers for myself," he declared determinedly. "Will you guide me on my journey, Eldertree?"
  
  Eldertree knew that Chirpy was young and inexperienced, but he also saw the fire burning within him. With a heavy heart, Eldertree agreed to accompany Chirpy on his journey beyond the enchanted forest. They bid farewell to their forest friends, who offered words of caution and encouragement.
  
  As they embarked on their journey, they encountered beautiful landscapes and terrifying creatures. Chirpy's eyes widened in awe as they came across fields of golden flowers that stretched as far as the eye could see, and his heart raced with fear when they faced an enormous dragon. Eldertree remained calm and guided Chirpy through every obstacle they encountered, teaching him valuable lessons along the way.
  
  But the journey was not without its challenges. They faced many dangers, both expected and unexpected. At times, they were forced to make difficult choices, such as deciding whether to risk their lives for a potential reward or to play it safe and continue on their journey. Chirpy learned that life was not always easy, but that every challenge presented an opportunity for growth.
  
  As they traveled further beyond the enchanted forest, Chirpy began to understand the wisdom Eldertree had imparted upon him. He realized that there were wonders to be found in every corner of the world and that the journey was just as important, if not more so, than the destination. Chirpy's perspective had changed, and he was no longer the same young bird who had asked Eldertree about the world beyond.
  
  Eventually, they returned to the enchanted forest, forever changed by their experiences. As they entered the forest, the other creatures gathered around them, curious as to what they had learned on their journey. Chirpy shared his stories with the others, inspiring them with tales of beauty, danger, and adventure.
  
  Eldertree listened proudly, knowing that Chirpy's experiences would be invaluable to the other creatures. He realized that by guiding Chirpy on his journey, he had not only helped a friend but also passed on knowledge that would benefit the entire forest. And so, the enchanted forest continued to thrive, with its secrets, wonders, and dangers shared amongst all who resided there.`)

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

  console.log(reply)

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
                >
                  Answer:
                </Subtitle>
              )
            }
          </ContentShrink>
          {
            reply && (
              <ContentReplyWrapper id="content-reply-wrapper">
                <Reply
                  theme={ useTheme }
                >
                  { reply }
                </Reply>
              </ContentReplyWrapper>
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
