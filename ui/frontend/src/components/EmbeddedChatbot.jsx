import React from 'react';
import {Bullseye, Brand, DropdownList, DropdownItem, Page, Masthead, MastheadMain, MastheadBrand, MastheadLogo, PageSidebarBody, PageSidebar, MastheadToggle, PageToggleButton, SkipToContent, Alert, AlertActionCloseButton} from '@patternfly/react-core';
import Chatbot, {ChatbotDisplayMode} from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import ChatbotFooter, {ChatbotFootnote} from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message from '@patternfly/chatbot/dist/dynamic/Message';
import ChatbotConversationHistoryNav from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import ChatbotHeader, {ChatbotHeaderMenu, ChatbotHeaderMain, ChatbotHeaderTitle, ChatbotHeaderActions, ChatbotHeaderSelectorDropdown} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';
import {BarsIcon} from '@patternfly/react-icons';
import userAvatar from '../assets/user_avatar.svg';
import patternflyAvatar from '../assets/patternfly_avatar.jpg';
import LlamaStackClient from 'llama-stack-client';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';

// Initialize Llama Stack Client
// Using the proxied endpoint to avoid CORS issues
const llamaClient = new LlamaStackClient({
  baseURL: window.location.origin + '/api/llama-stack'
});

// Debug the client to see configuration in console
console.log('LlamaStackClient initialized with proxied URL:', {
  baseURL: llamaClient.baseURL
});

const footnoteProps = {
  label: 'Lightspeed uses AI. Check for mistakes.',
  popover: {
    title: 'Verify accuracy',
    description: `While Lightspeed strives for accuracy, there's always a possibility of errors. It's a good practice to verify critical information from reliable sources, especially if it's crucial for decision-making or actions.`,
    bannerImage: {
      src: 'https://cdn.dribbble.com/userupload/10651749/file/original-8a07b8e39d9e8bf002358c66fce1223e.gif',
      alt: 'Example image for footnote popover'
    },
    cta: {
      label: 'Got it',
      onClick: () => {
        alert('Do something!');
      }
    },
    link: {
      label: 'Learn more',
      url: 'https://www.redhat.com/'
    }
  }
};
const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

Here is an inline code - \`() => void\`

Here is some YAML code:

~~~yaml
apiVersion: helm.openshift.io/v1beta1/
kind: HelmChartRepository
metadata:
  name: azure-sample-repo0oooo00ooo
spec:
  connectionConfig:
  url: https://raw.githubusercontent.com/Azure-Samples/helm-charts/master/docs
~~~

Here is some JavaScript code:

~~~js
import React from 'react';

const MessageLoading = () => (
  <div className="pf-chatbot__message-loading">
    <span className="pf-chatbot__message-loading-dots">
      <span className="pf-v6-screen-reader">Loading message</span>
    </span>
  </div>
);

export default MessageLoading;

~~~
`;
const date = new Date(); 
const initialMessages = [{
    id: '1',
    role: 'bot',
    content: 'Hello RHOAI user, I heard that you are testing your model deployed on Llama Stack; do you want to give it a try?',
    name: 'Bot',
    avatar: patternflyAvatar,
    timestamp: date.toLocaleString(),
    avatarProps: {
      isBordered: true
    }
  }
];
const welcomePrompts = [{
    title: 'Topic 1',
    message: 'Helpful prompt for Test your Model'
  }, {
    title: 'Topic 2',
    message: 'Helpful prompt for Test your Model'
}];
const initialConversations = {
  Today: [{
    id: '1',
    text: 'Hello, can you give me an example of what you can do?'
  }],
  'This month': [{
    id: '2',
    text: 'Enterprise Linux installation and setup'
  }, {
    id: '3',
    text: 'Troubleshoot system crash'
  }],
  March: [{
    id: '4',
    text: 'Ansible security and updates'
  }, {
    id: '5',
    text: 'Red Hat certification'
  }, {
    id: '6',
    text: 'Lightspeed user documentation'
  }],
  February: [{
    id: '7',
    text: 'Crashing pod assistance'
  }, {
    id: '8',
    text: 'OpenShift AI pipelines'
  }, {
    id: '9',
    text: 'Updating subscription plan'
  }, {
    id: '10',
    text: 'Red Hat licensing options'
  }],
  January: [{
    id: '11',
    text: 'RHEL system performance'
  }, {
    id: '12',
    text: 'Manage user accounts'
  }]
};
const customStyles = `
  .pf-chatbot__footer-container {
    width: 100% !important;
  }
`;
export const EmbeddedChatbot = () => {
  const [messages, setMessages] = React.useState(initialMessages);
  const [selectedModel, setSelectedModel] = React.useState('Llama 3.0');
  const [isSendButtonDisabled, setIsSendButtonDisabled] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [conversations, setConversations] = React.useState(initialConversations);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState();
  const scrollToBottomRef = React.useRef(null);
  const historyRef = React.useRef(null);
  const displayMode = ChatbotDisplayMode.embedded;
  
  // Add custom styles for the chatbot container
  const chatbotContainerStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };
  
  // Add state for the alert
  const [showAlert, setShowAlert] = React.useState(true);
  // Toggle for streaming response
  const [useStreaming, setUseStreaming] = React.useState(true);
  
  React.useEffect(() => {
    if (messages.length > 2) {
      scrollToBottomRef.current?.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [messages]);
  
  const onSelectModel = (_event, value) => {
    setSelectedModel(value);
  };
  
  const generateId = () => {
    const id = Date.now() + Math.random();
    return id.toString();
  };
  
  const handleSend = message => {
    setIsSendButtonDisabled(true);
    const newMessages = [];
    messages.forEach(message => {
      if (message) {
        newMessages.push(message);
      }
    });
    const date = new Date();
    newMessages.push({
      id: generateId(),
      role: 'user',
      content: message,
      name: 'User',
      avatar: userAvatar,
      timestamp: date.toLocaleString(),
      avatarProps: {
        isBordered: true
      }
    });
    
    const botMessageId = generateId();
    newMessages.push({
      id: botMessageId,
      role: 'bot',
      content: '',
      name: 'Bot',
      avatar: patternflyAvatar,
      isLoading: true,
      timestamp: date.toLocaleString()
    });
    
    setMessages(newMessages);
    setAnnouncement(`Message from User: ${message}. Message from Bot is loading.`);
    
    // Get the model based on the selected dropdown option
    const getModelId = () => {
      switch(selectedModel) {
        case 'Llama 3.0':
          return 'llama3.2:3b'; // Using your specified model
        case 'Granite 7B':
          return 'granite-31-1b-a400m-instruct-v1';
        case 'Mistral 3B':
          return 'mistral-3b';
        default:
          return 'llama3.2:3b'; // Default to Llama model
      }
    };
    
    const modelId = getModelId();
    console.log('Using model:', modelId);

    // Prepare the chat completion request for Llama Stack Client
    const chatRequest = {
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ],
      model_id: modelId,
      temperature: 0.7,
      max_tokens: 500,
      stream: useStreaming // Enable streaming if the toggle is on
    };

    console.log('Sending request to Llama Stack with model_id:', modelId, 'streaming:', useStreaming);

    if (useStreaming) {
      // Simplified streaming implementation
      try {
        // We need to use the original botMessageId that was already added to messages
        // No need to generate a new one as it will create a duplicate message
        
        // Update the existing message to show connecting status
        const loadedMessages = [...newMessages].filter(msg => msg !== undefined);
        const botMessageIndex = loadedMessages.findIndex((msg) => msg && msg.id === botMessageId);
        
        if (botMessageIndex !== -1 && loadedMessages[botMessageIndex]) {
          loadedMessages[botMessageIndex] = {
            ...loadedMessages[botMessageIndex],
            isLoading: true,
            content: 'Connecting to model...'
          };
          setMessages([...loadedMessages]);
        }
        
        // Accumulate the full response
        let fullResponse = '';
        
        llamaClient.inference.chatCompletion(chatRequest)
          .then(async stream => {
            // Process the stream
            for await (const chunk of stream) {
              if (chunk.event && chunk.event.delta && chunk.event.delta.text) {
                fullResponse += chunk.event.delta.text;
                console.log('Added content chunk');
              }
            }
            
            console.log('Stream complete, updating message with full response');
            
            // When stream is complete, update the message once
            setMessages(prevMessages => {
              const messagesArray = [...prevMessages];
              const botMsgIndex = messagesArray.findIndex(msg => msg && msg.id === botMessageId);
              
              if (botMsgIndex !== -1) {
                console.log('Found message to update at index:', botMsgIndex);
                messagesArray[botMsgIndex] = {
                  ...messagesArray[botMsgIndex],
                  content: fullResponse || 'No content received from model.',
                  isLoading: false,
                  avatar: patternflyAvatar,
                  timestamp: date.toLocaleString(),
                  actions: {
                    positive: { onClick: () => console.log('Good response') },
                    negative: { onClick: () => console.log('Bad response') },
                    copy: { onClick: () => console.log('Copy') },
                    share: { onClick: () => console.log('Share') },
                    listen: { onClick: () => console.log('Listen') },
                  }
                };
              } else {
                console.warn('Could not find message with ID', botMessageId, 'adding a new one');
                messagesArray.push({
                  id: botMessageId,
                  role: 'bot',
                  content: fullResponse || 'No content received from model.',
                  name: 'Bot',
                  isLoading: false,
                  avatar: patternflyAvatar,
                  timestamp: date.toLocaleString(),
                  actions: {
                    positive: { onClick: () => console.log('Good response') },
                    negative: { onClick: () => console.log('Bad response') },
                    copy: { onClick: () => console.log('Copy') },
                    share: { onClick: () => console.log('Share') },
                    listen: { onClick: () => console.log('Listen') },
                  }
                });
              }
              return messagesArray;
            });
            
            setAnnouncement(`Message from Bot has finished loading.`);
            setIsSendButtonDisabled(false);
          })
          .catch(error => {
            console.error('Error streaming from Llama Stack API:', error);
            handleStreamingError(error, botMessageId, newMessages, date);
          });
      } catch (error) {
        console.error('Error in streaming setup:', error);
        handleStreamingError(error, botMessageId, newMessages, date);
      }
    } else {
      // Non-streaming implementation
      llamaClient.inference.chatCompletion(chatRequest)
        .then(response => {
          // Update the bot message with the API response
          const loadedMessages = [...newMessages].filter(msg => msg !== undefined);
          const botMessageIndex = loadedMessages.findIndex((msg) => msg && msg.id === botMessageId);

          if (botMessageIndex !== -1 && loadedMessages[botMessageIndex]) {
            loadedMessages[botMessageIndex] = {
              id: botMessageId,
              role: 'bot',
              content: response.choices[0].message.content,
              name: 'Bot',
              isLoading: false,
              avatar: patternflyAvatar,
              timestamp: date.toLocaleString(),
              actions: {
                positive: { onClick: () => console.log('Good response') },
                negative: { onClick: () => console.log('Bad response') },
                copy: { onClick: () => console.log('Copy') },
                share: { onClick: () => console.log('Share') },
                listen: { onClick: () => console.log('Listen') },
              },
            };
            setMessages([...loadedMessages]);
            // make announcement to assistive devices that new message has loaded
            setAnnouncement(`Message from Bot: ${response.choices[0].message.content}`);
          } else {
            console.warn('Could not find message with ID', botMessageId, 'in loadedMessages');
          }
          setIsSendButtonDisabled(false);
        })
        .catch(error => {
          console.error('Error calling Llama Stack API:', error);
          handleStreamingError(error, botMessageId, newMessages, date);
        });
    }
  };
  
  // Helper function to handle errors in both streaming and non-streaming modes
  const handleStreamingError = (error, botMessageId, messages, date) => {
    console.error('Error in streaming response:', error);
    
    // Update the message with error information
    setMessages(prevMessages => {
      // Try to find the message we were updating
      const updatedMessages = [...prevMessages];
      const botMessageIndex = updatedMessages.findIndex(msg => msg.id === botMessageId);
      
      if (botMessageIndex !== -1) {
        // Update the existing message with error info
        updatedMessages[botMessageIndex] = {
          ...updatedMessages[botMessageIndex],
          content: "Sorry, I encountered an error while responding.",
          isLoading: false
        };
      } else {
        // Add a new message if we can't find the one we were updating
        updatedMessages.push({
          id: botMessageId || generateId(),
          role: 'bot',
          content: "Sorry, I encountered an error while responding.",
          name: 'Bot',
          isLoading: false,
          avatar: patternflyAvatar,
          timestamp: date.toLocaleString()
        });
      }
      
      return updatedMessages;
    });
  };
  
  const findMatchingItems = targetValue => {
    let filteredConversations = Object.entries(initialConversations).reduce((acc, [key, items]) => {
      const filteredItems = items.filter(item => item.text.toLowerCase().includes(targetValue.toLowerCase()));
      if (filteredItems.length > 0) {
        acc[key] = filteredItems;
      }
      return acc;
    }, {});
    if (Object.keys(filteredConversations).length === 0) {
      filteredConversations = [{
        id: '13',
        noIcon: true,
        text: 'No results found'
      }];
    }
    return filteredConversations;
  };
  const masthead = <Masthead>
    
      <MastheadMain>
        <MastheadToggle>
          <PageToggleButton variant="plain" aria-label="Global navigation" isSidebarOpen={isSidebarOpen} onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} id="fill-nav-toggle">
            <BarsIcon />
          </PageToggleButton>
        </MastheadToggle>
        <MastheadBrand>
          <MastheadLogo href="#" target="_blank">
            Chatbot
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
    </Masthead>;
  const sidebar = <PageSidebar isSidebarOpen={isSidebarOpen} id="fill-sidebar">
      <PageSidebarBody>Navigation</PageSidebarBody>
    </PageSidebar>;
  const skipToChatbot = event => {
    event.preventDefault();
    if (historyRef.current) {
      historyRef.current.focus();
    }
  };
  const skipToContent = <SkipToContent href="#" onClick={skipToChatbot}>
      Skip to chatbot
    </SkipToContent>;
  return (<>
  <style>{customStyles}</style>
  
  {/* Regular alert at the top of the chatbot container */}
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
  
    
    <Chatbot displayMode={displayMode}>
      <ChatbotConversationHistoryNav displayMode={displayMode} onDrawerToggle={() => {
        setIsDrawerOpen(!isDrawerOpen);
        setConversations(initialConversations);
      }} isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen} activeItemId="1" onSelectActiveItem={(e, selectedItem) => console.log(`Selected history item with id ${selectedItem}`)} conversations={conversations} onNewChat={() => {
        setIsDrawerOpen(!isDrawerOpen);
        setMessages([]);
        setConversations(initialConversations);
      }} handleTextInputChange={value => {
        if (value === '') {
          setConversations(initialConversations);
        }
        const newConversations = findMatchingItems(value);
        setConversations(newConversations);
      }} drawerContent={<>
                <ChatbotHeader>
                  <ChatbotHeaderMain>
                    <ChatbotHeaderMenu ref={historyRef} aria-expanded={isDrawerOpen} onMenuToggle={() => setIsDrawerOpen(!isDrawerOpen)} />
                    
                  </ChatbotHeaderMain>
                  <ChatbotHeaderActions>
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                      <span style={{ marginRight: '8px', fontSize: '14px' }}>Streaming:</span>
                      <label className="pf-c-switch">
                        <input 
                          className="pf-c-switch__input" 
                          type="checkbox" 
                          id="streaming-toggle"
                          checked={useStreaming}
                          onChange={() => setUseStreaming(!useStreaming)}
                          aria-label="Toggle streaming responses" 
                        />
                        <span className="pf-c-switch__toggle">
                          <span className="pf-c-switch__toggle-icon"></span>
                        </span>
                      </label>
                    </div>
                    <ChatbotHeaderSelectorDropdown value={selectedModel} onSelect={onSelectModel}>
                      <DropdownList>
                        <DropdownItem value="Llama 3.0" key="llama">
                          Llama 3.0
                        </DropdownItem>
                        <DropdownItem value="Granite 7B" key="granite">
                          Granite 7B
                        </DropdownItem>
                        <DropdownItem value="Mistral 3B" key="mistral">
                          Mistral 3B
                        </DropdownItem>
                      </DropdownList>
                    </ChatbotHeaderSelectorDropdown>
                  </ChatbotHeaderActions>
                </ChatbotHeader>
                <ChatbotContent>
                  
                  <MessageBox announcement={announcement}>
                    <ChatbotWelcomePrompt title="Hello, Chatbot User" description="How may I help you today?" prompts={welcomePrompts} />
                   
                    {messages.filter(message => message !== undefined).map((message, index) => {
                      if (!message || !message.id) {
                        console.warn('Skipping invalid message object', message);
                        return null;
                      }
                      
                      if (index === messages.length - 1) {
                        return <>
                                    <div ref={scrollToBottomRef}></div>
                                    <Message key={message.id} {...message} />
                                  </>;
                      }
                      return <Message key={message.id} {...message} />;
                    })}
                  </MessageBox>
                </ChatbotContent>
                <ChatbotFooter>
                  <MessageBar onSendMessage={handleSend} hasMicrophoneButton isSendButtonDisabled={isSendButtonDisabled} />
                  <ChatbotFootnote {...footnoteProps} />
                </ChatbotFooter>
              </>}></ChatbotConversationHistoryNav>
    </Chatbot>
  </div>
  </>)
};
export default EmbeddedChatbot;