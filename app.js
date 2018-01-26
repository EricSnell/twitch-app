(function App() {
  const channelNames = ['deadmau5', 'syntag', 'freecodecamp', 'streamerhouse', 'dukenukem2020'];
  const [container] = document.getElementsByClassName('content');
  const channelArr = [];

  channelNames.forEach((name) => {
    const streamUrl = `https://wind-bow.gomix.me/twitch-api/streams/${name}?callback=?`;
    const channelUrl = `https://wind-bow.gomix.me/twitch-api/channels/${name}?callback=?`;

    $.getJSON(streamUrl, (streamData) => {
      let channel;
      if (streamData.stream) {
        channel = createChannelObj(streamData.stream.channel, true);
        channelArr.push(channel);
        render(channel);
      } else {
        $.getJSON(channelUrl, (channelData) => {
          channel = createChannelObj(channelData);
          channelArr.push(channel);
          render(channel);
        });
      }
    });
  });

  /* *** HELPER FUNCTIONS *** */
  function createChannelObj(data, isStreaming = false) {
    return {
      name: data.display_name,
      logo: data.logo,
      stream: isStreaming ? data.game : false,
      viewers: data.viewers,
      url: data.url,
    };
  }

  function render(channel) {
    const channelContainer = document.createElement('a');
    const channelInfo = document.createElement('div');
    const channelImg = document.createElement('img');
    const channelName = document.createElement('a');
    const channelStatus = document.createElement('a');

    channelName.innerText = channel.name;
    channelStatus.innerText = channel.stream ? channel.stream : 'Offline';
    channelContainer.href = channel.url;

    channelContainer.className = 'channel';
    channelInfo.className = 'channel__info';
    channelImg.className = 'channel__img';
    channelImg.src = channel.logo;
    channelName.className = 'channel__name';
    channelStatus.className = 'channel__status';

    channelInfo.appendChild(channelImg);
    channelInfo.appendChild(channelName);
    channelContainer.appendChild(channelInfo);
    channelContainer.appendChild(channelStatus);

    container.appendChild(channelContainer);
  }
}());
