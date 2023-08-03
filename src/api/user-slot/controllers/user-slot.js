'use strict';

/**
 * user-slot controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-slot.user-slot',  ({strapi}) => ({
    

    // customizing the create controller
    async create(ctx, next)
    {
        // get user from context
        const currentUser = ctx.state.user

        // get request body data from context
        const  {date, end, payableAmount, services, start, user_email}  = ctx.request.body.data

        // console.log(date);
        // console.log(date, end, payableAmount, services, start, user_email);
        
        // console.log(currentUser)
        // console.log("-------");

        try
        {
        // use the create method from Strapi enitityService
        const createdUserSlot = await strapi.entityService.create("api::user-slot.user-slot", 
        {
            data: 
            {
                date, 
                end, 
                payableAmount, 
                services, 
                start, 
                user_email,

                // pass in the owner id to define the owner
                user: currentUser.id,
            }
        })

        // const user = await strapi.entityService.findMany('api::user-slot.user-slot', {
        //     where: { user: currentUser.id },
        //     populate: '*',
        // });

        // console.log(createdUserSlot);
        // console.log("----------");
        // console.log(user);

            return {createdUserSlot}

        }

        catch(err)
        {
            console.log(err);
        }
    },
    
    // // customizing the update controller
    // async update(ctx, next)
    // {
    //     // get user from context
    //     const currentUser = ctx.state.user

    //     try
    //     {
    //     // use the update method from Strapi enitityService
    //     const createdUserSlot = await strapi.entityService.create("api::user-slot.user-slot", 
    //     {
    //         data: 
    //         {
    //             date, 
    //             end, 
    //             payableAmount, 
    //             services, 
    //             start, 
    //             user_email,

    //             // pass in the owner id to define the owner
    //             user: currentUser.id,
    //         }
    //     })

    //     // const user = await strapi.entityService.findMany('api::user-slot.user-slot', {
    //     //     where: { user: currentUser.id },
    //     //     populate: '*',
    //     // });

    //     // console.log(createdUserSlot);
    //     // console.log("----------");
    //     // console.log(user);

    //         return {createdUserSlot}

    //     }

    //     catch(err)
    //     {
    //         console.log(err);
    //     }
    // },
}));
