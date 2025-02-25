import React from 'react';
import {Bullseye, Brand, DropdownList, DropdownItem, Page, Masthead, MastheadMain, MastheadBrand, MastheadLogo, PageSidebarBody, PageSidebar, MastheadToggle, PageToggleButton, SkipToContent} from '@patternfly/react-core';
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
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';
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
  role: 'user',
  content: 'Hello, can you give me an example of what you can do?',
  name: 'User',
  avatar: userAvatar,
  timestamp: date.toLocaleString(),
  avatarProps: {
    isBordered: true
  }
}];
const welcomePrompts = [{
//   title: 'Topic 1',
//   message: 'Helpful prompt for Topic 1'
// }, {
//   title: 'Topic 2',
//   message: 'Helpful prompt for Topic 2'
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
export const EmbeddedChatbot = () => {
  const [messages, setMessages] = React.useState(initialMessages);
  const [selectedModel, setSelectedModel] = React.useState('Granite 7B');
  const [isSendButtonDisabled, setIsSendButtonDisabled] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [conversations, setConversations] = React.useState(initialConversations);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [announcement, setAnnouncement] = React.useState();
  const scrollToBottomRef = React.useRef(null);
  const historyRef = React.useRef(null);
  const displayMode = ChatbotDisplayMode.embedded;
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
    messages.forEach(message => newMessages.push(message));
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
    newMessages.push({
      id: generateId(),
      role: 'bot',
      content: 'API response goes here',
      name: 'Bot',
      avatar: patternflyAvatar,
      isLoading: true,
      timestamp: date.toLocaleString()
    });
    setMessages(newMessages);
    setAnnouncement(`Message from User: ${message}. Message from Bot is loading.`);
    setTimeout(() => {
      const loadedMessages = [];
      newMessages.forEach(message => loadedMessages.push(message));
      loadedMessages.pop();
      loadedMessages.push({
        id: generateId(),
        role: 'bot',
        content: 'API response goes here',
        name: 'Bot',
        avatar: patternflyAvatar,
        isLoading: false,
        actions: {
          positive: {
            onClick: () => console.log('Good response')
          },
          negative: {
            onClick: () => console.log('Bad response')
          },
          copy: {
            onClick: () => console.log('Copy')
          },
          share: {
            onClick: () => console.log('Share')
          },
          listen: {
            onClick: () => console.log('Listen')
          }
        },
        timestamp: date.toLocaleString()
      });
      setMessages(loadedMessages);
      setAnnouncement(`Message from Bot: API response goes here`);
      setIsSendButtonDisabled(false);
    }, 5000);
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
  return <Page skipToContent={skipToContent} masthead={masthead} sidebar={sidebar} isContentFilled>
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
  }} drawerContent={
    <>
      <ChatbotHeader>
        <ChatbotHeaderMain>
          <ChatbotHeaderMenu ref={historyRef} aria-expanded={isDrawerOpen} onMenuToggle={() => setIsDrawerOpen(!isDrawerOpen)} />
        
        </ChatbotHeaderMain>
        <ChatbotHeaderActions>
          <ChatbotHeaderSelectorDropdown value={selectedModel} onSelect={onSelectModel}>
            <DropdownList>
              <DropdownItem value="Granite 7B" key="granite">
                Granite 7B
              </DropdownItem>
              <DropdownItem value="Llama 3.0" key="llama">
                Llama 3.0
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
          {messages.map((message, index) => {
            if (index === messages.length - 1) {
              return <React.Fragment key={message.id}>
                <div ref={scrollToBottomRef}></div>
                <Message {...message} />
              </React.Fragment>;
            }
            return <Message key={message.id} {...message} />;
          })}
        </MessageBox>
      </ChatbotContent>
      <ChatbotFooter>
        <MessageBar onSendMessage={handleSend} hasMicrophoneButton isSendButtonDisabled={isSendButtonDisabled} />
        {/* <ChatbotFootnote {...footnoteProps} /> */}
      </ChatbotFooter>
    </>
  }></ChatbotConversationHistoryNav>
      </Chatbot>
    </Page>;
};
export default EmbeddedChatbot;