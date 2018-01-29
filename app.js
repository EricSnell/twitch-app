(function App() {
  const channelNames = ['deadmau5', 'syntag', 'relaxbeats', 'donthedeveloper', 'devbowser', 'boogie2988', 'freecodecamp', 'h3h3productions', 'mikemateilive', 'streamerhouse', 'joelpurra', 'monstercat', 'dukenukem2020'];
  const [nav] = Array.from(document.getElementsByClassName('nav'));
  const [searchInput] = Array.from(document.getElementsByClassName('search'));

  getData();


  searchInput.addEventListener('keyup', (e) => {
    const input = e.target.value;
    const streamUrl = `https://wind-bow.gomix.me/twitch-api/streams/${input}?callback=?`;
    const channelUrl = `https://wind-bow.gomix.me/twitch-api/channels/${input}?callback=?`;

    clearChannels();

    if (input) {
      $.getJSON(streamUrl, (streamData) => {
        let channel;
        if (streamData.stream) {
          clearChannels();
          channel = new Channel(streamData.stream.channel, true);
          render(channel);
        } else {
          $.getJSON(channelUrl, (channelData) => {
            if (!channelData.error) {
              clearChannels();
              channel = new Channel(channelData);
              render(channel);
            }
          });
        }
      });
    }
  });


  nav.addEventListener('click', (e) => {
    const filter = e.target.innerText;
    const channels = Array.from(document.getElementsByClassName('channel'));
    const navItems = Array.from(nav.getElementsByClassName('nav__item'));

    navItems.forEach((item) => {
      item.classList.remove('nav__item--active');
    });

    e.target.classList.add('nav__item--active');

    if (filter === 'ALL') {
      channels.forEach((channel) => {
        channel.classList.remove('hidden');
      });
    } else if (filter === 'ONLINE') {
      channels.forEach((channel) => {
        if (channel.classList.contains('channel--online')) {
          channel.classList.remove('hidden');
        } else {
          channel.classList.add('hidden');
        }
      });
    } else {
      channels.forEach((channel) => {
        if (channel.classList.contains('channel--online')) {
          channel.classList.add('hidden');
        } else {
          channel.classList.remove('hidden');
        }
      });
    }
  });


  /* *** HELPER FUNCTIONS *** */

  // Fetch data
  function getData() {
    channelNames.forEach((name) => {
      const streamUrl = `https://wind-bow.gomix.me/twitch-api/streams/${name}?callback=?`;
      const channelUrl = `https://wind-bow.gomix.me/twitch-api/channels/${name}?callback=?`;

      $.getJSON(streamUrl, (streamData) => {
        let channel;
        if (streamData.stream) {
          channel = new Channel(streamData.stream.channel, true);
          render(channel);
        } else {
          $.getJSON(channelUrl, (channelData) => {
            channel = new Channel(channelData);
            render(channel);
          });
        }
      });
    });
  }

  // Creates channel object
  function Channel(data, isStreaming = false) {
    this.name = data.display_name;
    this.logo = data.logo;
    this.stream = isStreaming ? data.game : false;
    this.substatus = isStreaming ? data.status : '';
    this.viewers = data.viewers;
    this.url = data.url;
  }

  // Renders individual channel component
  function render(obj) {
    const [container] = document.getElementsByClassName('content');
    const channel = document.createElement('a');
    const channelInfo = document.createElement('div');
    const channelImg = document.createElement('img');
    const channelName = document.createElement('a');
    const channelStatus = document.createElement('a');
    const channelSubStatus = document.createElement('div');

    channelName.innerText = obj.name;
    channelStatus.innerText = obj.stream ? obj.stream : 'Offline';
    channel.href = obj.url;
    channelSubStatus.innerText = obj.substatus;

    channel.className = obj.stream ? 'channel channel--online' : 'channel';
    channelInfo.className = 'channel__info';
    channelImg.className = 'channel__img';
    channelImg.src = obj.logo;
    channelName.className = 'channel__name';
    channelStatus.className = 'channel__status';
    channelSubStatus.className = 'channel__sub-status';

    channelInfo.appendChild(channelImg);
    channelInfo.appendChild(channelName);
    channel.appendChild(channelInfo);
    channelStatus.appendChild(channelSubStatus);
    channel.appendChild(channelStatus);

    container.appendChild(channel);
  }

  // Clears all channel components
  function clearChannels() {
    const [content] = Array.from(document.getElementsByClassName('content'));
    content.innerHTML = '';
  }
}());
