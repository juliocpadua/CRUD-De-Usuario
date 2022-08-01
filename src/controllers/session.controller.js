import createSessionService from "../services/createSession.service";

const createSessionController = async (request, response) => {
  try {
    const { email, password } = request.body;
    const token = await createSessionService({ email, password });
    return response.status(200).json({ token });
  } catch (error) {
    return response.status(401).json({
      message: error.message,
    });
  }
};

export { createSessionController };
