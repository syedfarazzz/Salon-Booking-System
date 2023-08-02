'use strict';

/**
 * user-slot controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-slot.user-slot',  ({strapi}) => ({
    

    // customizing the create controller
    async create(ctx, next){
        // get user from context
        const user = ctx.state.user
        // get request body data from context
        const  {date, end, payableAmount, services, start, user_email}  = ctx.request.body.data
        console.log(date);
        console.log(date, end, payableAmount, services, start, user_email);
        
        console.log(user)
        console.log("-------");
        // use the create method from Strapi enitityService
        const userslot = await strapi.entityService.create("api::user-slot.user-slot", {
            data: {
                date, end, payableAmount, services, start, user_email,
            // pass in the owner id to define the owner
            user: user.id,
            populate: '*',
            }
        })
        console.log(userslot);
        return { userslot }
    },
    

    
  }));
