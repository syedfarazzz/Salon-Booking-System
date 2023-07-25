
//Custom logic for generating PromoCode and sending email
const crypto = require('crypto');

module.exports = {
    async afterCreate(event) {
        const {result} = event;

        if (result.status === "completed"){
            const randCode = crypto.randomBytes(3).toString('hex');
            const userInitials = result.user_email.substring(0, 5);
            const promoCode = userInitials + randCode;
        try{
            await strapi.plugins['email'].services.email.send({
                to: result.user_email,
                from: 'info@everlybeauty.ca',
                subject: 'Promo Code',
                text: `Your Promo Code is: ${promoCode}`
            });
            
            const updatedUserSlot = await strapi.db.query('api::discount.discount').create({
                        data: { promoCode: promoCode } // Data to be updated
                });




            //Update the UserSlot record in the database with the promoCode
        //     const updatedUserSlot = await strapi.db.query('api::user-slot.user-slot').update({
        //         where: { id: result.id }, // Filter to find the record by its ID
        //         data: { promoCode: promoCode } // Data to be updated
        // });
        }
        catch(err){
            console.log(err);
        }
    }

    }
}