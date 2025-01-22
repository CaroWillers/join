/**
 * Validates the user's email address.
 * @returns {boolean} Returns true if the email address is valid, otherwise false.
 */
function validateEmailAddress() {
    let emailInput = document.getElementById("email");
    let email = emailInput.value;
    let pattern = new RegExp('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}');
    let emailMessage = document.getElementById("msgBoxValidateEmail");  

    if (!pattern.test(email)) {
        emailMessage.innerHTML = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
        emailMessage.style.color = "red";
        return false;
    } else {
        emailMessage.innerHTML = "E-Mail-Adresse ist gültig.";
        emailMessage.style.color = "green";
        return true;
    }
}

/**
 * Checks the strength of the password entered by the user.
 * @returns {boolean} Returns true if the password meets the strength criteria, otherwise rturns false.
 */
function checkPasswordStrength() {
    let password = document.getElementById("password").value;
    let strengthIndicator = document.getElementById("passwordStrengthMessage");

    let pattern = new RegExp('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}');

    if (!pattern.test(password)) {
        strengthIndicator.innerHTML = "Password must be at least 8 characters, including one uppercase letter, one lowercase letter, and one number";
        strengthIndicator.style.color = "red";
        return false;
    } else {
        strengthIndicator.innerHTML = "Your password strength is ok";
        strengthIndicator.style.color = "green";
        return true;
    }
}

/**
 * Validates the input to confirm the password entered by the user.
 * @returns {boolean} Returns true if the confirmed password matches the original password, otherwise returns false.
 */
function validateConfirmedPassword() {
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm_password").value;
    let message = document.getElementById("passwordMatchMessage");

    if (password !== confirmPassword) {
        message.textContent = "Your passwords do not match";
        message.style.color = "red";
        return false;
    } else {
        message.textContent = "Your password is confirmed";
        message.style.color = "green";
        return true;
    }
}

/**
 * Toggles the visibility of the password input field and changes the visibility icon accordingly.
 * @param {string} fieldId - The ID of the password input field.
 */
function togglePassword(fieldId) {
    let input = document.getElementById(fieldId);
    let iconId = (fieldId === "password") ? "passwordIcon" : (fieldId === "newPassword") ? "newPasswordIcon" : "confirmPasswordIcon";
    let icon = document.getElementById(iconId);

    if (input.type === "password") {
        input.type = "text";
        icon.src = "./img/visibility_off.svg";
    } else {
        input.type = "password";
        icon.src = "./img/visibility.svg";
    }
}

/**
 * Changes the visibility icon of the password input field.
 * @param {HTMLElement} inputElement - The password input field element.
 */
function changeLockIcon(inputElement) {
    inputElement.nextElementSibling.src = "./img/visibility_off.svg";
}

/**
 * Checks if the Privacy Policy checkbox is checked before final signup is possible.
 * If the checkbox is not checked, displays an alert message prompting the user to accept the Privacy Policy.
 * @returns {boolean} Returns true if the Privacy Policy checkbox is checked, otherwise false.
 */
function togglePrivacyPolicyCheckbox(buttonElement) {
    let container = buttonElement.closest('.checkboxContainerSignup');
    let realCheckbox = container.querySelector(".realCheckbox");
    let checkboxImage = container.querySelector(".checkboxImage");

    realCheckbox.checked = !realCheckbox.checked;
    checkboxImage.src = realCheckbox.checked ? checkboxImage.getAttribute('data-checked') : checkboxImage.getAttribute('data-unchecked');
}

/**
 * Checks if the Privacy Policy checkbox is checked before final signup is possible
 * If the checkbox is not checked, displays an alert message prompting the user to accept the Privacy Policy.
 * @returns {boolean} Returns true if the Privacy Policy checkbox is checked, otherwise returns false.
 */
function checkPrivacyPolicy() {
    let realCheckbox = document.querySelector(".realCheckbox");
    if (!realCheckbox.checked) {
        alert("Please accept the Privacy Policy conditions");
        return false;
    }
    return true;
}

/**
 * Asynchronously loads user data from storage.
 * @returns {Promise<Array>} A promise that resolves to an array of users if found, otherwise returns an empty array.
 * @throws {Error} Throws an error if there is an issue loading the users.
 */
async function loadUsers() {
    try {
        let result = await getItem('users');
        if (result) {
            let users = JSON.parse(result);
            return users;
        } else {
            console.log("No users found in storage, returning empty array.");
            return [];
        }
    } catch (e) {
        console.error('Loading error:', e);
        return [];
    }
}

function loadGuestUser() {
    let guestData = localStorage.getItem('guestUser');
    if (guestData) {
        return JSON.parse(guestData);
    } else {
        console.error('No guest user data found in local storage.');
        return null;
    }
}

/**
 * Adds a new user after form validation and redirects to login page on success.
 * @async
 * @returns {Promise<void>}
 */
async function addUser() {
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let name = document.getElementById('name').value;

    if (!validateFormFields(email, password, name)) {
        return;
    }

    if (!checkPrivacyPolicy()) {
        return;
    }

    if (await checkIfEmailExists(email)) {
        alert("This email is already registered.");
        return;
    }

    const user = {
        name: name,
        email: email,
        password: password,
        userContacts: contacts
    };

    await saveNewUser(user);
    successfulSignup(); 
}

/**
 * Displays the login modal.
 */
function successfulSignup() {
    let signupModal = document.getElementById("signupModal");
    if (signupModal.style.display !== "block") {
        signupModal.style.display = "block";

        setTimeout(function() {
            if (signupModal.style.display === "block") {
                signupModal.style.display = "none";
                window.location.href = '../login.html';
            }
        }, 2000);
    }
}

/**
 * Validates form fields and displays an alert if any field is empty.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @param {string} name - User's name.
 * @returns {boolean} - Returns true if all fields are filled, otherwise false.
 */
function validateFormFields(email, password, name) {
    if (email === "" || password === "" || name === "") {
        alert("Please fill in all fields");
        return false;
    }
    return true;
}

/**
 * Saves a new user to the storage.
 * @param {Object} user - The user object to be saved.
 * @async
 * @returns {Promise<void>}
 */
async function saveNewUser(user) {
    let users = await loadUsers();
    users.push(user);
    await setItem('users', JSON.stringify(users));
}

