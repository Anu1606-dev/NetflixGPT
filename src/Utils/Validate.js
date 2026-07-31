// Regex-based validation, just like in the course
export const checkValidData = (email, password) => {
    // Basic email format check: something@something.something
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // At least 1 lowercase, 1 uppercase, 1 digit, 1 special char, min 8 chars
    const isPasswordValid =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password);

    if (!isEmailValid) return "Email ID is not valid.";
    if (!isPasswordValid)
        return "Password must be at least 8 characters, with an uppercase, lowercase, number, and special character.";

    return null; // null means "no error" — data is valid
};