const clientId = global.get('viess_client_id');
const authCode = global.get('viess_auth_code');
log(clientId + ' ' + authCode);

let headers = {'Content-Type': 'application/x-www-form-urlencoded'};
let res;

// get auth code
res = await fetch('https://iam.viessmann.com/idp/v3/token', 
{
  method: 'POST',
  body: 'grant_type=authorization_code&client_id=' + clientId + '&redirect_uri=http://localhost:1880/authcode&code_verifier=2e21faa1-db2c-4d0b-a10f-575fd372bc8c-575fd372bc8c&code=' + authCode,
  headers: headers,
});

if(!res.ok){
  throw new Error(res.statusText + ' ' + clientId + ' ' + authCode + ' ' + args.length);
}

const response = JSON.parse(await res.text());

global.set("viess_access_token", response.access_token);
global.set("viess_refresh_token", response.refresh_token);
