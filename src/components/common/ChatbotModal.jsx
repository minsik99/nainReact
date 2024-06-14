import React, { useState } from 'react';
import styled from 'styled-components';

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  width: 400px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const ModalBody = styled.div`
  margin-bottom: 20px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MessageList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
`;

const Message = styled.div`
  background: ${props => (props.isUser ? '#e1ffc7' : '#f0f0f0')};
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  align-self: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
`;

const InputContainer = styled.div`
  display: flex;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px 0 0 5px;
`;

const SendButton = styled.button`
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
  &:hover {
    background: #0056b3;
  }
`;

const ChatbotModal = ({ show, onClose, title }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { content: input, isUser: true };
    setMessages([...messages, newMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.message) {
        setMessages([...messages, newMessage, { content: data.message, isUser: false }]);
      }
    } catch (error) {
      console.error('Failed to fetch response from API', error);
    }
  };

  if (!show) return null;

  return (
    <ModalBackground onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <ModalBody>
          <ChatContainer>
            <MessageList>
              {messages.map((msg, index) => (
                <Message key={index} isUser={msg.isUser}>
                  {msg.content}
                </Message>
              ))}
            </MessageList>
            <InputContainer>
              <Input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
              />
              <SendButton onClick={handleSendMessage}>Send</SendButton>
            </InputContainer>
          </ChatContainer>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContainer>
    </ModalBackground>
  );
};

export default ChatbotModal;
