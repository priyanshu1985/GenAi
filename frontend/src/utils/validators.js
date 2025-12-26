import { REGEX_PATTERNS, ERROR_CODES } from "./constants";

// Validation error class
export class ValidationError extends Error {
  constructor(message, field = null, code = ERROR_CODES.VALIDATION_ERROR) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.code = code;
  }
}

// Email validation
export const validateEmail = (email) => {
  if (!email || typeof email !== "string") {
    throw new ValidationError("Email is required", "email");
  }

  if (email.length > 254) {
    throw new ValidationError("Email is too long", "email");
  }

  if (!REGEX_PATTERNS.EMAIL.test(email.trim())) {
    throw new ValidationError("Please enter a valid email address", "email");
  }

  return email.trim().toLowerCase();
};

// Password validation
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    maxLength = 128,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
    allowSpaces = false,
  } = options;

  if (!password || typeof password !== "string") {
    throw new ValidationError("Password is required", "password");
  }

  if (password.length < minLength) {
    throw new ValidationError(
      `Password must be at least ${minLength} characters long`,
      "password"
    );
  }

  if (password.length > maxLength) {
    throw new ValidationError(
      `Password must be no more than ${maxLength} characters long`,
      "password"
    );
  }

  if (!allowSpaces && /\s/.test(password)) {
    throw new ValidationError("Password cannot contain spaces", "password");
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    throw new ValidationError(
      "Password must contain at least one uppercase letter",
      "password"
    );
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    throw new ValidationError(
      "Password must contain at least one lowercase letter",
      "password"
    );
  }

  if (requireNumbers && !/\d/.test(password)) {
    throw new ValidationError(
      "Password must contain at least one number",
      "password"
    );
  }

  if (requireSpecialChars && !/[@$!%*?&]/.test(password)) {
    throw new ValidationError(
      "Password must contain at least one special character (@$!%*?&)",
      "password"
    );
  }

  return password;
};

// Confirm password validation
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword || typeof confirmPassword !== "string") {
    throw new ValidationError(
      "Password confirmation is required",
      "confirmPassword"
    );
  }

  if (password !== confirmPassword) {
    throw new ValidationError("Passwords do not match", "confirmPassword");
  }

  return confirmPassword;
};

// Name validation
export const validateName = (name, field = "name", options = {}) => {
  const {
    minLength = 1,
    maxLength = 50,
    allowNumbers = false,
    allowSpecialChars = false,
  } = options;

  if (!name || typeof name !== "string") {
    throw new ValidationError(
      `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
      field
    );
  }

  const trimmedName = name.trim();

  if (trimmedName.length < minLength) {
    throw new ValidationError(
      `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } must be at least ${minLength} characters long`,
      field
    );
  }

  if (trimmedName.length > maxLength) {
    throw new ValidationError(
      `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } must be no more than ${maxLength} characters long`,
      field
    );
  }

  if (!allowNumbers && /\d/.test(trimmedName)) {
    throw new ValidationError(
      `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } cannot contain numbers`,
      field
    );
  }

  if (
    !allowSpecialChars &&
    /[^a-zA-Z\s\u00C0-\u017F\u0100-\u024F]/.test(trimmedName)
  ) {
    throw new ValidationError(
      `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } contains invalid characters`,
      field
    );
  }

  return trimmedName;
};

// Username validation
export const validateUsername = (username) => {
  if (!username || typeof username !== "string") {
    throw new ValidationError("Username is required", "username");
  }

  const trimmedUsername = username.trim();

  if (!REGEX_PATTERNS.USERNAME.test(trimmedUsername)) {
    throw new ValidationError(
      "Username must be 3-20 characters long and contain only letters, numbers, and underscores",
      "username"
    );
  }

  if (trimmedUsername.startsWith("_") || trimmedUsername.endsWith("_")) {
    throw new ValidationError(
      "Username cannot start or end with an underscore",
      "username"
    );
  }

  return trimmedUsername;
};

// Phone number validation
export const validatePhone = (phone, required = false) => {
  if (!phone || typeof phone !== "string") {
    if (required) {
      throw new ValidationError("Phone number is required", "phone");
    }
    return null;
  }

  const cleanPhone = phone.replace(/\s/g, "");

  if (!REGEX_PATTERNS.PHONE.test(cleanPhone)) {
    throw new ValidationError("Please enter a valid phone number", "phone");
  }

  if (cleanPhone.length < 10 || cleanPhone.length > 15) {
    throw new ValidationError(
      "Phone number must be between 10 and 15 digits",
      "phone"
    );
  }

  return cleanPhone;
};

// Age validation
export const validateAge = (age, options = {}) => {
  const { min = 1, max = 120, required = true } = options;

  if (!age && !required) {
    return null;
  }

  const numericAge = typeof age === "string" ? parseInt(age, 10) : age;

  if (!Number.isInteger(numericAge) || numericAge < min || numericAge > max) {
    throw new ValidationError(
      `Age must be a number between ${min} and ${max}`,
      "age"
    );
  }

  return numericAge;
};

// Date validation
export const validateDate = (date, field = "date", options = {}) => {
  const { required = true, minDate = null, maxDate = null } = options;

  if (!date) {
    if (required) {
      throw new ValidationError(
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
        field
      );
    }
    return null;
  }

  let dateObj;
  if (typeof date === "string") {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    throw new ValidationError(`Invalid ${field} format`, field);
  }

  if (isNaN(dateObj.getTime())) {
    throw new ValidationError(`Invalid ${field} format`, field);
  }

  if (minDate && dateObj < new Date(minDate)) {
    throw new ValidationError(
      `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } cannot be earlier than ${minDate}`,
      field
    );
  }

  if (maxDate && dateObj > new Date(maxDate)) {
    throw new ValidationError(
      `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } cannot be later than ${maxDate}`,
      field
    );
  }

  return dateObj;
};

// URL validation
export const validateUrl = (url, required = false) => {
  if (!url || typeof url !== "string") {
    if (required) {
      throw new ValidationError("URL is required", "url");
    }
    return null;
  }

  const trimmedUrl = url.trim();

  if (!REGEX_PATTERNS.URL.test(trimmedUrl)) {
    throw new ValidationError("Please enter a valid URL", "url");
  }

  return trimmedUrl;
};

// File validation
export const validateFile = (file, options = {}) => {
  const {
    required = true,
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [],
    allowedExtensions = [],
  } = options;

  if (!file) {
    if (required) {
      throw new ValidationError("File is required", "file");
    }
    return null;
  }

  if (!(file instanceof File)) {
    throw new ValidationError("Invalid file object", "file");
  }

  if (file.size > maxSize) {
    const sizeMB = Math.round(maxSize / (1024 * 1024));
    throw new ValidationError(
      `File size must be less than ${sizeMB}MB`,
      "file"
    );
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    throw new ValidationError(
      `File type must be one of: ${allowedTypes.join(", ")}`,
      "file"
    );
  }

  if (allowedExtensions.length > 0) {
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      throw new ValidationError(
        `File extension must be one of: ${allowedExtensions.join(", ")}`,
        "file"
      );
    }
  }

  return file;
};

// Audio file validation (for voice recordings)
export const validateAudioFile = (file, options = {}) => {
  const audioOptions = {
    required: true,
    maxSize: 25 * 1024 * 1024, // 25MB
    allowedTypes: ["audio/wav", "audio/mp3", "audio/webm", "audio/ogg"],
    allowedExtensions: ["wav", "mp3", "webm", "ogg"],
    ...options,
  };

  return validateFile(file, audioOptions);
};

// Image file validation
export const validateImageFile = (file, options = {}) => {
  const imageOptions = {
    required: true,
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    allowedExtensions: ["jpg", "jpeg", "png", "gif", "webp"],
    ...options,
  };

  return validateFile(file, imageOptions);
};

// Text length validation
export const validateTextLength = (text, field, options = {}) => {
  const { minLength = 0, maxLength = 1000, required = true } = options;

  if (!text || typeof text !== "string") {
    if (required) {
      throw new ValidationError(
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
        field
      );
    }
    return null;
  }

  const trimmedText = text.trim();

  if (trimmedText.length < minLength) {
    throw new ValidationError(
      `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } must be at least ${minLength} characters long`,
      field
    );
  }

  if (trimmedText.length > maxLength) {
    throw new ValidationError(
      `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } must be no more than ${maxLength} characters long`,
      field
    );
  }

  return trimmedText;
};

// Array validation
export const validateArray = (arr, field, options = {}) => {
  const { minItems = 0, maxItems = 100, required = true } = options;

  if (!arr) {
    if (required) {
      throw new ValidationError(
        `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
        field
      );
    }
    return null;
  }

  if (!Array.isArray(arr)) {
    throw new ValidationError(
      `${field.charAt(0).toUpperCase() + field.slice(1)} must be an array`,
      field
    );
  }

  if (arr.length < minItems) {
    throw new ValidationError(
      `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } must have at least ${minItems} items`,
      field
    );
  }

  if (arr.length > maxItems) {
    throw new ValidationError(
      `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } must have no more than ${maxItems} items`,
      field
    );
  }

  return arr;
};

// Form validation helper
export const validateForm = (data, rules) => {
  const errors = {};
  const validatedData = {};

  for (const [field, rule] of Object.entries(rules)) {
    try {
      const validator = rule.validator;
      const options = rule.options || {};
      const value = data[field];

      if (validator) {
        validatedData[field] = validator(value, field, options);
      } else {
        validatedData[field] = value;
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        errors[field] = error.message;
      } else {
        errors[field] = "Validation error occurred";
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: validatedData,
  };
};

// Common validation rules for forms
export const FORM_RULES = {
  registration: {
    firstName: {
      validator: validateName,
      options: { minLength: 2, maxLength: 30 },
    },
    lastName: {
      validator: validateName,
      options: { minLength: 2, maxLength: 30 },
    },
    email: {
      validator: validateEmail,
    },
    password: {
      validator: validatePassword,
      options: { minLength: 8 },
    },
    confirmPassword: {
      validator: (value, field, options, data) =>
        validatePasswordConfirmation(data.password, value),
    },
    dateOfBirth: {
      validator: validateDate,
      options: {
        maxDate: new Date().toISOString(),
        minDate: new Date(1900, 0, 1).toISOString(),
      },
    },
  },

  login: {
    email: {
      validator: validateEmail,
    },
    password: {
      validator: (value) => {
        if (!value) {
          throw new ValidationError("Password is required", "password");
        }
        return value;
      },
    },
  },

  profile: {
    firstName: {
      validator: validateName,
      options: { minLength: 2, maxLength: 30 },
    },
    lastName: {
      validator: validateName,
      options: { minLength: 2, maxLength: 30 },
    },
    username: {
      validator: validateUsername,
    },
    phone: {
      validator: validatePhone,
      options: { required: false },
    },
    bio: {
      validator: validateTextLength,
      options: { maxLength: 500, required: false },
    },
  },

  session: {
    lessonId: {
      validator: (value) => {
        if (!value) {
          throw new ValidationError("Lesson ID is required", "lessonId");
        }
        return value;
      },
    },
    userId: {
      validator: (value) => {
        if (!value) {
          throw new ValidationError("User ID is required", "userId");
        }
        return value;
      },
    },
  },
};

// Sanitize HTML input
export const sanitizeHtml = (html) => {
  if (!html || typeof html !== "string") return "";

  // Basic HTML sanitization - remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/\s*on\w+\s*=\s*"[^"]*"/g, "")
    .replace(/\s*on\w+\s*=\s*'[^']*'/g, "")
    .replace(/\s*javascript\s*:/gi, "")
    .replace(/\s*vbscript\s*:/gi, "");
};

// Validate and sanitize user input
export const validateAndSanitizeInput = (
  input,
  type = "text",
  options = {}
) => {
  let validated;

  switch (type) {
    case "email":
      validated = validateEmail(input);
      break;
    case "name":
      validated = validateName(input, "name", options);
      break;
    case "text":
      validated = validateTextLength(input, "text", options);
      break;
    case "html":
      validated = sanitizeHtml(input);
      break;
    default:
      validated = input;
  }

  return validated;
};

export default {
  ValidationError,
  validateEmail,
  validatePassword,
  validatePasswordConfirmation,
  validateName,
  validateUsername,
  validatePhone,
  validateAge,
  validateDate,
  validateUrl,
  validateFile,
  validateAudioFile,
  validateImageFile,
  validateTextLength,
  validateArray,
  validateForm,
  FORM_RULES,
  sanitizeHtml,
  validateAndSanitizeInput,
};
