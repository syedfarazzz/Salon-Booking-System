const { errors } = require('@strapi/utils');
const { ApplicationError } = errors;
const crypto = require('crypto');

module.exports = 
{
    /*
    async beforeCreate(event) 
    {
        console.log("before Create fn");
        const { result, params } = event;
        
        const newEntryDate = params.data.date;
        const newEntryStartTime = params.data.start;
        
        try 
        {
            //  const entries = await strapi.entityService.findMany('api::review.review', {
            const entries = await strapi.db.query('api::user-slot.user-slot').findMany(
            {    
                // fields: ['myDate', 'startTime', 'endTime'],
                    
                where: 
                {
                    $and: 
                    [
                        { 
                            date: newEntryDate,
                        }, 
                        {
                            start: newEntryStartTime 
                        },
                    ],
                }
            }
            );
    
            if (entries.length > 0 )
            {
                // throw new Error('A slot with the same date and time already exists.');
                
                throw new ApplicationError('A slot with the same date and time already exists.');
                // Respond with an error message and an appropriate status code (e.g., 400 Bad Request)
    
                // res.status(400).json({ error: 'A slot with the same date and time already exists.' });
            }

        }
        catch(err)
        {
            console.log(err);
        }
        
    },
    */
    
    /*  promo-code is commented bcz it is just for marketing purpose now and not being used at the moment
    async afterUpdate(event) 
    {
        const { result, params } = event;

        // console.log(result);
        // console.log("--------");

        // const user = await strapi.entityService.findOne('api::user-slot.user-slot', {
        //     where: { id: result.id },
        //     populate: '*',
        // });

        try
        {
            const entity = await strapi.db.query('api::user-slot.user-slot').findOne(
                {
                    where: { id: result.id }, populate: true
                }
            );
    
            const email = entity.user.email;

            //Custom logic for generating PromoCode and sending email
            if (result.status === "completed")
            {
                const cryptoCode = crypto.randomBytes(3).toString('hex');
                const userInitials = email.substring(0, 5);
                const promoCode = userInitials + cryptoCode;
                    
                try
                {
                    await strapi.plugins['email'].services.email.send
                    ({
                        to: email,
                        from: process.env.SMTP_USERNAME,
                        subject: 'Promo Code',
                        text: `Your Promo Code is: ${promoCode}`
                    });    
    
                    const createdPromo = await strapi.db.query('api::discount.discount').create({
                        data: 
                        {
                            promoCode: promoCode,
                            
                            discountUser: entity.user.id
                        } // Data to be Created
                    });
                }
    
                catch(err)
                {
                    console.log(err);
                }
            }
        }
        catch(errr)
        {
            console.log(errr);
        }
    },
    */

    async afterCreate(event) 
    {
        const { result, params } = event;

        // console.log("result" , result);
        try
        {
            const entity =  await strapi.entityService.findOne('api::user-slot.user-slot', result.id , 
                {
                    populate: 
                    {
                        user: 
                        {
                            fields: ['id', 'username', 'email', 'firstName', 'lastName'],
                            populate:
                            {
                                informed_consent_form:
                                {
                                    fields: ['*']
                                }
                            }
                        },
                    }
                    // where: { id: result.id }, populate: true
                }
            );
            
            if (entity.user.informed_consent_form === null) 
            {
            // Informed Consent Form
            const createdForm1 = await strapi.entityService.create("api::informed-consent-form.informed-consent-form", 
                {
                    data: 
                    {
                        // pass in the owner id to define the owner
                        client: entity.user.id,
                        publishedAt: new Date()
                    }
                })

            // CLient Assessment Form
            const createdForm2 = await strapi.entityService.create("api::client-assessment-form.client-assessment-form", 
            {
                data: 
                {
                    // pass in the owner id to define the owner
                    client: entity.user.id,
                    publishedAt: new Date()
                }
            })
    
            const email = entity.user.email;
                //if NULL
                try
                {
                    await strapi.plugins['email'].services.email.send
                    ({
                        to: email,
                        from: process.env.SMTP_USERNAME,
                        subject: 'Consent Form Email',
                        // text: `Kindly open these links to fill the forms`,
                        html: `Kindly open these links to fill the forms,<br><br>
                               <a href="${process.env.FRONTEND_URL}/consent?${createdForm1.id}">Click here to open the Consent Form</a><br><br>
                               <a href="${process.env.FRONTEND_URL}/assessment?${createdForm2.id}">Click here to open Client Assessment Form</a><br><br>
                               Best regards,<br>
                               EVERLY BEAUTY`
                    });    
                }

                catch(err)
                {
                    console.log(err);
                }
            }
        }
        catch(err)
        {
            console.log(err);
        }
    }
}

// module.exports = {
//     async afterCreate(event) {
//         const {result} = event;

//         if (result.status === "completed"){
//             const randCode = crypto.randomBytes(3).toString('hex');
//             const userInitials = result.user_email.substring(0, 5);
//             const promoCode = userInitials + randCode;
//         try{
//             await strapi.plugins['email'].services.email.send({
//                 to: result.user_email,
//                 from: 'info@everlybeauty.ca',
//                 subject: 'Promo Code',
//                 text: `Your Promo Code is: ${promoCode}`
//             });
            
//             const updatedUserSlot = await strapi.db.query('api::discount.discount').create({
//                         data: { promoCode: promoCode } // Data to be updated
//                 });


//                 strapi.log.debug("your string or object")


//                 // console.log(updatedUserSlot);

//             //Update the UserSlot record in the database with the promoCode
//         //     const updatedUserSlot = await strapi.db.query('api::user-slot.user-slot').update({
//         //         where: { id: result.id }, // Filter to find the record by its ID
//         //         data: { promoCode: promoCode } // Data to be updated
//         // });
//         }
//         catch(err){
//             console.log(err);
//         }
//     }

//     }
// }