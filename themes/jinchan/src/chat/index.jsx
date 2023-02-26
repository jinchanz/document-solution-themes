import React, { useState } from 'react';
import { Avatar, Box, Button, Divider, Input, Loading } from '@alifd/next';

import './index.scss';

if (!window.localStorage.getItem("JINCHAN_CHAT_RECORDS")) {
  window.localStorage.setItem("JINCHAN_CHAT_RECORDS", "[]");
}

const chatRecords = JSON.parse(window.localStorage.getItem("JINCHAN_CHAT_RECORDS") || "[]");

const sendMessage = async (message) => {
  chatRecords.push({
    from: 'ME',
    message,
  });
  const response = await (await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Content: message,
    }),
  })).text();
  chatRecords.push({
    from: 'GPT',
    message: response,
  });
  window.localStorage.setItem("JINCHAN_CHAT_RECORDS", JSON.stringify(chatRecords));
};

console.log('chatRecords: ', chatRecords);
// eslint-disable-next-line react/prefer-stateless-function
const Chat = () => {

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  const handleBtnClick = async () => {
    setLoading(true);
    await sendMessage(input);
    setInput('');
    setLoading(false);
  };
  
  const onKeyDown = (e) => {
    if(e.keyCode === 13) {
        handleBtnClick();
    }
  };

  return <div style={{ minHeight: 'calc(100vh - 150px)'}}>
    <div style={{ minHeight: 'calc(100vh - 215px)'}}>
      <Box direction="column">
        {
          chatRecords.length ? chatRecords.map(record => {
            return <Box 
              align={record.from === 'ME' ? 'end' : 'left'}
              style={{
                padding: 10,
                background: record.from === 'ME' ? 'aliceblue' : 'antiquewhite',
              }}
            >
              <Avatar>{record.from}</Avatar>
              <span>{record.message}</span>
            </Box>;
          }) : <div style={{
            minHeight: 'calc(100vh - 215px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            好玩的东西~
          </div>
        }
      </Box>
    </div>

    <Divider />
    <div>
      <Loading inline visible={loading} style={{width: '100%'}}>
        <Box justify="space-between" direction="row" >
          <Input visible={!loading} style={{width: '100%', marginRight: 10}} value={input} onChange={setInput} onKeyDown={onKeyDown} />
          <Button visible={!loading} type="primary" onClick={handleBtnClick}>发送</Button>
        </Box>
      </Loading>
    </div>
  </div>;
};

export default Chat;
