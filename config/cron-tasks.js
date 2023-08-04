module.exports = {

    myJob: {
        task: async ({ strapi }) => 
        {
            try
            {
                console.log("Running userslot check");
                
                const currentDate = new Date();
                const dateOnly = currentDate.toISOString().split('T')[0];
                // console.log(dateOnly);
                

                /* Add your own logic here */
                const slotsToBeUpdated = await strapi.db.query('api::user-slot.user-slot').findMany(
                {
                    where: 
                    {
                        status: 'booked',
                        date: 
                        {
                            $lt: dateOnly
                        }

                    },
                }
                );

                // console.log(slotsToBeUpdated);

                
                // Update the status of the user slots to "booked".
                const updatedUserSlots = await Promise.all(
                    slotsToBeUpdated.map( userSlot => 
                    {
                        return strapi.service('api::user-slot.user-slot').update(
                        userSlot.id, // Filter to find the record by its ID
                        {data: { status: "Didn't show up" }} // Data to be updated
                        )
                    }
                    )
                )
                  

                console.log(`Updated ${updatedUserSlots.length} user slots to "Didn't show up" on ${currentDate}`);
            }

            catch (error) 
            {
                console.error('Error updating user slots:', error);
            }
        },

      options: {
        // The cron schedule: Run at 9:00 PM every day in the Canada/Eastern timezone.
        rule: "0 0 21 * * *",
        tz: "Canada/Eastern",
        // tz: "Asia/Karachi"
      },
    },
  };