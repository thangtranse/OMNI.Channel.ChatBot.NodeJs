# OMNI CHANNEL BOT

# About:
BOT's will help you connect 'omni channel' with platform Rocket.Chat
- [x] Facebook
- [x] Viber
- [x] Skype
- [x] Zalo
- [ ] Telegram

# Setup .ENV : 
You must register "Webhook" and get parameter config of the platforms Facebook Messenger, viber, zalo, ... and fill in this file .env

Include arguments:

  Facebook:
  
      FACEBOOK_CLIENT_ID = [your client id]
      FACEBOOK_CLIENT_SECRET = [your client secret]
      FACEBOOK_CALLBACK_URL = [your url call back]
      FACEBOOK_PAGE_ACCESS_TOKEN = [acces token of page]
      
  SKYPE:
  
      SKYPE_GRANT_TYPE = []
      SKYPE_CLIENT_ID = []
      SKYPE_CLIENT_SECRET = []
      SKYPE_SCOPE = [This url to call API AZURE]
      
  ZALO:
  
      ZALO_APP_ID = []
      ZALO_REDIRECT_URI = [YOU MUST REGISTER URL THIS WITH ZALO]
      ZALO_SECRETKEY = []
      ZALO_TOKEN = [ACCESS TOKEN OF ACCOUNT TO USE API ZALO]
      
  VIBER
  
      VIBER_TOKEN = []

  ROCKET CHAT
  
     ROCKET_USERNAME = [User name of BOT],
     ROCKET_USERID = [USER id of BOT],
     ROCKET_TOKEN = [TOKEN of BOT]
     ROCKET_URL_API_ROCKET = [URL Call API of your Rocket.Chat]

  MONGO DB
  
    MONGODB_URL = [You can use DB other and fill parameter connect to db at this]
    MONGODB_DB_NAME = [Your DB name]
    MONGODB_COLLECTION = [Your collection of DN]  
      
  URL_WEBHOOK _
  
    URL_WEBHOOK_VIBER = [URL WEBHOOK you had register with platform chat viber]
    URL_WEBHOOK_SKYPE = [URL WEBHOOK you had register with platform chat SKYPE]
    URL_WEBHOOK_FACEBOOK = [URL WEBHOOK you had register with platform chat FACEBOOK]
    URL_WEBHOOK_ZALO = [URL WEBHOOK you had register with platform chat ZALO]
    
   
# RUN PROJECT: 

  NODEJS
  
      1. Setup .env
      
      2. npm install
      
      3. npm start
      
  DOCKER (version old. I will update early)
  
      1. docker-compose up
