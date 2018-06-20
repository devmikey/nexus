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
      resourcesUrl: 'https://smart-nexus-apps.azurewebsites.net/build/gprecordcomponent/',
      serviceWorker: false
    }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
