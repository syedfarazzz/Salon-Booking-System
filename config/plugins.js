
module.exports = ({ env }) => ({
    
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST'),
        port: env('SMTP_PORT'),
        auth: {
          type: 'login',
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
        // ... any custom nodemailer options
      },
      settings: {
        defaultFrom: 'info@everlybeauty.ca',
        defaultReplyTo: 'info@everlybeauty.ca',
      },
    },
  },

  // module.exports = {
    // ...
    upload: {
      config: {
        sizeLimit: 250 * 1024 * 1024, // 256mb in bytes
        breakpoints: {
          xlarge: 1920,
          large: 1000,
          medium: 750,
          small: 500,
          xsmall: 64,
        },
      },
    },
  // };
  
  
});

