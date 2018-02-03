(function App() {
  localStorage.removeItem('subscriptions');
  const storage = localStorage.getItem('subscriptions');
  const subscriptions = JSON.parse(storage) || [];
  const [nav] = Array.from(document.getElementsByClassName('nav'));
  const [searchInput] = Array.from(document.getElementsByClassName('search'));

  refresh();
  //setInterval(refresh, 60000);
  // Function to checkStatus that calls streaming endpoint and updates object where value is different

  searchInput.addEventListener('keyup', showResults);
  
  function showResults(e) {
    setTimeout(() => {
      const input = e.target.value;
      const url = `https://wind-bow.gomix.me/twitch-api/channels/${input}?callback=?`;
      $.getJSON(url, (data) => {
        const result = !data.error;
        if (result) {
          const channel = new Channel(data);
          emptyElement('.results');
          renderResults(channel);
          if (!alreadySubscribed(channel)) {
            addBtnListener(channel);
          } else {
            deactivateButton();
          }
        } else {
          emptyElement('.results');
        }
      });
    }, 1000);
  }

  function deactivateButton() {
    const [btn] = document.getElementsByClassName('btn--add');
    btn.style.backgroundColor = 'var(--color-primary-2)';
    btn.innerText = 'FOLLOWING';
  }

  function alreadySubscribed(channel) {
    return subscriptions.find(obj => obj.name === channel.name);
  }

  function addBtnListener(result) {
    const btn = document.querySelector('.btn--add');
    btn.addEventListener('click', () => {
      subscribe(result);
      emptyElement('.results');
      // hideResults();
      // renderSubscriptions();
      refresh();
    });
  }

  function subscribe(channel) {
    console.log('subs before:', subscriptions);
    subscriptions.push(channel);
    console.log('subs after:', subscriptions);
    console.log('local before:', localStorage['subscriptions']);
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    console.log('local after:', localStorage['subscriptions']);
  }

  // function hideResults() {
  //   document.querySelector('.results').innerHTML = '';
  // }

  // function renderSubscriptions() {
  //   emptyElement('.content');
  //   subscriptions.forEach((channel) => {
  //     render(channel);
  //   });
  // }

  function renderResults(data) {
    const [results] = Array.from(document.getElementsByClassName('results'));
    const channel = document.createElement('div');
    const logo = document.createElement('img');
    const name = document.createElement('span');
    const addBtn = document.createElement('button');

    channel.className = 'results__item';
    logo.className = 'results__img';
    name.className = 'results__name';
    addBtn.className = 'btn--add';

    name.innerText = data.name;
    logo.src = data.logo;
    addBtn.innerText = 'Add';

    channel.appendChild(logo);
    channel.appendChild(name);
    channel.appendChild(addBtn);
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
  function refresh() {
    emptyElement('.content');
    if (subscriptions.length) {
      subscriptions.forEach((obj) => {
        const streamUrl = `https://wind-bow.gomix.me/twitch-api/streams/${obj.name}?callback=?`;
        const channelUrl = `https://wind-bow.gomix.me/twitch-api/channels/${obj.name}?callback=?`;

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
