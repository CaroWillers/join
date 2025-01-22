let avatarColors = ["rgb(255,122,0)", "rgb(255,70,70)", "rgb(147,39,255)", "rgb(110,82,255)", "rgb(252,113,255)", "rgb(255,187,43)", "rgb(31,215,193)", "rgb(70,47,138)"]

let localContacts = [];
let allUsers = [];
let currentUser = localStorage.getItem('currentUserName');
let userEmail = "";

/**
 * Loads contacts by rendering templates, fetching remote contacts,
 * checking if the user is added, and initializing the display.
 *
 * @returns {Promise<void>} A promise that resolves when all contacts are loaded and displayed.
 */
async function loadContacts() {
    await Templates('contacts');
    await initContacts();
}

/**
 * Fetches remote contacts for the logged-in user from storage.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of contact objects, or an empty array if no contacts are found.
 */
async function loadRemoteContactsOfLoggedInUser() {
    try {
        let result = await getItem('users');
        if (result) {
            allUsers = JSON.parse(result);
            let thisUser = allUsers.find(entry => entry.name === currentUser);
            localContacts = thisUser.userContacts;
            userEmail = thisUser.email;
            return localContacts;
        } else {
            return [];
        }
    } catch (e) {
        console.error('Loading error:', e);
        return [];
    }
}

/**
 * Checks if the current user is already added as a contact in the local contacts list.
 *
 * @returns {Promise<boolean>} A promise that resolves with true if the user is a contact, or false otherwise.
 */
async function checkIfUserIsAddedAsContact() {
    for (let i = 0; i < localContacts.length; i++) {
        if (localContacts[i].email === userEmail) {
            return true;
        }
    }
    createUserAsContact();
}

/**
 * Creates a new contact object for the current user if they are not already added.
 *
 * @returns {Promise<void>} A promise that resolves when the user is added as a contact.
 */
async function createUserAsContact() {
    let name = '';
    let email = '';
    let phone = '';
    if (currentUser === 'Guest') {
        name = 'Guest';
        email = 'guest@guestmail.com';
        phone = '+49';
    } else if (currentUser != 'Guest') {
        name = currentUser;
        email = userEmail;
        phone = "+49";
    }
    let dataSet = newContactDataSetForArray(name, email, phone);
    localContacts.push(dataSet.newContact);
    await updateUserContactsInRemoteAfterRegistration();
}

/**
 * Updates the remote storage with the current list of user contacts.
 *
 * @returns {Promise<void>} A promise that resolves when the remote storage is updated.
 */
async function updateUserContactsInRemoteAfterRegistration() {
    await setItem('users', allUsers);
}

/**
 * Updates the remote storage with the current list of user contacts.
 *
 * @returns {Promise<void>} A promise that resolves when the remote storage is updated.
 */
async function updateUserContactsInRemote() {
    await setItem('users', allUsers);
    await initContacts();
}

/**
 * Initializes the contact display by performing the following steps:
 * 1. Sorts contacts by first name.
 * 2. Creates categories for contacts based on their first letter.
 * 3. Renders the contact list with categories and individual contacts.
 *
 * @returns {Promise<void>} A promise that resolves when the contact list is initialized.
 */
async function initContacts() {
    await sortByFirstName();
    let categorizedContacts = await createCategories();
    await renderContactList(categorizedContacts);
}

/**
 * Sorts the `localContacts` array in ascending order by the first name of each contact.
 *
 * @returns {Promise<void>} A promise that resolves when sorting is complete.
 */
async function sortByFirstName() {
    localContacts.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Creates categories for contacts based on the first letter of their names.
 *
 * @returns {Promise<Object>} A promise that resolves with an object where keys are category initials (uppercase letters)
 * and values are arrays of contacts belonging to that category.
 */
async function createCategories() {
    let categories = {};
    localContacts.forEach(contact => {
        let initial = contact.name.charAt(0).toUpperCase();
        if (!categories[initial]) {
            categories[initial] = [];
        }
        categories[initial].push(contact);
    });
    return categories;
}

/**
 * Renders the HTML structure for the contact list with categories and individual contacts.
 *
 * @param {Object} categories An object containing contact categories (initials as keys, contact arrays as values).
 * @returns {Promise<void>} A promise that resolves when the contact list is rendered.
 */
async function renderContactList(categories) {
    let contactListHTML = '';
    let index = 0;
    contactListHTML = renderContactCategoryAndEachContact(categories, contactListHTML, index);
    document.getElementById("contactList").innerHTML = `
            <div class="contactBoxForEachLetter">
                ${contactListHTML}
            </div>
        `;
}

/**
 * Recursively renders the HTML for contact categories and individual contacts within those categories.
 *
 * @param {Object} categories An object containing contact categories (initials as keys, contact arrays as values).
 * @param {string} contactListHTML The accumulated HTML string for the contact list.
 * @param {number} index A counter to keep track of unique IDs for each contact.
 * @returns {string} The updated `contactListHTML` string with rendered categories and contacts.
 */
function renderContactCategoryAndEachContact(categories, contactListHTML, index) {
    for (let initial in categories) {
        contactListHTML += renderContactCategory(initial);
        categories[initial].forEach(contact => {
            contactListHTML += renderEachContact(contact, index);
            index++;
        });
    }
    return contactListHTML;
}

/**
 * Renders the HTML structure for a single contact category (e.g., "A").
 *
 * @param {string} initial The first letter (uppercase) representing the category.
 * @returns {string} The HTML string for the contact category.
 */
function renderContactCategory(initial) {
    return `
            <div class="sectionByFirstLetter">
                ${initial}
            </div>
            <div class="contactsSeparator">
            </div>
        `;
}

/**
 * Renders the HTML structure for a single contact with its details.
 *
 * @param {Object} contact A contact object containing properties like name, surname, email, avatarColor, and initials.
 * @param {number} index A unique identifier for the contact.
 * @returns {string} The HTML string for the individual contact.
 */
function renderEachContact(contact, index) {
    return `
    <div class="contact" id="contact(${index})" onclick="changeContactButtonColorAsClicked(${index})"> <!-- Index übergeben -->
        <div class="contactAvatar" style="background-color: ${contact.avatarColor};">
            ${contact.initials}
        </div>
        <div class="contactNameAndEmail">
            <div class="contactName">
                ${contact.name} ${contact.surname}
            </div>
            <div class="contactEmail" id="contactEmail(${index})">
                ${contact.email}
            </div>
        </div>
    </div>
`;
}

/**
 * Shows the "Add Contact" card by:
 * 1. Unhiding the container element.
 * 2. An animating the card entrance with a slight delay.
 * 3. Rendering the initial layout for adding a contact.
 * 4. Preventing event bubbling on the card itself.
 */
function showAddContactCard() {
    document.getElementById('addEditContact').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('addEditContactCard').classList.add('showAddEditContactContainer');
    }, 25);
    renderAddContactLayout();
    document.getElementById('addEditContactCard').onclick = function (event) {
        event.stopPropagation();
    };
}

/**
 * Renders the initial layout for adding a contact within the card.
 * - Sets the headline to "Add contact".
 * - Shows the subheadline element.
 * - Sets the avatar icon background color and adds an "Add Contact" image.
 * - Clears the input fields for name, email, and phone.
 * - Updates the buttons section with the HTML template for cancel and create buttons.
 */
function renderAddContactLayout() {
    document.getElementById('addAndEditContactHeadline').innerHTML = 'Add contact';
    document.getElementById('addContactSubheadline').style.display = 'flex';
    document.getElementById('avatarIcon').style.backgroundColor = 'rgba(209, 209, 209, 1)';
    document.getElementById('avatarIcon').innerHTML = '<img src="./img/addContactAvatar.svg">';
    document.getElementById('editContactName').value = '';
    document.getElementById('editContactEmail').value = '';
    document.getElementById('editContactPhone').value = '';
    document.getElementById('addEditContactButtons').innerHTML = addContactButtonsCancelAndCreateButtonsHTMLTemplate();
}

/**
 * Generates the HTML template for the cancel and create buttons used in the "Add Contact" card.
 *
 * @returns {string} The HTML string containing the button elements.
 */
function addContactButtonsCancelAndCreateButtonsHTMLTemplate() {
    return /*html*/`
            <button type="button" class="cancelCreateContactButton" id="cancelCreateContactButton" onclick="hideAddContactCard()">
                <p>Cancel</p>
                <span class="taskIcon">X</span>
            </button>
            <button type="submit" class="createContactButton" id="createContactButton">
                <p>Create contact</p>
                <img src="./img/createTaskCheckIcon.svg">
            </button>
            `;
}

/**
 * Hides the "Add Contact" card by:
 * 1. Animating the card exit with a slight delay.
 * 2. Hiding the container element after the animation.
 */
function hideAddContactCard() {
    document.getElementById('addEditContactCard').classList.remove('showAddEditContactContainer');
    setTimeout(() => {
        document.getElementById('addEditContact').style.display = 'none';
    }, 125);
}

/**
 * This function creates a new contact, checks for duplicate emails, and performs
 * subsequent actions such as updating storage, initializing the contact list,
 * and opening the created contact's info.
 *
 * @returns {Promise<boolean>} A promise that resolves to `true` if a duplicate email
 * is found, preventing further processing.
 */
async function createContact() {
    let dataSet = newContactDataSetForArray();
    if (checkForDuplicateEmail(dataSet.contactData.email, dataSet.contactData.phone)) {
        return true;
    }
    localContacts.push(dataSet.newContact);
    await updateUserContactsInRemote();
    await initContacts();
    let contactIndex = getIndexByNameSurname(localContacts, dataSet.formattedName.firstName, dataSet.formattedName.lastName);
    changeContactButtonColorAsClicked(contactIndex)
    showContactCreatedPopUp();
    clearAddContactForm();
    hideAddContactCard();
    scrollToAnchor(`contact(${toggleIndex})`);
    // clickedButtons = [`contact(${toggleIndex})`];
}

/**
 * This function creates a new contact data set object by:
 * 1. Extracting contact data (name, email, phone) from input fields or provided defaults.
 * 2. Formatting the contact name by capitalizing the first letter of each word.
 * 3. Creating a new contact data set with formatted name, initials, email, phone, category, and avatar color.
 *
 * @param {string} name (optional) The name to use. If omitted, retrieves from the editContactName field.
 * @param {string} email (optional) The email address to use. If omitted, retrieves from the editContactEmail field.
 * @param {string} phone (optional) The phone number to use. If omitted, retrieves from the editContactPhone field.
 * @returns {Object} An object containing the contact data set with formatted name, initials, email, phone, category, and avatar color.
 */
function newContactDataSetForArray(name, email, phone) {
    let contactData = getContactData(name, email, phone);
    let formattedName = formatContactName(contactData);
    let newContact = createNewContactDataSet(contactData, formattedName);
    return {
        contactData,
        formattedName,
        newContact,
    };
}

/**
 * This function extracts contact data (name, email, phone) from input fields or provided defaults.
 * 
 * @param {string} name (optional) The name to use. If omitted, retrieves from the editContactName field.
 * @param {string} email (optional) The email address to use. If omitted, retrieves from the editContactEmail field.
 * @param {string} phone (optional) The phone number to use. If omitted, retrieves from the editContactPhone field.
 * @returns {Object} An object containing the extracted name, email, and phone data.
 */
function getContactData(name = "", email = "", phone = "") {
    if (name === "") {
        name = document.getElementById("editContactName").value;
    }
    if (email === "") {
        email = document.getElementById("editContactEmail").value;
    }
    if (phone === "") {
        phone = document.getElementById("editContactPhone").value;
    }
    return {
        name,
        email,
        phone,
    };
}

/**
 * This function formats a contact name by capitalizing the first letter of each word.
 *
 * @param {Object} contactData An object containing the name property to be formatted.
 * @returns {Object} An object containing the formatted firstName and lastName properties.
 */
function formatContactName(contactData) {
    let [firstName, lastName] = contactData.name.split(" ");
    if (!firstName) {
        firstName = "";
    }
    if (!lastName) {
        lastName = "";
    }
    firstName = capitalizeFirstLetter(firstName);
    lastName = capitalizeFirstLetter(lastName);
    return {
        firstName,
        lastName,
    };
}

/**
 * This function capitalizes the first letter of a string.
 *
 * @param {string} name The string to be capitalized.
 * @returns {string} The string with the first letter capitalized.
 */
function capitalizeFirstLetter(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * This function creates a new contact data set object containing formatted name, initials,
 * email, phone, category, and avatar color.
 *
 * @param {Object} contactData An object containing name, email, and phone properties.
 * @param {Object} formattedName An object containing firstName and lastName properties.
 * @param {Object} existingContact (optional) An existing contact object to inherit avatar color from.
 * @returns {Object} The newly created contact data set object.
 */
function createNewContactDataSet(contactData, formattedName, existingContact = null) {
    let avatarColor;
    if (existingContact) {
        avatarColor = existingContact.avatarColor;
    } else {
        avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    }
    const initials = formattedName.firstName.charAt(0).toUpperCase() + formattedName.lastName.charAt(0).toUpperCase();
    const category = formattedName.firstName.charAt(0).toUpperCase();
    return {
        name: formattedName.firstName,
        surname: formattedName.lastName,
        initials,
        email: contactData.email,
        phone: contactData.phone,
        category,
        avatarColor,
    };
}