const dotenv = require('dotenv');
dotenv.load();

var smartsvrUrl = process.env.AZURE_SMART_SVR;
if (process.env.SMART_SVR=='LOCAL')
{
  smartsvrUrl = process.env.LOCAL_SMART_SVR;
}

exports.config = {
   bundles: [
    { components: ['gprecord-component'] }
  ],
  namespace: 'gprecordcomponent',
  outputTargets:[
    { 
      type: 'dist' 
    },
    { 
      type: 'www',
      resourcesUrl: smartsvrUrl+'/build/gprecordcomponent/',
      serviceWorker: false
    }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
