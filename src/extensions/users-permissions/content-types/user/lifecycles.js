const { errors } = require('@strapi/utils');
const { ApplicationError } = errors;

module.exports = {
    async afterUpdate(event) {
        const { result, params } = event;
        if (params.data && params.data.referredBy && params.data.referredBy.connect) {
            const referredBy = params.data.referredBy.connect[0];

            if (referredBy) {
                try {
                    const user = await strapi.entityService.findOne('plugin::users-permissions.user', referredBy);
                    console.log(user);
                    console.log("a");

                    if (user.isReferred === false) {
                        console.log("b");
                        const updatedCredits = +user.referralCredit + 50;
                        console.log(updatedCredits);

                        var res = await strapi.entityService.update('plugin::users-permissions.user', referredBy, {
                            data: {
                                referralCredit: updatedCredits
                            }
                        });

                        console.log("c");
                    }
                    console.log("d");
                } catch (error) {
                    console.error("Error:", error);
                }
            }
        }
    }
};

