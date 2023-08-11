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
                        from: 'coder_dev_test@outlook.com',
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