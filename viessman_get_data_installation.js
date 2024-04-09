
// Create the request
const access_token = global.get('viess_access_token');


let headers = {'Authorization': 'Bearer ' + access_token};
let res;

// get installation id
res = await fetch('https://api.viessmann.com/iot/v1/equipment/installations', 
{
  headers: headers,
});

if(!res.ok){
  throw new Error('Error getting installation id:' + res.statusText);
}

let response = JSON.parse(await res.text());

const installationId = response.data[0].id;
global.set("viess_installation_id", installationId);
console.log('installation id ' + installationId);


// get gateway serial id
res = await fetch('https://api.viessmann.com/iot/v1/equipment/gateways', 
{
  headers: headers,
});

if(!res.ok){
  throw new Error('Error getting gateway serial id:' + res.statusText);
}

response = JSON.parse(await res.text());

const gateaySerialId = response.data[0].serial;
global.set("viess_gateway_serial_id", gateaySerialId);
console.log('serial id ' + gateaySerialId);

// get device id
res = await fetch('https://api.viessmann.com/iot/v1/equipment/installations/' + installationId + '/gateways/' + gateaySerialId + '/devices/', 
{
  headers: headers,
});

if(!res.ok){
  throw new Error('Error getting device id:' + res.statusText);
}

response = JSON.parse(await res.text());

const deviceId = response.data[0].id;
// set 0 in place of variable, because it return bad data now
global.set("viess_device_id", 0);
console.log('device id ' + JSON.stringify(response.data[0]));

//throw new Error(response.data[0].id)
