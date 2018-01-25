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
      } else {
        $.getJSON(channelUrl, (result) => {
          const channelObj = createChannelObj(result);
          console.log(channelObj);
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
    let channelContainer = document.createElement('div').classList.add('channel');
    let channelInfo = document.createElement('div').classList.add('channel__info');


    container.appendChild(elm);
  }
}());
