# nexus
Demo SMART on FHIR App

git clone https://github.com/devmikey/nexus.git

cd nexus

npm install

create an .env file to hold the environment variables

AUTH0_CLIENT_ID=YOUR CLIENT ID
AUTH0_DOMAIN=YOUR AUTH DOMAIN
AUTH0_CLIENT_SECRET=SECRET KEY FROM AUTH SERVICE

AUTH0_AUTH_URI=authorization endpoint
AUTH0_TOKEN_URI=token endpoint

LOCAL_SMART_SVR=http://127.0.0.1:4000
AZURE_SMART_SVR=this is your hosted endpoint
RESOURCE_SVR=the resource server feeding the APIs

ACTIVE=LOCAL

## build the webcomponent
npm run build

## run the SMART APP Server
npm run dev

## Configure Smart health launcher
browse to http://launch.smarthealthit.org

enter App Launch URL http://127.0.0.1:4000/launch

Launch App!
