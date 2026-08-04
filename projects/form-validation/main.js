import { asyncCompose } from "./utils";

// The shared context
function createCtx(formData) {
  return {
    data: { ...formData }, // input data, will be mutated
    errors: [], // validation errors
    warnings: [],
  };
}

// Middleware functions
const validateEmail = async (ctx, next) => {
  const email = ctx.data.email;
  if (!email) {
    ctx.errors.push("Email is required");
  } else if (!email.includes("@")) {
    ctx.errors.push("Email is invalid");
  }
  await next();
};

const validatePassword = async (ctx, next) => {
  const pwd = ctx.data.password;
  if (!pwd) {
    ctx.errors.push("Password is required");
  } else if (pwd.length < 8) {
    ctx.errors.push("Password must be at least 8 characters");
  }
  await next();
};

const normalizePhone = async (ctx, next) => {
  if (ctx.data.phone) {
    // Keep only digits
    ctx.data.phone = ctx.data.phone.replace(/\D/g, "");
  }
  await next();
};

const ensureTermsAccepted = async (ctx, next) => {
  if (!ctx.data.terms) {
    ctx.errors.push("You must accept the terms");
  }
  await next();
};

const abortIfErrors = async (ctx, next) => {
  if (ctx.errors.length > 0) return; // stop chain
  await next();
};

// Compose the pipeline (can be dynamic per route)
function createValidationPipeline() {
  return asyncCompose([
    abortIfErrors,
    validateEmail,
    validatePassword,
    normalizePhone,
    ensureTermsAccepted,
  ]);
}

// Usage
async function submitForm(formData) {
  const ctx = createCtx(formData);
  const pipeline = createValidationPipeline();

  await pipeline(ctx);

  if (ctx.errors.length > 0) {
    return { success: false, errors: ctx.errors, data: ctx.data };
  }
  // Proceed to database, etc.
  return { success: true, data: ctx.data };
}

// Test
submitForm({ email: "bad", password: "123" }).then(console.log);
// {
//   success: false,
//   errors: [ 'Email is invalid', 'Password must be at least 8 characters', 'You must accept the terms' ],
//   data: { email: 'bad', password: '123' }
// }
