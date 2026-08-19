/**
 * Input validation using express-validator.
 *
 * AUDIT NOTE (finding SEC-04, part of A03:2021 Injection / A08 Data
 * Integrity): the original app had zero server-side validation and trusted
 * whatever the client sent (e.g. registering with role: "admin" in the
 * body, or a 50,000-character post body with no limit). All fields below
 * are validated AND length-capped server-side, since client-side checks
 * are trivially bypassed with curl/Postman.
 */

const { body, param, validationResult } = require('express-validator');

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
  }
  return next();
}

const registerRules = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-30 chars, alphanumeric/underscore only.'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required.'),
  body('password')
    .isLength({ min: 12 })
    .withMessage('Password must be at least 12 characters.')
    .matches(/[A-Z]/)
    .withMessage('Password must include an uppercase letter.')
    .matches(/[0-9]/)
    .withMessage('Password must include a number.'),
  // Note: role is intentionally NOT accepted from the client at all —
  // see authController.register. Listing it here would be redundant;
  // the fix is structural (never read req.body.role), not just validation.
];

const loginRules = [
  body('username').trim().notEmpty().withMessage('Username required.'),
  body('password').notEmpty().withMessage('Password required.'),
];

const postRules = [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title 1-200 chars.'),
  body('body').trim().isLength({ min: 1, max: 20000 }).withMessage('Body 1-20000 chars.'),
];

const commentRules = [
  body('body').trim().isLength({ min: 1, max: 2000 }).withMessage('Comment 1-2000 chars.'),
];

const idParamRule = [param('id').isInt({ min: 1 }).withMessage('Invalid id.')];

module.exports = {
  handleValidation,
  registerRules,
  loginRules,
  postRules,
  commentRules,
  idParamRule,
};
