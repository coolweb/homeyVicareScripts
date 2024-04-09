
const access_token = global.get('viess_access_token');
const installationId = global.get('viess_installation_id');
const gatewaySerial = global.get('viess_gateway_serial_id');
const deviceId = global.get('viess_device_id');
let currentMode = global.get('viess_mode');
const targetTemperature = parseFloat(args[0]);

// force to normal seems to reduced and normal always active
currentMode = 'normal';



let headers = {
  'Authorization': 'Bearer ' + access_token,
  'Content-type': 'application/json'
};
let res;

// get installation id
res = await fetch('https://api.viessmann.com/iot/v2/features/installations/' + installationId + '/gateways/' + gatewaySerial + '/devices/' + deviceId + '/features/heating.circuits.0.operating.programs.' + currentMode + '/commands/setTemperature', 
{
  headers: headers,
  method: 'POST',
  body: JSON.stringify({
    targetTemperature: targetTemperature
  })
});



if(!res.ok){
  throw new Error('Error getting installation id:' + res.statusText);
}
