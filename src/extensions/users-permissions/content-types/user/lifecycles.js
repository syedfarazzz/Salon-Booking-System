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

                    if (user.isReferred === false) {
                        const updatedCredits = +user.referralCredit + 50;

                        var res = await strapi.entityService.update('plugin::users-permissions.user', referredBy, {
                            data: {
                                referralCredit: updatedCredits
                            }
                        });
                    }

                } catch (error) {
                    console.error("Error:", error);
                }
            }
        }
    }
};

