# @helixai/chat-widget

![helix logo](helix_logo.png)

The `@helixai/chat-widget` is a highly customizable React component designed to provide interactive chat functionality within your application. It features a minimalist design that opens a modal window upon interaction, where users can submit questions and receive answers from a specified openAI compatible endpoint.

![screenshot](screenshot.png)

## Installation

To use the `@helixai/chat-widget` in your project, install it via npm:

```bash
npm install @helixai/chat-widget
```

or using yarn:

```bash
yarn add @helixai/chat-widget
```

## Usage

Import and use the `Widget` component in your React application:

```jsx
import React from 'react';
import Widget from '@helixai/chat-widget';

function App() {
  return (
    <div className="App">
      <Widget
        url="https://myopenaiendpoint.com"
        model="my_model_name"
        windowTheme={{ /* Optional window theme overrides */ }}
        searchTheme={{ /* Optional search theme overrides */ }}
      />
    </div>
  );
}

export default App;
```

### Props

- `url`: String. The endpoint URL for the remote API from which the answers will be fetched.
- `model`: String. Identifier for the specific model to be queried at the remote API.
- `bearerToken`: (Optional) String. Bearer token for authentication with the remote API, if required.
- `title`: (Optional) String. Title text for the chat window.
- `logo`: (Optional) String. URL of the logo image to display in the header.
- `placeholder`: (Optional) String. Placeholder text for the search input.
- `windowTheme`: (Optional) Object. Theme customization for the window component. See the Theme Customization section below for details.
- `searchTheme`: (Optional) Object. Theme customization for the search input. See the Theme Customization section below for details.

## Theme Customization

Customize the appearance of the chat widget and its components using the `windowTheme` and `searchTheme` props. Each theme object allows you to override default styles to match your application's design.

### Window Theme Options

- `logoWidth`: Width of the logo inside the header.
- `backdropColor`: Color of the modal backdrop.
- `backgroundColor`: Background color of the window.
- `width`: Width of the window.
- `verticalMargin`: Vertical margin of the window.
- `borderRadius`: Border radius of the window.
- `shadow`: Box shadow for the window.
- `fontFamily`: Font family for text inside the window.
- `headerTextColor`: Text color for the header.
- `headerFontSize`: Font size for the header text.
- `headerPadding`: Padding inside the header.
- `errorTextColor`: Text color for error messages.
- `errorFontSize`: Font size for error messages.
- `contentBoxShadow`: Box shadow for the content area inside the window.
- `contentPadding`: Padding inside the content area.
- `replyTextColor`: Text color for the reply messages.
- `replyFontSize`: Font size for the reply messages.
- `subtitleTextColor`: Text color for subtitles.
- `subtitleFontSize`: Font size for subtitles.
- `footerPadding`: Padding inside the footer.
- `closeButtonBorderRadius`: Border radius of the close button.
- `closeButtonColor`: Color of the close button.
- `closeButtonPadding`: Padding of the close button.
- `closeButtonFontSize`: Font size of the close button text.

### Search Theme Options

- `borderColor`: Border color of the search input.
- `backgroundColor`: Background color of the search input.
- `hoverBorderColor`: Border color of the search input on hover.
- `borderRadius`: Border radius of the search input.
- `iconPadding`: Padding around the search icon.
- `iconColor`: Color of the search icon.
- `textPadding`: Padding inside the search input for text.
- `textSize`: Font size of the text inside the search input.
- `fontFamily`: Font family of the search input text.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Feel free to adjust any part of this README to better suit the specifics of your project or to add any additional information you deem necessary for your users.