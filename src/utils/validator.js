const {BadRequestError} = require ('./error');


exports.validator = (schema,data)=>{
        // schema options
        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true // remove unknown props
        };
        const validation = schema.validate(data, options);
        const {_,error } = validation;

        if (error) {
            const message = error.details.map(x => x.message);
            throw new BadRequestError(message);
        }
  
}