// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {

    if (err && (err.message === "validation error" || err.message === 'Validation Failed')) {
        let messages = [];
        let mesasgeType = null;

        if (err?.details?.body && Array.isArray(err?.details?.body)) {
            messages = err.details.body.map((e) => e.message);
            mesasgeType = err.details.body.map((e) => e.type);
        } else if (err?.details?.query && Array.isArray(err?.details?.query)) {
            messages = err.details.query.map((e) => e.message);
            mesasgeType = err.details.query.map((e) => e.type);
        }

        if (mesasgeType[0] !== 'any.unknown') {
            if (messages.length && messages.length > 1) {
                messages = `${messages.join(", ")} are required fields`;
            } else {
                messages = `${messages.join(", ")}  field`;
            }
        } else {
            messages = messages[0];
        }
        return generateResponse(req, res, StatusCodes.BAD_REQUEST, false, messages);
    }
};

export default errorHandler;
