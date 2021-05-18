$(() => {
  // Initialize variables
  const $window = $(window);
  const $usernameInput = $('.usernameInput'); // Input for username
  const $messages = $('.messages'); // Messages area
  const $inputMessage = $('.inputMessage'); // Input message input box

  const $loginPage = $('.login.page'); // The login page
  const $chatPage = $('.chat.page'); // The chatroom page

  const socket = io();

  let username;
  let avatar;

  let $currentInput = $usernameInput.focus();

  // Sets the client's user
  const setUser = () => {
    username = $usernameInput.val().trim();
    avatar = `https://ui-avatars.com/api/?background=random&name=${username.charAt(
      0
    )}`;

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', { username, avatar });
    }
  };

  const addParticipantsMessage = (data) => {
    let message = 'Welcome to Socket.IO Chat – ';
    if (data.numUsers === 1) {
      message += `there's 1 participant`;
    } else {
      message += `there are ${data.numUsers} participants`;
    }
    const $el = $('<li>').addClass('log').text(message);
    if ($('.log')[0]) {
      $('.log').eq(0).text(message);
    } else {
      $messages.append($el);
    }
  };

  socket.on('login', (data) => {
    addParticipantsMessage(data);
  });

  socket.on('user joined', (data) => {
    let message = `${data.username} joined`;
    const $el = $('<li>').addClass('log').text(message);
    $messages.append($el);
  });

  socket.on('user left', (data) => {
    addParticipantsMessage(data);
    let message = `${data.username} left`;
    const $el = $('<li>').addClass('log').text(message);
    $messages.append($el);
  });

  // Sends a chat message
  const sendMessage = () => {
    let message = $inputMessage.val();
    // if there is a non-empty message and a socket connection
    if (message) {
      $inputMessage.val('');
      addChatMessage({ username, avatar, message });
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    }
  };

  const addChatMessage = (data) => {
    const $avatarDiv = $(
      `<img class="avatar" src=${data.avatar} width="64" height="64" />`
    );
    const $usernameDiv = $('<span class="username"/>').text(data.username);
    const $messageBodyDiv = $('<span class="messageBody">').text(data.message);

    const $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .append(
        $avatarDiv,
        $('<div class="content"/>').append($usernameDiv, $messageBodyDiv)
      );

    $messages.append($messageDiv);
    $messages[0].scrollTop = $messages[0].scrollHeight;
  };

  socket.on('new message', (data) => {
    addChatMessage(data);
  });

  socket.on('disconnect', () => {
    log('you have been disconnected');
  });

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(() => {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(() => {
    $inputMessage.focus();
  });

  $window.keydown((event) => {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
      } else {
        setUser();
      }
    }
  });
});
