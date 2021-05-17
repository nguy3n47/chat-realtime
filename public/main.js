$(() => {
  const socket = io();

  let username = faker.name.findName().split(" ")[0];
  let avatar = `https://ui-avatars.com/api/?background=random&name=${username}`;
  const data = {
    username,
    avatar,
  };
  socket.emit("add user", data);

  const addParticipantsMessage = (data) => {
    let message = "Welcome to Socket.IO Chat – ";
    if (data.numUsers === 1) {
      message += `there's 1 participant`;
    } else {
      message += `there are ${data.numUsers} participants`;
    }
    const $el = $("<li>").addClass("log").text(message);
    if ($(".log")[0]) {
      $(".log").eq(0).text(message);
    } else {
      $(".messages").append($el);
    }
  };

  socket.on("login", (data) => {
    addParticipantsMessage(data);
  });

  socket.on("user joined", (data) => {
    let message = `${data.username} joined`;
    const $el = $("<li>").addClass("log").text(message);
    $(".messages").append($el);
  });

  socket.on("user left", (data) => {
    addParticipantsMessage(data);
    let message = `${data.username} left`;
    const $el = $("<li>").addClass("log").text(message);
    $(".messages").append($el);
  });

  // Sends a chat message
  const sendMessage = () => {
    let message = $(".inputMessage").val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (message) {
      $(".inputMessage").val("");
      addChatMessage({ username, avatar, message });
      // tell server to execute 'new message' and send along one parameter
      socket.emit("new message", message);
    }
  };

  const cleanInput = (input) => {
    return $("<div/>").text(input).html();
  };

  const addChatMessage = (data) => {
    const $avatarDiv = $(
      `<img class="avatar" src=${data.avatar} width="64" height="64" />`,
    );
    const $usernameDiv = $('<span class="username"/>').text(data.username);
    const $messageBodyDiv = $('<span class="messageBody">').text(data.message);

    const $messageDiv = $('<li class="message"/>')
      .data("username", data.username)
      .append(
        $avatarDiv,
        $('<div class="content"/>').append($usernameDiv, $messageBodyDiv),
      );

    $(".messages").append($messageDiv);
    $(".messages")[0].scrollTop = $(".messages")[0].scrollHeight;
  };

  socket.on("new message", (data) => {
    addChatMessage(data);
  });

  $(window).keydown((event) => {
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
      } else {
        return;
      }
    }
  });
});
