/*
  User stories:
    
    -- Show list of users who are currently streaming
    -- Show list of users who are currently offline
    -- Show list of all users

    -- If user is streaming, display the stream title
    -- Upon clicking a user who is currently streaming, it will direct to the stream
    
  *BONUS*

    -- Live search field


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
                  - game name
                  - stream preview img
                  - (all channel info)


  USERS

    -- freecodecamp id: 79776140
    -- syntag       id: 75552478
    -- deadmau5     id: 71166086
    -- monstercat   id: 27446517


  LOGIC

    -- check if user is streaming if result.stream === null from streams/username
    -- if result.stream !== null, get stream name from result.game 


*/

(function App() {
  const channels = ['deadmau5', 'syntag', 'freecodecamp', 'streamerhouse'];
  const [ container ] = document.getElementsByClassName('content');
  const baseUrl = 'https://wind-bow.gomix.me/twitch-api/streams/deadmau5';
  fetchChannels();
  // fetch users
  function fetchChannels() {
    fetch(baseUrl, {
      method: 'get',
      mode: 'no-cors',
    })
      .then((data) => {
        console.log(data);
      });
  }

  // check if user is streaming

  


}());
