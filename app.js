(function App() {
  const channelNames = ['deadmau5', 'syntag', 'freecodecamp', 'streamerhouse', 'monstercat', 'dukenukem2020'];
  const [nav] = Array.from(document.getElementsByClassName('nav'));

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

    channel.className = obj.stream ? 'channel channel--online' : 'channel';
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
