import Joi from 'joi';

export const validateRoomCreation = (data: any) => {
  const schema = Joi.object({
    user1Id: Joi.number().required(),
    user2Id: Joi.number().required()
  });

  return schema.validate(data);
};
