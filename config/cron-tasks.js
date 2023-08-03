// module.exports = {

//     myJob: {
//         task: async ({ strapi }) => 
//         {
//             try
//             {
//                 console.log("Running userslot check");
//                 const currentDate = new Date();
//                 /* Add your own logic here */
//                 const slotsToBeUpdated = await strapi.db.query('api::user-slot.user-slot').findMany(
//                 {
//                     where: 
//                     {
//                         status: 'booked',
//                         date: 
//                         {
//                             $lt: currentDate
//                         }

//                     },
//                 }
//                 );

//                 // Update the status of the user slots to "booked".
//                 const updatedUserSlots = await Promise.all(
//                     slotsToBeUpdated.map( userSlot => 
//                     {
//                         return strapi.service('api::user-slot.user-slot').update(
//                         userSlot.id, 
//                         { status: "Didn't show up" });
//                     })
//                   );

//                 console.log(`Updated ${updatedUserSlots.length} user slots to "booked" at ${currentDate}`);
//             }

//             catch (error) 
//             {
//                 console.error('Error updating user slots:', error);
//             }
//         },

//       options: {
//         // The cron schedule: Run at 9:00 PM every day in the Canada/Eastern timezone.
//         rule: "0 0 16 * * *",
//         tz: "Canada/Eastern",
//       },
//     },
//   };