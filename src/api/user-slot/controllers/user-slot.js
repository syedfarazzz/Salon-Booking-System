const { errors } = require('@strapi/utils');
const { ApplicationError } = errors;
'use strict';

/**
 * user-slot controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::user-slot.user-slot',  ({strapi}) => ({
    

    // customizing the create controller
    async create(ctx, next)
    {
        // console.log("create controller");
        // get user from context
        const currentUser = ctx.state.user

        // get request body data from context
        const  {date, end, payableAmount, services, start, details, userId}  = ctx.request.body.data

        const newEntryDate = ctx.request.body.data.date;
        const newEntryStartTime = ctx.request.body.data.start;

        const currentDate = new Date();

        // console.log(date);
        // console.log(date, end, payableAmount, services, start, user_email);
        
        // console.log(currentUser)
        // console.log("-------");

        try
        {
            // Input date from the request body
            const dateFromInput = new Date(newEntryDate);

            // Extract year and month from the input date
            const yearFromInput = dateFromInput.getFullYear();
            const monthFromInput = dateFromInput.getMonth();
            // console.log(`Year from input: ${yearFromInput}, Month from input: ${monthFromInput}`);

            // Extract current year and month
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            // console.log(`Current year: ${currentYear}, Current month: ${currentMonth}`);

            // Calculate the difference in months
            const monthDifference = (yearFromInput - currentYear) * 12 + (monthFromInput - currentMonth);

            //validation for not booking a duplicate slot for the same time
            
            // const entries = await strapi.entityService.findMany('api::review.review', {
            const sameTimeSlot = await strapi.db.query('api::user-slot.user-slot').findMany(
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

            //validation for if a user try to book slot twice for same date.
            const sameUserDate = await strapi.db.query('api::user-slot.user-slot').findMany(
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
                                user: userId==null? currentUser.id:userId 
                            },
                        ],
                    }
                }
            );
            
            
            if (sameTimeSlot.length > 0 )
            {
                // throw new Error('A slot with the same date and time already exists.');
                
                return ctx.badRequest('A slot with the same date and time already exists.');
                
                // Respond with an error message and an appropriate status code (e.g., 400 Bad Request)
    
                // res.status(400).json({ error: 'A slot with the same date and time already exists.' });
            }  

            else if (sameUserDate.length > 0) {    
                return ctx.badRequest('You have already booked a slot for today.');
            }

            else if (monthDifference > 2){
                return ctx.badRequest('You cannot book a slot for more than 2 months ahead.');
            }

            else 
            {
                // console.log("create method run");
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
                        details,
                        // pass in the owner id to define the owner
                        user: userId==null? currentUser.id:userId,
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
