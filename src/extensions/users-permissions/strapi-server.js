const user = require('./content-types/user');

module.exports = (plugin) => 
{    

    plugin.controllers.user.studentDiscount = async (ctx) => 
    {
        const { isStudent } = ctx.request.body.data;
        const id = ctx.request.params.id;

        if (isStudent === true)
        {
            var user = await strapi.entityService.findOne('plugin::users-permissions.user', id);
            
            if (user.isStudent === false) 
            {
                const updatedCredits = +user.studentCredit + 50;

                var res = await strapi.entityService.update('plugin::users-permissions.user', id, 
                {
                    data: 
                    {
                        studentCredit: updatedCredits,
                        isStudent: true
                    } 
                });
                
                ctx.body = res;
            }
            else{
                return ctx.body = { message: 'Customer has already availed Student Discount' };
            }

            
        }
        else{
            return ctx.body = { message:'Kindly Select the discount' };
        }
        
            
        
    }

    plugin.contentTypes.user = user;

    // Routes
        /**
        Adds a POST method route that is handled by the studentDiscount function above.
        **/
        plugin.routes['content-api'].routes.push({
                method: 'POST',
                path: '/users/student/:id',
                handler: 'user.studentDiscount',
                config: {
                    prefix: '',
                    policies: []
                }
        },
        );

    

    return plugin;
}