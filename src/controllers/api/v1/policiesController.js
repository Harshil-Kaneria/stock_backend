import { Policies } from "../../../models";

const policiesController = {
    fetchPolicies: async (req, res) => {
        try {
            const { type } = req.body;
            let policies_data = await Policies.findOne({ where: { type } });
            policies_data = { ...policies_data.get() };

            delete policies_data.id
            delete policies_data.updatedAt
            delete policies_data.createdAt

            return generateResponse(
                req,
                res,
                StatusCodes.OK,
                true,
                "Data fetched successfully",
                { data: policies_data }
            );
        } catch (error) {
            return generateResponse(
                req,
                res,
                StatusCodes.INTERNAL_SERVER_ERROR,
                false,
                error.message || 'Something went wrong !',
                {}
            );
        }
    }
}

module.exports = policiesController;