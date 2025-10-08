import logger from '#config/logger.js';
import { createUser } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { formatValidationError } from '#utils/format.js';
import { jwtToken } from '#utils/jwt.js';
import { signUpSchema } from '#validations/auth.validation.js';

export const signUp = async (req, res, next) => {
  try {
    const validationResult = signUpSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { name, email, password, role } = validationResult.data;

    const newUser = await createUser({ name, email, password, role });

    const jwt = jwtToken.sign({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    cookies.set(res, 'token', jwt);

    res.status(201).json({
      message: 'User registered',
      user: newUser,
    });
  } catch (error) {
    logger.error('Sign up error ', error);

    if (error.message === 'User with this email already exists') {
      return res.status(409).json({
        error: 'Email already exist!',
      });
    }

    next(error);
  }
};
