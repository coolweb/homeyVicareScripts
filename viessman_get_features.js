const access_token = global.get('viess_access_token');
const installationId = global.get('viess_installation_id');
const gatewaySerial = global.get('viess_gateway_serial_id');
const deviceId = global.get('viess_device_id');

let headers = {'Authorization': 'Bearer ' + access_token};
let res;

// get installation id
res = await fetch('https://api.viessmann.com/iot/v1/equipment/installations/' + installationId + '/gateways/' + gatewaySerial + '/devices/' + deviceId + '/features/', 
{
  headers: headers,
});

if(!res.ok){
  throw new Error('Error getting features:' + res.statusText);
}

let response = JSON.parse(await res.text());
console.log(response.data);

var length = response.data.length;
for (var i = 0; i < length; i++)
{
  // je n'utilise que le programme jour dans la chaudière!!!
  if (response.data[i].feature == 'heating.circuits.0.operating.programs.normal')
  {
    if(response.data[i].isEnabled === true)
    {
        global.set('viess_mode', 'normal');
        global.set('viess_target_temperature', response.data[i].properties.temperature.value);
        console.log('normal');
    }
  }

  if (response.data[i].feature == 'device.messages.errors.raw')
  {
    console.log(response.data[i].properties.entries);
  }

  /*if (response.data[i].feature == 'heating.circuits.0.operating.programs.holiday')
  {
    if(response.data[i].isEnabled === true)
    {
        global.set('viess_mode', 'holiday');
        global.set('viess_target_temperature', response.data[i].properties.temperature.value);
        console.log('holiday');
    }
  }

  if (response.data[i].feature == 'heating.circuits.0.operating.programs.reduced')
  {
    if(response.data[i].isEnabled === true)
    {
        global.set('viess_mode', 'reduced');
        global.set('viess_target_temperature', response.data[i].properties.temperature.value);
        console.log('reduced');
    }
  }

  if (response.data[i].feature == 'heating.circuits.0.operating.programs.manual')
  {
    if(response.data[i].isEnabled === true)
    {
        global.set('viess_mode', 'manual');
        global.set('viess_target_temperature', response.data[i].properties.temperature.value);
        console.log('manual');
    }
  }*/

  if(response.data[i].feature == 'heating.circuits.0.operating.modes.active')
  {
    global.set('viess_operating_mode', response.data[i].properties.value.value);
  }

  let thermostatMode = '';
  let waterThermostatMode = '';
  switch (global.get('viess_operating_mode'))
   {
      case 'dhw':
         waterThermostatMode = 'HEAT';
         thermostatMode = 'off';
         break;
      case 'dhwAndHeating':
         waterThermostatMode = 'AUTO';
         thermostatMode = 'auto';
        break;
      case 'forcedNormal':
      case 'forcedReduced':
         waterThermostatMode = 'OFF';
         thermostatMode = 'heat';
         break;
      default:
         waterThermostatMode = 'OFF';
         thermostatMode = 'off';
         break;
   }

   global.set('viess_thermostat_mode', thermostatMode);
}