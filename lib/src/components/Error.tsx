import { FC } from 'react'
import { styled } from 'goober'

const ErrorContainer = styled('div')`
background-color: red;
color: white;
`

const Error: FC<{
  text: string,
}> = ({
  text,
}) => {
  return (
    <ErrorContainer>
      { text }
    </ErrorContainer>
  )
}

export default Error
