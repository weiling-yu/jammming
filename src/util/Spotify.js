const clientId = "4e1d92bebe9d4ca0a2360257a4faaa55";
const redirectUri = "http://localhost:3000/";
let userAccessToken;

const Spotify = {
    getAccessToken(){
        // 1. If the access token is already set, return userAccessToken
        if (userAccessToken){
            return userAccessToken;
        }
        // 2. If the access token is not already set, check the URL to see if it has just been obtained.
        const userAccessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (userAccessTokenMatch && expiresInMatch){
            userAccessToken = userAccessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() => userAccessToken="", expiresIn*1000);
            window.history.pushState('Access Token', null, "/");
            return userAccessToken;
        }
        // 3. If the access token variable is empty and is not in the URL. regist
        else {
            const accessUri = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUri;
        }
    },
    search(term){
        const userAccessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${userAccessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => { // if no tracks return [];
            if(!jsonResponse.tracks){
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
        })
    },
    savePlayList(name, trackUris){
        if (!name || !trackUris.length){
            return [];
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization : `Bearer ${accessToken}`
        };
        let userId;
        return  fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => response.json()
        ).then(jsonReponse => {
            userId = jsonReponse.id;
            console.log(jsonReponse)
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: "POST", 
                body: JSON.stringify({name: name})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonReponse.id;
                return fetch(`http://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                    headers: headers,
                    method: "POST",
                    body: JSON.stringify({uris: trackUris})
                })
            })
        })
    }
}


export default Spotify;