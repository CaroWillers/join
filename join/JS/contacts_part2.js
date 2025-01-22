/**
 * This function checks if a contact with the provided email already exists in the
 * `localContacts` array.
 *
 * @param {string} email The email address to check for duplication.
 * @returns {boolean} `true` if a duplicate email is found, `false` otherwise.
 */
function checkForDuplicateEmail(email, phone) {
    for (let i = 0; i < localContacts.length; i++) {
        if (localContacts[i].email === email) {
            alert('A contact with the same email address already exists in your list.');
            return true;
        } else if (localContacts[i].phone === phone) {
            alert('A contact with the same phone number already exists in your list.');
            return true;
        }
    }
    return false;
}

/**
 * This function finds the index of a contact in the `localContacts` array by name (first and last).
 *
 * @param {Array} localContacts The array of contact objects.
 * @param {string} firstName The first name of the contact to find.
 * @param {string} lastName The last name of the contact to find.
 * @returns {number} The index of the contact in the array, or -1 if not found.
 */
function getIndexByNameSurname(localContacts, firstName, lastName) {
    for (let i = 0; i < localContacts.length; i++) {
        if (localContacts[i].name === firstName && localContacts[i].surname === lastName) {
            return i;
        }
    }
    return -1;
}

/**
 * This function opens the contact info card and populates it with the contact at the specified index.
 *
 * @param {number} index The index of the contact to open.
 */
function openContactInfo(index) {
    if (window.innerWidth >= 800) {
        highlightCreatedContact(index);
    }
    document.getElementById('contactInfo').classList.add('showContactDetailsContainer');
    if (localContacts[index].name === 'Guest') {
        openGuestContactInfoHTMLTemplate(index);
    } else if (localContacts[index].name != 'Guest') {
        openContactInfoHTMLTemplate(index);
    }
}

/**
 * This function visually highlights the newly created contact in the contact list.
 *
 * @param {number} index The index of the newly created contact.
 */
function highlightCreatedContact(index) {
    document.getElementById(`contact(${index})`).classList.add('contactClicked');
    document.getElementById(`contactEmail(${index})`).style.color = "white";
    toggleIndex = index;
}

/**
 * This function displays a temporary "Contact Created" pop-up notification.
 */
function showContactCreatedPopUp() {
    document.getElementById('contactCreatedButtonContainer').classList.add('showContactCreatedButtonContainer');
    setTimeout(() => {
        document.getElementById('contactCreatedButtonContainer').classList.remove('showContactCreatedButtonContainer');
    }, 800);
}

/**
 * This function clears the input fields in the "Add Contact" form.
 */
function clearAddContactForm() {
    document.getElementById("editContactName").value = "";
    document.getElementById("editContactEmail").value = "";
    document.getElementById("editContactPhone").value = "";
}

/**
 * This function smooth-scrolls the webpage to the element with the specified anchor ID.
 *
 * @param {string} anchorId The ID of the anchor element to scroll to.
 */
function scrollToAnchor(anchorId) {
    const anchorElement = document.getElementById(anchorId);
    if (anchorElement) {
        anchorElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
}

/**
* This variable stores an array of IDs for buttons that have been clicked on the contact list.
* Used to keep track of clicked contacts for styling purposes.
* @type {string[]}
*/
let clickedButtons = [];

/**
 * This variable stores an array of IDs for email elements within clicked contacts.
 * Used to keep track of clicked contact email colors for styling purposes.
 * @type {string[]}
 */
let clickedButtonEmailColors = [];

/**
 * This function handles clicks on contact buttons in the contact list.
 * It checks the screen size and performs different actions based on the width.
 *   - For screens wider than 800px:
 *     - Unclicks any previously clicked contact.
     - Gets the ID of the clicked button and its DOM element.
     - Toggles the clicked button's color and style.
     - Changes the email color of the clicked contact to white.
   - For screens smaller than 800px:
     - Opens the contact info for the clicked contact.
 * @param {number} index - The index of the clicked contact in the `contacts` array.
 */
function changeContactButtonColorAsClicked(index) {
    if (window.innerWidth >= 800) {
        unclickCreatedContact(toggleIndex);
        const buttonId = `contact(${index})`;
        const buttonElement = document.getElementById(buttonId);
        toggleContactButtonColor(buttonId, buttonElement, index);
        changeContactButtonEmailColorToWhite(index);
    } else if (window.innerWidth < 800) {
        openContactInfo(index);
    }
}

/**
 * This function toggles the color and style of a clicked contact button.
 * It checks if the button has already been clicked.
 *   - If clicked:
 *     - Resets the button's color and style to its original state.
     - Closes the contact info.
   - If not clicked:
 *     - Sets the button's color and style to indicate it's clicked.
     - Opens the contact info.
     - Adds the button's ID to the `clickedButtons` array.
     - Resets the color of the previously clicked contact button (if any).
 * @param {string} buttonId - The ID of the clicked button.
 * @param {HTMLElement} buttonElement - The DOM element of the clicked button.
 * @param {number} index - The index of the clicked contact in the `contacts` array.
 */
function toggleContactButtonColor(buttonId, buttonElement, index) {
    if (clickedButtons.includes(buttonId)) {
        resetContactButtonColor(buttonElement, buttonId);
        closeContactInfo();
    } else {
        setButtonColorAsClicked(buttonElement);
        openContactInfo(index);
        clickedButtons.push(buttonId);
        resetLastClickedContactButtonColor();
    }
}

/**
 * This function resets the color and style of a clicked contact button to its original state.
 * It also removes the button's ID from the `clickedButtons` array.
 * @param {HTMLElement} buttonElement - The DOM element of the button to reset.
 * @param {string} buttonId - The ID of the button to reset.
 */
function resetContactButtonColor(buttonElement, buttonId) {
    buttonElement.classList.remove('contactClicked');
    clickedButtons = clickedButtons.filter(id => id !== buttonId);
}

/**
 * This function sets the color and style of a contact button to indicate it's clicked.
 * @param {HTMLElement} buttonElement - The DOM element of the button to style.
 */
function setButtonColorAsClicked(buttonElement) {
    buttonElement.classList.add('contactClicked');
}

/**
 * This function resets the color of the previously clicked contact button (if any).
 * It retrieves the ID of the last clicked button from the `clickedButtons` array and removes it from the DOM styles.
 */
function resetLastClickedContactButtonColor() {
    const lastClickedButtonId = clickedButtons[clickedButtons.length - 2];
    if (lastClickedButtonId) {
        document.getElementById(lastClickedButtonId).classList.remove('contactClicked');
        clickedButtons = clickedButtons.filter(id => id !== lastClickedButtonId);
    }
}

/**
 * This function closes the contact info panel by removing the corresponding class from the DOM element.
 */
function closeContactInfo() {
    document.getElementById('contactInfo').classList.remove('showContactDetailsContainer');
}

/**
 * This function changes the email color of a clicked contact to white (for screens wider than 800px).
 * It retrieves the email element's ID and DOM element based on the clicked contact index.
 * Then, it calls the `toggleContactButtonEmailColor` function to handle the color change logic.
 * @param {number} index - The index of the clicked contact in the `contacts` array.
 */
function changeContactButtonEmailColorToWhite(index) {
    if (window.innerWidth >= 800) {
        const emailId = `contactEmail(${index})`;
        const emailElement = document.getElementById(emailId);
        toggleContactButtonEmailColor(emailId, emailElement, index);
    }
}

/**
 * This function toggles the color of the email element within a clicked contact button.
 * It checks if the email element has already been clicked.
 *   - If clicked:
 *     - Resets the email element's color to its original state.
   - If not clicked:
 *     - Sets the email element's color to white.
     - Adds the email element's ID to the `clickedButtonEmailColors` array.
     - Resets the color of the previously clicked contact's email element (if any).
 * @param {string} emailId - The ID of the email element within the clicked contact button.
 * @param {HTMLElement} emailElement - The DOM element of the email element.
 * @param {number} index - The index of the clicked contact in the `contacts` array.
 */
function toggleContactButtonEmailColor(emailId, emailElement, index) {
    if (clickedButtonEmailColors.includes(emailId)) {
        resetContactButtonEmailColor(emailElement, emailId);
    } else {
        setEmailColorAsClicked(emailElement);
        clickedButtonEmailColors.push(emailId);
        resetLastClickedContactButtonEmailColor();
    }
}

/**
 * This function resets the color of a clicked contact's email element to its original state.
 * It also removes the email element's ID from the `clickedButtonEmailColors` array.
 * @param {HTMLElement} emailElement - The DOM element of the email element to reset.
 * @param {string} emailId - The ID of the email element to reset.
 */
function resetContactButtonEmailColor(emailElement, emailId) {
    emailElement.style.color = "rgba(69, 137, 255, 1)";
    clickedButtonEmailColors = clickedButtonEmailColors.filter(id => id !== emailId);
}

/**
 * This function sets the color of a contact's email element to white.
 * @param {HTMLElement} emailElement - The DOM element of the email element to style.
 */
function setEmailColorAsClicked(emailElement) {
    emailElement.style.color = "white";
}

/**
 * This function resets the color of the previously clicked contact's email element (if any).
 * It retrieves the ID of the last clicked email element from the `clickedButtonEmailColors` array and removes it from the DOM styles.
 */
function resetLastClickedContactButtonEmailColor() {
    const lastClickedEmailId = clickedButtonEmailColors[clickedButtonEmailColors.length - 2];
    if (lastClickedEmailId) {
        document.getElementById(lastClickedEmailId).style.color = "rgba(69, 137, 255, 1)";
        clickedButtonEmailColors = clickedButtonEmailColors.filter(id => id !== lastClickedEmailId);
    }
}

/**
* This variable stores the index of the currently highlighted contact (for screens wider than 800px).
* Used to keep track of which contact is visually selected.
* @type {number}
*/
let toggleIndex = 0;

/**
 * This function removes the visual highlight from the previously highlighted contact (for screens wider than 800px).
 * It uses the `toggleIndex` variable to identify the contact that was previously highlighted.
 * It removes the "contactClicked" class from the button and resets the email color to its original state.
 * @param {number} toggleIndex - The index of the previously highlighted contact (should be the same value stored in the `toggleIndex` variable).
 * @returns {void}
 */
function unclickCreatedContact(toggleIndex) {
    if (toggleIndex < localContacts.length) {
        document.getElementById(`contact(${toggleIndex})`).classList.remove('contactClicked');
        document.getElementById(`contactEmail(${toggleIndex})`).style.color = "rgba(69, 137, 255, 1)";
    } else toggleIndex--;
}

/**
 * This function opens the edit contact card to modify the details of the clicked contact.
 * It shows the card container, sets a timeout to add the "show" class with animation, and calls other functions to handle additional functionalities.
 * @param {number} index - The index of the clicked contact in the `contacts` array.
 */
function showEditContact(index) {
    document.getElementById('addEditContact').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('addEditContactCard').classList.add('showAddEditContactContainer');
    }, 25);
    showEditAndDeleteMenuOnMobile();
    redesignAddContactCardToEditContactCard();
    showCurrentContactDetails(index);
    editContactDeleteAndSaveButtonLayoutHTMLTemplate(index);
    if (window.innerWidth < 800) {
        document.getElementById('editContactMenuContainer').style.display = 'flex';
    }
    document.getElementById('addEditContactCard').onclick = function (event) {
        event.stopPropagation();
    };
}

/**
 * This function hides the edit and delete menu on mobile screens (less than 800px wide) when the edit contact card is opened.
 */
function showEditAndDeleteMenuOnMobile() {
    if (window.innerWidth < 800) {
        document.getElementById('editContactMenuContainer').style.display = 'none';
        hideContactEditDeleteMenu();
    }
}

/**
 * This function visually changes the add contact card to the edit contact card layout.
 * It adds the "show" class for animation, changes the title to "Edit contact", and hides the subtitle.
 */
function redesignAddContactCardToEditContactCard() {
    document.getElementById('addEditContact').classList.add('showAddEditContactContainer');
    document.getElementById('addAndEditContactHeadline').innerHTML = 'Edit contact';
    document.getElementById('addContactSubheadline').style.display = 'none';
}

/**
 * This function populates the edit contact card with the details of the clicked contact.
 * It sets the avatar background color and initials, fills the name, email, and phone input fields with the contact's data, 
 * and sets focus on the name field after a short delay.
 * @param {number} index - The index of the clicked contact in the `contacts` array.
 */
function showCurrentContactDetails(index) {
    document.getElementById('avatarIcon').style.backgroundColor = `${localContacts[index]['avatarColor']}`;
    document.getElementById('avatarIcon').innerHTML = `${localContacts[index]['initials']}`;
    var inputNameField = document.getElementById('editContactName');
    var nameToShow = `${localContacts[index]['name']} ${localContacts[index]['surname']}`;
    inputNameField.value = nameToShow;
    inputNameField.setSelectionRange(nameToShow.length, nameToShow.length);
    document.getElementById('editContactEmail').value = localContacts[index]['email'];
    document.getElementById('editContactPhone').value = localContacts[index]['phone'];
    setTimeout(function () {
        inputNameField.focus();
    }, 125);
}

/**
 * This function attempts to delete a contact at the specified index. Deletion is prevented
 * if the contact's email matches the user's email.
 *
 * @param {number} index The index of the contact to delete in the `localContacts` array.
 * @returns {Promise<void>} A promise that resolves when the deletion process is complete.
 */
async function deleteContact(index) {
    if (localContacts[index].email === userEmail) {
        alert('The user cannot delete themselves from their own contact list.');
    } else {
        changeContactButtonColorAsClicked(index);
        localContacts.splice(index, 1);
        await updateUserContactsInRemote();
        hideAddContactCard();
        await initContacts();
        hideContactEditDeleteMenu();
        closeContactInfo();
        clickedButtons = [];
    }
}

/**
 * This function hides the edit and delete menu container by removing the corresponding class.
 */
function hideContactEditDeleteMenu() {
    document.getElementById('editContactMenuContainer').classList.remove('showEditContactMenu');
}

/**
 * This function updates an existing contact at the specified index. It checks if all required
 * fields (name, email, phone) are filled before updating.
 *
 * @param {number} index The index of the contact to update in the `localContacts` array.
 * @returns {Promise<void>} A promise that resolves when the update process is complete.
 */
async function updateContact(index) {
    let contactData = getContactData();
    if (contactData.name && contactData.email && contactData.phone) {
        let formattedName = formatContactName(contactData);
        let existingContact = localContacts[index];
        localContacts[index] = createNewContactDataSet(contactData, formattedName, existingContact);
        hideAddContactCard();
        await initContacts();
        let contactIndex = getIndexByNameSurname(localContacts, formattedName.firstName, formattedName.lastName);
        openContactInfo(contactIndex);
        clearAddContactForm();
    } else {
        alert("Please fill out every input field.");
    }
    await updateUserContactsInRemote();
}