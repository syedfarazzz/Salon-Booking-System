module.exports = 
{
    async afterCreate(event) 
    {
        const { result } = event;

        try
        {
            await strapi.plugins['email'].services.email.send
            ({
                to: result.email,
                from: 'coder_dev_test@outlook.com',
                subject: 'Thanks for contacting Everly Beauty',
                // text: `Dear ${result.name},\n\nWe have received your message and will get back to you shortly.`,
                html: `Dear <strong>${result.name}</strong>,<br><br>
                       We have received your message and will get back to you shortly.<br><br>
                       Best regards,<br>
                       EVERLY BEAUTY`
            });

            await strapi.plugins['email'].services.email.send
            ({
                to: 'coder_dev_test@outlook.com',
                from: 'coder_dev_test@outlook.com',
                subject: `${result.name} has contacted on EverlyBeauty`,
                // text: `${result.name} has the following query\n\n${result.message}`,
                html:  ` You have a new contact us inquiry from your website. Here are the details:<br><br>
                <strong>Name:</strong> ${result.name}<br><br>
                <strong>Email:</strong> ${result.email}<br><br>
                <strong>Phone Number:</strong> ${result.phoneNumber}<br><br>
                <strong>Message:</strong> ${result.message}<br><br>
                Please respond to the inquiry.<br><br>`

            });
        }

        catch(err)
        {
            console.log(err);
        }

    }
}
