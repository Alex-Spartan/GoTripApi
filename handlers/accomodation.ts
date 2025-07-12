import { APIGatewayProxyEvent, APIGatewayProxyResult,  } from "aws-lambda";
import Accomodation from "../models/Accomodation";
import connectDB from "../utils/db"

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { httpMethod, pathParameters } = event;
    const { id } = pathParameters || {};

    try {
        switch (httpMethod) {
            case 'GET':
                return id ? await getAccomodationById(event) : await getAccomodation(event);
            case 'POST':
                return await createAccomodation(event);
            case 'PUT':
                return await updateAccomodationById(event);
            case 'DELETE':
                return await deleteAccomodationById(event);
            default:
                return {
                    statusCode: 405,
                    body: JSON.stringify({ message: 'Method not allowed', error: true })
                };
        }
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
            },
            body: JSON.stringify({ message: 'Internal server error', error: true })
        };
    }
};


const getAccomodation = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    try {
        await connectDB();
        const data = await Accomodation.find();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        }
    } catch (err: any) {
        console.error('Error fetching accommodations:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: err.message, error: true }),
        }
    }
}

const createAccomodation = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    try {
        await connectDB();

        const formData = JSON.parse(event.body || '{}');
        if (!formData.title || !formData.address) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Title and address are required", error: true }),
            }
        }
        const accomodation = new Accomodation(formData);
        await accomodation.save();
        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Accomodation created successfully", accomodation, error: false }),
        }
    } catch (err: any) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: err.message, error: true }),
        }
    }
}

const getAccomodationById = async (event: APIGatewayProxyEvent) : Promise<APIGatewayProxyResult>   => {
    const { id } = event.pathParameters || {};
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Id not provided", error: true }),
        }
    }
    try {
        await connectDB();

        const data = await Accomodation.findById(id);
        if (!data) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Accommodation not found", error: true }),
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        }
    } catch (err: any) {
        console.error('Error fetching accommodation:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: err.message || 'Unknown error', error: true }),
        }
    }
}

const updateAccomodationById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { id } = event.pathParameters || {};
    const updateData = JSON.parse(event.body || '{}');
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Id not provided", error: true }),
        };
    }
    try {
        await connectDB();

        const data = await Accomodation.findById(id);
        if (!data) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Accommodation not found", error: true }),
            };
        }
        const updatedAccomodation = await Accomodation.findByIdAndUpdate(id, updateData, { new: true });
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Accommodation updated successfully", updatedAccomodation, error: false }),
        };
    } catch (err: any) {
        console.error('Error updating accommodation:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: err.message, error: true }),
        };
    }
}

const deleteAccomodationById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { id } = event.pathParameters || {};
    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Id not provided", error: true }),
        };
    }
    try {
        await connectDB();

        const data = await Accomodation.findByIdAndDelete(id);
        if (!data) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Accommodation not found", error: true }),
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Accommodation deleted successfully", error: false }),
        };
    } catch (err: any) {
        console.error('Error deleting accommodation:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: err.message, error: true }),
        };
    }
}