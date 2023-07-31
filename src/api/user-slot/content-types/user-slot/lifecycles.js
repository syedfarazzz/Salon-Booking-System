
//Custom logic for generating PromoCode and sending email
const { errors } = require('@strapi/utils');
const { ApplicationError } = errors;
const crypto = require('crypto');
// const { DuplicateEntry } = require("@strapi/utils").errors;

module.exports = 
{
    async beforeCreate(event) 
    {
        const { result, params } = event;
        
        const newEntryDate = params.data.date;
        const newEntryStartTime = params.data.start;
        const newEntryEndTime = params.data.end;
        
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
            // throw new DuplicateEntry(errorMessage);
            throw new ApplicationError('A slot with the same date and time already exists.');
            // Respond with an error message and an appropriate status code (e.g., 400 Bad Request)

            // res.status(400).json({ error: 'A slot with the same date and time already exists.' });
        }
    },
    
    async afterCreate(event) 
    {
        const { result, params } = event;

        if (result.status === "completed")
        {
            const cryptoCode = crypto.randomBytes(3).toString('hex');
            const userInitials = result.user_email.substring(0, 5);
            const promoCode = userInitials + cryptoCode;
                
            try
            {
                await strapi.plugins['email'].services.email.send
                ({
                    to: result.user_email,
                    from: 'info@everlybeauty.ca',
                    subject: 'Promo Code',
                    text: `Your Promo Code is: ${promoCode}`
                });    
            }

            catch(err)
            {
                console.log(err);
            }

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