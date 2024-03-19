const clientId = global.get('viess_client_id');
const refreshToken = global.get('viess_refresh_token');

let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
let res;

// get auth code
res = await fetch('https://iam.viessmann.com/idp/v3/token', 
{
  method: 'POST',
  body: 'grant_type=refresh_token&client_id=' + clientId + '&refresh_token=' + refreshToken,
  headers: headers,
});

if(!res.ok){
  throw new Error(res.statusText);
}

const response = JSON.parse(await res.text());

global.set("viess_access_token", response.access_token);
await tag('viess_need_new_tokens', response.access_token == null)

