/*
  API 
    -- Base URL:  https://wind-bow.gomix.me/twitch-api
    -- routes (GET only):
                - /users/:user
                  - bio
                  - logo
                - /channels/:channel
                  - followers
                  - twitch url
                - /streams/:stream
                  - stream (null if not streaming)
                  - game name
                  - stream preview img
                  - (all channel info)
*/

(function App() {
  const channels = ['deadmau5', 'syntag', 'freecodecamp', 'streamerhouse'];
  const [ container ] = document.getElementsByClassName('content');

  channels.forEach((channel) => {
    const streamUrl = `https://wind-bow.gomix.me/twitch-api/streams/${channel}?callback=?`;
    const channelUrl = `https://wind-bow.gomix.me/twitch-api/channels/${channel}?callback=?`;
    $.getJSON(streamUrl, (data) => {
      if (data.stream) {
        const channelObj = createChannelObj(data.stream.channel);
        console.log(channelObj);
        render(channelObj);
      } else {
        $.getJSON(channelUrl, (result) => {
          const channelObj = createChannelObj(result);
          console.log(channelObj);
          render(channelObj);
        });
      }
    });
  });

  function createChannelObj(input) {
    return {
      name: input.display_name,
      logo: input.logo,
      stream: input.game,
      viewers: input.viewers,
      url: input.url,
    }
  }

  function render(channel) {
    const channelContainer = document.createElement('div');
    const channelInfo = document.createElement('div');
    const channelImg = document.createElement('img');
    const channelName = document.createElement('span');
    const channelStatus = document.createElement('span');

    channelName.innerText = channel.name;
    channelStatus.innerText = (channel.stream === 'Creative') ? 'Offline' : channel.stream;

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
