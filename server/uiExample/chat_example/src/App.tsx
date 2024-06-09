import React, { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import ImageComponent from './ImageComponent';
import FileComponent from './FileComponent';
import ProfileComponent from './ProfileComponent';
import './App.css';
import { encryptMessage, decryptMessage } from './utils';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  avatar: string | null;
  age: number | null;
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  region: string | null;
  language: string | null;
  onlineStatus: boolean;
  biography: string | null;
  socialLinks: string[] | null;
  role: string;
  registrationDate: Date;
  lastLoginDate: Date | null;
  notifications: boolean;
}

interface Message {
  id: number;
  content: string;
  sender: User;
  filePath?: string;
  encryptedKeys: { userId: number; encryptedAESKey: string }[];
}

interface Room {
  id: number;
  adminUserId: string | number;
}

const App: React.FC = () => {
  const [currentRoom, setCurrentRoomId] = useState<Room | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [chats, setChats] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [selectedTab, setSelectedTab] = useState('');
  const [recipients, setRecipients] = useState<
    { userId: number; publicKey: string }[]
  >([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const messagesDisplayRef = useRef<HTMLDivElement>(null);
  const socketInstance = useRef<Socket | null>(null);
  const [expirationTime, setExpirationTimeValue] = useState<number | null>(
    null
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      connectWebSocket(token);
      updateAuthStatus();
    }
  }, []);

  const connectWebSocket = (token: string) => {
    if (!socketInstance.current) {
      socketInstance.current = io('http://localhost:3008', {
        auth: { token },
      });

      socketInstance.current.on('connect', () => {
        console.log('Connected to socket server');
      });

      socketInstance.current.on('room_created', ({ room }) => {
        setChats((prevChats) => [...prevChats, room]);
      });

      socketInstance.current.on('sendMessage', async ({ message }) => {
        try {
          setMessages((prevMessages) => {
            return [...prevMessages, message];
          });
        } catch (error) {
          console.error('Error decrypting message:', error);
        }
      });

      socketInstance.current.on('message_deleted', ({ messageId }) => {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== messageId)
        );
      });

      socketInstance.current.on('connect_error', (err) => {
        console.error(`Connection failed due to ${err.message}`);
      });

      return () => {
        if (socketInstance.current) {
          socketInstance.current.disconnect();
          socketInstance.current = null;
        }
      };
    }
  };

  const updateAuthStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const user = JSON.parse(localStorage.getItem('user')!);
      setCurrentUser(user);
      fetchAllUsers();
      fetchAllChats();
    } else {
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    fetch('http://localhost:3003/logout', {
      method: 'GET',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUsers([]);
        setChats([]);
        setCurrentUser(null);
        if (socketInstance.current) {
          socketInstance.current.disconnect();
          socketInstance.current = null;
        }
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  };

  const openTab = (tabName: string) => {
    setSelectedTab(tabName);
    if (tabName === 'AllUsers') {
      fetchAllUsers();
    } else if (tabName === 'AllChats') {
      fetchAllChats();
    }
  };

  const fetchAllUsers = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (!token && user) {
      console.error('No token found, please log in first.');
      return;
    }

    fetch(`http://localhost:3003/user/all/${JSON.parse(user!).id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((users: User[]) => {
        setUsers(users);
      })
      .catch((error) => console.error('Error fetching users:', error));
  };

  const fetchAllChats = () => {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (!user || !user.id) {
      console.error('User ID not found, please log in first.');
      return;
    }

    fetch(`http://localhost:3003/chats/${user.id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((chats: Room[]) => {
        setChats(chats);
      })
      .catch((error) => console.error('Error fetching chats:', error));
  };

  const fetchRecipientsPublicKeys = (chatId: number) => {
    fetch(`http://localhost:3003/chat/${chatId}/public-keys`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((recipients: { userId: number; publicKey: string }[]) => {
        setRecipients(recipients);
      })
      .catch((error) =>
        console.error("Error fetching recipients' public keys:", error)
      );
  };

  const sendMessage = async () => {
    const messageInput = document.getElementById(
      'messageInput'
    ) as HTMLInputElement;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const user = JSON.parse(localStorage.getItem('user')!);
    const chatId = currentRoom?.id;

    if (!chatId) return;

    const encryptedContent = recipients.reduce((acc, recipient) => {
      return {
        ...acc,
        [recipient.userId]: encryptMessage(
          messageInput.value,
          recipient.publicKey
        ),
      };
    }, {});

    const formData = new FormData();
    if (fileInput.files && fileInput.files[0]) {
      formData.append('file', fileInput.files[0]);
    }

    formData.append('roomId', chatId.toString());
    formData.append('senderId', user.id.toString());
    formData.append('content', JSON.stringify(encryptedContent));

    fetch('http://localhost:3003/messages', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    })
      .then((response) => response.json())
      .then((message) => {
        socketInstance.current?.emit('sendMessage', {
          roomId: chatId,
          message,
        });
      })
      .catch((error) => console.error('Error sending message:', error));
  };

  const fetchMessages = (chatId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in first.');
      return;
    }

    fetch(`http://localhost:3003/messages/${chatId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        return response.json();
      })
      .then((messages: Message[]) => {
        setMessages(messages);
      })
      .catch((error) => console.error('Error fetching messages:', error));
  };

  const uploadAvatar = (userId: number, avatarFile: File) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, please log in first.');
      return;
    }

    const avatarFormData = new FormData();
    avatarFormData.append('file', avatarFile);

    fetch(`http://localhost:3003/user/avatar/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: avatarFormData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Avatar updated:', data);
      })
      .catch((error) => console.error('Error uploading avatar:', error));
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prevSelectedUsers) => {
      const newSelectedUsers = new Set(prevSelectedUsers);
      if (newSelectedUsers.has(userId)) {
        newSelectedUsers.delete(userId);
      } else {
        newSelectedUsers.add(userId);
      }
      return newSelectedUsers;
    });
  };

  const displayUsers = () => (
    <div>
      <h3>All Users</h3>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            data-user-id={user.id}
            className={selectedUsers.has(user.id) ? 'selected' : ''}
            onClick={() => toggleUserSelection(user.id)}
          >
            {user.username} - {user.email}
          </li>
        ))}
      </ul>
      <button onClick={createChat}>Create Chat</button>
    </div>
  );

  const displayChats = () => (
    <div>
      <h3>All Chats</h3>
      <ul>
        {chats.map((chat) => (
          <li
            key={chat.id}
            data-chat-id={chat.id}
            onClick={() => {
              if (currentRoom?.id && currentRoom.id !== chat.id) {
                socketInstance.current?.emit('leaveRoom', currentRoom.id);
              }
              setCurrentRoomId(chat);
              socketInstance.current?.emit('subscribeToRoom', chat.id);
              fetchRecipientsPublicKeys(chat.id);
              fetchMessages(chat.id);
            }}
          >
            Chat ID: {chat.id}
          </li>
        ))}
      </ul>
      {currentRoom?.id && (
        <>
          {currentRoom.id &&
            currentRoom.adminUserId ===
              JSON.parse(localStorage.getItem('user')!).id &&
            isAuthenticated && (
              <div>
                <label htmlFor='expirationTime'>
                  Set message expiration time (minutes):
                </label>
                <input
                  type='number'
                  id='expirationTime'
                  value={expirationTime || ''}
                  onChange={(e) =>
                    setExpirationTimeValue(parseInt(e.target.value))
                  }
                />
                <button
                  onClick={() => {
                    const user = JSON.parse(localStorage.getItem('user')!);
                    setExpirationTime(currentRoom.id, user.id, expirationTime!);
                  }}
                >
                  Set Expiration Time
                </button>
              </div>
            )}
          <div id='messagesDisplay'>{displayMessages()}</div>
          <div id='messageInputArea'>
            <input
              type='text'
              id='messageInput'
              placeholder='Write a message...'
            />
            <input type='file' id='fileInput' />
            <button onClick={sendMessage}>Send</button>
          </div>
        </>
      )}
    </div>
  );

  const displayMessages = () => (
    <div ref={messagesDisplayRef}>
      <h4>Messages</h4>
      <ul>
        {messages.map((message) => {
          const user = JSON.parse(localStorage.getItem('user')!);
          const decryptedMessage = decryptMessage(
            message.content[user.id],
            user.privateKey
          );

          const isImage = message.filePath?.match(/\.(jpeg|jpg|gif|png|webp)$/);

          return (
            <li
              key={message.id}
              data-message-id={message.id}
              className='message'
            >
              <div>
                <strong>{message.sender.username}:</strong> {decryptedMessage}
              </div>
              {message.filePath &&
                (isImage ? (
                  <ImageComponent fileName={message.filePath} />
                ) : (
                  <FileComponent fileName={message.filePath} />
                ))}
            </li>
          );
        })}
      </ul>
    </div>
  );

  const createChat = () => {
    const selectedUsersList = Array.from(selectedUsers);
    if (selectedUsersList.length === 0) {
      alert('Please select at least one user to create a chat.');
      return;
    }
    const user = JSON.parse(localStorage.getItem('user')!);
    const userAdminID = user.id;
    const chatData = {
      userIds: [...selectedUsersList, userAdminID],
      adminUserId: userAdminID,
      isDirectMessage: selectedUsersList.length === 1,
    };

    fetch('http://localhost:3003/chat/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Chat created:', data);
        setChats((prevChats) => [...prevChats, data]);
        setSelectedUsers(new Set());
      })
      .catch((error) => console.error('Error creating chat:', error));
  };

  const setExpirationTime = (
    roomId: number,
    userId: number,
    expirationTime: number
  ) => {
    fetch(`http://localhost:3003/chat/${roomId}/${userId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messageExpirationTime: expirationTime * 60 }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to set expiration time');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Expiration time set:', data);
      })
      .catch((error) => console.error('Error setting expiration time:', error));
  };

  return (
    <div className='tab'>
      {!isAuthenticated ? (
        <>
          <button className='tablinks' onClick={() => openTab('Login')}>
            Login
          </button>
          <button className='tablinks' onClick={() => openTab('Register')}>
            Register
          </button>
        </>
      ) : (
        <>
          <button className='tablinks' onClick={logout}>
            Logout
          </button>
          <button
            className='tablinks auth-tab'
            onClick={() => openTab('AllUsers')}
          >
            All Users
          </button>
          <button
            className='tablinks auth-tab'
            onClick={() => openTab('AllChats')}
          >
            All Chats
          </button>
          <button
            className='tablinks auth-tab'
            onClick={() => openTab('MyProfile')}
          >
            My Profile
          </button>
        </>
      )}

      {selectedTab === 'Login' && (
        <div id='Login' className='tabcontent'>
          <h3>Login</h3>
          <form
            id='loginForm'
            onSubmit={(event) => {
              event.preventDefault();
              const email = (event.target as HTMLFormElement).email.value;
              const password = (event.target as HTMLFormElement).password.value;
              fetch('http://localhost:3003/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.token && data.user) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    updateAuthStatus();
                    openTab('AllUsers');
                  }
                })
                .catch((error) => console.error('Error:', error));
            }}
          >
            <label htmlFor='email'>Email:</label>
            <input type='email' id='email' name='email' required />
            <br />
            <label htmlFor='password'>Password:</label>
            <input type='password' id='password' name='password' required />
            <br />
            <button type='submit'>Login</button>
          </form>
        </div>
      )}

      {selectedTab === 'Register' && (
        <div id='Register' className='tabcontent'>
          <h3>Register</h3>
          <form
            id='registerForm'
            encType='multipart/form-data'
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.target as HTMLFormElement);
              const jsonData = {
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                password: formData.get('password') as string,
                age: formData.get('age') ? Number(formData.get('age')) : null,
              };

              fetch('http://localhost:3003/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonData),
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    updateAuthStatus();
                    openTab('AllUsers');
                  }
                  if (data.user && data.user.id && formData.get('avatar')) {
                    uploadAvatar(data.user.id, formData.get('avatar') as File);
                  }
                })
                .catch((error) => console.error('Error:', error));
            }}
          >
            <label htmlFor='name'>Name:</label>
            <input type='text' id='name' name='name' required />
            <br />
            <label htmlFor='regEmail'>Email:</label>
            <input type='email' id='regEmail' name='email' required />
            <br />
            <label htmlFor='regPassword'>Password:</label>
            <input type='password' id='regPassword' name='password' required />
            <br />
            <label htmlFor='age'>Age:</label>
            <input type='number' id='age' name='age' />
            <br />
            <label htmlFor='avatar'>Avatar:</label>
            <input type='file' id='avatar' name='avatar' accept='image/*' />
            <br />
            <button type='submit'>Register</button>
          </form>
        </div>
      )}

      {selectedTab === 'AllUsers' && displayUsers()}
      {selectedTab === 'AllChats' && displayChats()}
      {selectedTab === 'MyProfile' && currentUser && (
        <ProfileComponent user={currentUser} onUpdate={setCurrentUser} />
      )}
    </div>
  );
};

export default App;
