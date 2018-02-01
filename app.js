(function App() {
  const channelNames = ['deadmau5', 'syntag', 'relaxbeats', 'donthedeveloper', 'devbowser', 'boogie2988', 'freecodecamp', 'h3h3productions', 'mikemateilive', 'streamerhouse', 'joelpurra', 'monstercat', 'dukenukem2020'];
  const channelArr = [];
  const [nav] = Array.from(document.getElementsByClassName('nav'));
  const [searchInput] = Array.from(document.getElementsByClassName('search'));

  runApp();

  searchInput.addEventListener('keyup', (e) => {
    const input = e.target.value;
    const streamUrl = `https://wind-bow.gomix.me/twitch-api/streams/${input}?callback=?`;
    const channelUrl = `https://wind-bow.gomix.me/twitch-api/channels/${input}?callback=?`;

    if (input) {
      $.getJSON(streamUrl, (streamData) => {
        let channel;
        if (streamData.stream) {
          emptyElement('.results');
          channel = new Channel(streamData.stream.channel, true);
          renderResults(channel);
        } else {
          $.getJSON(channelUrl, (channelData) => {
            if (!channelData.error) {
              emptyElement('.results');
              channel = new Channel(channelData);
              renderResults(channel);
            } else {
              emptyElement('.results');
            }
          });
        }
      });
    }
  });

  function renderResults(data) {
    console.log(data);
    const [results] = Array.from(document.getElementsByClassName('results'));
    const channel = document.createElement('div');
    const logo = document.createElement('img');
    const name = document.createElement('span');

    channel.className = 'results__item';
    logo.className = 'results__img';
    name.className = 'results__name';

    name.innerText = data.name;
    logo.src = data.logo;

    channel.appendChild(logo);
    channel.appendChild(name);
    results.appendChild(channel);
  }


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
  function runApp() {
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
  }

  // Creates channel object
  function Channel(data, isStreaming = false) {
    this.name = data.display_name;
    this.logo = data.logo;
    this.stream = isStreaming ? data.game : false;
    this.details = isStreaming ? data.status : '';
    this.viewers = data.viewers;
    this.url = data.url;
  }

  // Renders individual channel component
  function render(obj) {
    const [container] = document.getElementsByClassName('content');
    const channel = document.createElement('a');
    const user = document.createElement('div');
    const userImg = document.createElement('img');
    const userName = document.createElement('a');
    const status = document.createElement('a');
    const details = document.createElement('div');

    userName.innerText = obj.name;
    status.innerText = obj.stream ? obj.stream : 'Offline';
    channel.href = obj.url;
    details.innerText = obj.details;

    channel.className = obj.stream ? 'channel channel--online' : 'channel';
    user.className = 'channel__info';
    userImg.className = 'channel__img';
    userImg.src = obj.logo;
    userName.className = 'channel__name';
    status.className = 'channel__status';
    details.className = 'channel__details';

    user.appendChild(userImg);
    user.appendChild(userName);
    channel.appendChild(user);
    status.appendChild(details);
    channel.appendChild(status);

    container.appendChild(channel);
  }

  // Clears all channel components
  function emptyElement(elm) {
    document.querySelector(elm).innerHTML = '';
  }
}());
