(function App() {
  // localStorage.removeItem('subscriptions');
  let storage = localStorage.getItem('subscriptions');
  const subscriptions = JSON.parse(storage) || [];
  const [nav] = Array.from(document.getElementsByClassName('nav'));
  const [searchInput] = Array.from(
    document.getElementsByClassName('search__input')
  );
  const [search] = Array.from(document.getElementsByClassName('search'));
  let resultsTimer = null;
  let refreshTimer = null;

  init();

  function init() {
    updateStatusAll();
    setRefreshTimer();
    searchInput.addEventListener('keyup', showResults);
    searchInput.addEventListener('blur', closeResults);
    nav.addEventListener('click', filterChannels);
  }

  function closeResults(e) {
    const addBtn = document.querySelector('.btn--add');
    const secondaryTarget = e.relatedTarget;
    if (secondaryTarget !== addBtn) {
      emptyElement('.results');
      hideElement('.results');
      emptyInput();
    }
  }

  // use event delegation and put listener on the search section
  function addListener(result) {
    const btn = document.querySelector('.btn--add');
    btn.addEventListener('click', e => {
      e.stopPropagation();
      subscribe(result);
      updateStatusAll();
      emptyElement('.results');
      emptyInput();
    });
  }

  function setRefreshTimer() {
    if (storage) {
      clearInterval(refreshTimer);
      refreshTimer = setInterval(updateStatusAll, 300000);
    }
  }

  // function showResults(e) {
  //   e.stopPropagation();
  //   clearTimeout(resultsTimer);
  //   resultsTimer = setTimeout(() => {
  //     const input = e.target.value;
  //     const url = `https://wind-bow.gomix.me/twitch-api/channels/${input}?callback=?`;
  //     $.getJSON(url, data => {
  //       const result = !data.error;
  //       if (result) {
  //         const channel = new Channel(data);
  //         emptyElement('.results');
  //         renderSearchResult(channel);
  //         if (alreadySubscribed(channel)) {
  //           disableButton();
  //         } else {
  //           addListener(channel);
  //         }
  //       } else {
  //         emptyElement('.results');
  //       }
  //     });
  //   }, 400);
  // }

  function showResults(e) {
    e.stopPropagation();
    clearTimeout(resultsTimer);
    resultsTimer = setTimeout(() => {
      fetchResults(e);
    }, 400);
  }

  function fetchResults(e) {
    const input = e.target.value;
    const url = `https://wind-bow.gomix.me/twitch-api/channels/${input}?callback=?`;
    $.getJSON(url, data => {
      console.log('buh');
      const result = !data.error;
      if (result) {
        const channel = new Channel(data);
        emptyElement('.results');
        renderSearchResult(channel);
        if (alreadySubscribed(channel)) {
          disableButton();
        } else {
          addListener(channel);
        }
      } else {
        emptyElement('.results');
      }
    });
  }

  function filterChannels(e) {
    const filter = e.target.innerText;
    const channels = Array.from(document.getElementsByClassName('channel'));
    const navItems = Array.from(nav.getElementsByClassName('nav__item'));

    navItems.forEach(item => {
      item.classList.remove('nav__item--active');
    });

    e.target.classList.add('nav__item--active');

    if (filter === 'ALL') {
      channels.forEach(channel => {
        channel.classList.remove('hidden');
      });
    } else if (filter === 'ONLINE') {
      channels.forEach(channel => {
        if (channel.classList.contains('channel--online')) {
          channel.classList.remove('hidden');
        } else {
          channel.classList.add('hidden');
        }
      });
    } else {
      channels.forEach(channel => {
        if (channel.classList.contains('channel--online')) {
          channel.classList.add('hidden');
        } else {
          channel.classList.remove('hidden');
        }
      });
    }
  }

  function updateStatusAll() {
    console.log('updating...');
    subscriptions.forEach(obj => {
      const streamUrl = `https://wind-bow.gomix.me/twitch-api/streams/${
        obj.name
      }?callback=?`;

      $.getJSON(streamUrl, streamData => {
        const { stream } = streamData;
        obj.stream = stream ? stream.game : false;
        obj.details = stream ? stream.channel.status : '';
        renderAll();
        updateStorage();
        setRefreshTimer();
      });
    });
  }

  function renderAll() {
    emptyElement('.content');
    subscriptions.forEach(channel => {
      renderChannel(channel);
    });
  }

  function renderSearchResult(data) {
    const [results] = Array.from(document.getElementsByClassName('results'));
    const channel = document.createElement('div');
    const logo = document.createElement('img');
    const name = document.createElement('span');
    const addBtn = document.createElement('button');
    // Set class names
    channel.className = 'results__item';
    logo.className = 'results__img';
    name.className = 'results__name';
    addBtn.className = 'btn--add';
    // Set styles, text and attributes
    results.style.visibility = 'visible';
    name.innerText = data.name;
    logo.src = data.logo;
    addBtn.innerText = 'Add';
    // Append Elements
    channel.appendChild(logo);
    channel.appendChild(name);
    channel.appendChild(addBtn);
    results.appendChild(channel);
  }

  // Renders individual channel component
  function renderChannel(obj) {
    const [container] = document.getElementsByClassName('content');
    const channel = document.createElement('a');
    const user = document.createElement('div');
    const userImg = document.createElement('img');
    const userName = document.createElement('a');
    const status = document.createElement('a');
    const details = document.createElement('div');
    // Set text and attributes
    userName.innerText = obj.name;
    status.innerText = obj.stream ? obj.stream : 'Offline';
    channel.href = obj.url;
    details.innerText = obj.details;
    // Set class names
    channel.className = obj.stream ? 'channel channel--online' : 'channel';
    user.className = 'channel__info';
    userImg.className = 'channel__img';
    userImg.src = obj.logo;
    userName.className = 'channel__name';
    status.className = 'channel__status';
    details.className = 'channel__details';
    // Append Elements
    user.appendChild(userImg);
    user.appendChild(userName);
    channel.appendChild(user);
    status.appendChild(details);
    channel.appendChild(status);
    container.appendChild(channel);
  }

  function Channel(data, isStreaming = false) {
    this.name = data.display_name;
    this.logo = data.logo;
    this.stream = isStreaming ? data.game : false;
    this.details = isStreaming ? data.status : '';
    this.viewers = data.viewers;
    this.url = data.url;
  }

  function alreadySubscribed(channel) {
    return subscriptions.find(obj => obj.name === channel.name);
  }

  function subscribe(channel) {
    subscriptions.push(channel);
    updateStorage();
  }

  function updateStorage() {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
    storage = JSON.parse(localStorage.getItem('subscriptions'));
  }

  // Styling Functions
  function disableButton() {
    const [btn] = document.getElementsByClassName('btn--add');
    btn.disabled = true;
    btn.innerText = 'Following';
  }

  function emptyInput() {
    searchInput.value = '';
  }

  function emptyElement(elm) {
    document.querySelector(elm).innerHTML = '';
  }

  function hideElement(elm) {
    document.querySelector(elm).style.visibility = 'hidden';
  }
})();
