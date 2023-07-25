'use strict';

/**
 * rate-and-review service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::rate-and-review.rate-and-review');
