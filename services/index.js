const createCreatorCard = require('./creator-cards/create-creator-card');
const getCreatorCard = require('./creator-cards/get-creator-card');
const deleteCreatorCard = require('./creator-cards/delete-creator-card');

const CreatorCardServices = {
  createCreatorCard,
  getCreatorCard,
  deleteCreatorCard,
};

module.exports = {
  CreatorCardServices,
};
