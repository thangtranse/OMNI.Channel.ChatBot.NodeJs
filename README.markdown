# OMNI CHANNEL BOT

BOT's will help you connect 'omni channel' with platform Rocket.Chat
- [x] Facebook
- [x] Viber
- [x] Skype
- [x] Zalo
- [ ] Telegram

* Setup .ENV : 

You must register "Webhook" and get parameter config of the platforms Facebook Messenger, viber, zalo, ... and fill in this file .env

Include arguments:

  * Facebook:
  
      FACEBOOK_CLIENT_ID = [your client id]
      
      FACEBOOK_CLIENT_SECRET = [your client secret]
      
      FACEBOOK_CALLBACK_URL = [your url call back]
      
      FACEBOOK_PAGE_ACCESS_TOKEN = [acces token of page]
      
  * SKYPE:
  
      SKYPE_GRANT_TYPE = []
      
      SKYPE_CLIENT_ID = []
      
      SKYPE_CLIENT_SECRET = []
      
      SKYPE_SCOPE = [This url to call API AZURE]
      

  * ZALO:
  
      ZALO_APP_ID = []
      
      ZALO_REDIRECT_URI = [YOU MUST REGISTER URL THIS WITH ZALO]
      
      ZALO_SECRETKEY = []
      
      ZALO_TOKEN = [ACCESS TOKEN OF ACCOUNT TO USE API ZALO]
      
      
  * VIBER
  
      VIBER_TOKEN = []
      
      


