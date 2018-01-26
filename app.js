(function App() {
  const channelNames = ['deadmau5', 'syntag', 'freecodecamp', 'streamerhouse', 'dukenukem2020'];
  const channelArr = [];

  channelNames.forEach((name) => {
    const streamUrl = `https://wind-bow.gomix.me/twitch-api/streams/${name}?callback=?`;
    const channelUrl = `https://wind-bow.gomix.me/twitch-api/channels/${name}?callback=?`;

    $.getJSON(streamUrl, (streamData) => {
      let channel;
      if (streamData.stream) {
        channel = new Channel(streamData.stream.channel, true);
        channelArr.push(channel);
        render(channel);
      } else {
        $.getJSON(channelUrl, (channelData) => {
          channel = new Channel(channelData);
          channelArr.push(channel);
          render(channel);
        });
      }
    });
  });

  /* *** HELPER FUNCTIONS *** */
  function Channel(data, isStreaming = false) {
    this.name = data.display_name;
    this.logo = data.logo;
    this.stream = isStreaming ? data.game : false;
    this.viewers = data.viewers;
    this.url = data.url;
  }

  function render(obj) {
    const [container] = document.getElementsByClassName('content');
    const channel = document.createElement('a');
    const channelInfo = document.createElement('div');
    const channelImg = document.createElement('img');
    const channelName = document.createElement('a');
    const channelStatus = document.createElement('a');

    channelName.innerText = obj.name;
    channelStatus.innerText = obj.stream ? obj.stream : 'Offline';
    channel.href = obj.url;

    channel.className = 'channel';
    channelInfo.className = 'channel__info';
    channelImg.className = 'channel__img';
    channelImg.src = obj.logo;
    channelName.className = 'channel__name';
    channelStatus.className = 'channel__status';

    channelInfo.appendChild(channelImg);
    channelInfo.appendChild(channelName);
    channel.appendChild(channelInfo);
    channel.appendChild(channelStatus);

    container.appendChild(channel);
  }
}());
