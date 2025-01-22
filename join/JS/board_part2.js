/**
 * Searches cards based on user input, hiding unmatched & showing matches.
 * Calls NoMatchFound for empty search or no results.
 */
function search() {
    let query = document.getElementById('search').value.toLowerCase();
    let hasMatch = false; // Flag to track if any match is found 
    const containers = [document.getElementById('todo'), document.getElementById('progress'), document.getElementById('feedback'), document.getElementById('done')];

    for (const container of containers) {
        for (const card of container.querySelectorAll('.board-card-small')) {
            const titleText = card.querySelector('.card-title').textContent.toLowerCase();
            const descriptionText = card.querySelector('.card-description')?.textContent.toLowerCase() || ""; // Optional description handling

            const combinedText = `${titleText} ${descriptionText}`;

            if (combinedText.includes(query)) {
                card.classList.remove('d-none'); // Show matching card
                hasMatch = true;
            } else {
                card.classList.add('d-none'); // Hide non-matching card
            }
        }
    }
    NoMatchFound(hasMatch, query);
}

/**
 * Prevents the close event from bubbling up when clicking inside the big card modal.
 * @param {Event} event The event object.
 */
function doNotClose(event) {
    event.stopPropagation();
}

/**
 * Opens the modal for adding a new task to the board.
 * Fetches the add task template using the 'include-AddTask' attribute and injects it into the modal content.
 */
async function boardPopupAddTask() {
    let container = document.getElementById('borad-card-overlay');

    container.innerHTML = boardPopupAddTaskWindow();


    document.getElementById('borad-card-overlay').classList.remove('d-none');
    document.body.classList.add('body-noscroll-class');
    container.style.justifyContent = "flex-end"
    container.style.alignItems = "flex-start"

    document.getElementById('addTask-popup-container').innerHTML = '<div class="fullHeight" include-AddTask="./Templates/add_task-popup.html"> </div>';
    await includeAddTask();
    changePriorityColor('mediumPriorityButton');
}

/**
 * Fetches and includes the content of external HTML templates marked with the 'include-AddTask' attribute.
 *
 * @async
 */
async function includeAddTask() {
    let includeElements = document.querySelectorAll('[include-AddTask]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("include-AddTask"); // "includes/template.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

/**
 * Handles no search results: shows message if no match, clears if query is empty or has matches.
 * @param {boolean} hasMatch - Flag indicating if any matches were found.
 * @param {string} query - The search query string.
 */
function NoMatchFound(hasMatch, query) {
    // Handle no matches scenario 
    if (!hasMatch) {
        let container = document.getElementById('no-search-results')
        container.innerText = 'No matching task found.';
    }
    if (query === '' || hasMatch) {
        document.getElementById('no-search-results').innerText = '';
    }
}

/**
 * Opens edit task popup, loads edit template, handles OK button and sets edit mode for "finish" button.
 * Calls functions to pre-fill edit form data based on provided task ID.
 *
 * @param {string} id - The ID of the task to edit.
 */
async function editTask(id) {
    const container = document.getElementById('borad-card-popup');
    container.innerHTML = EditTemplate();
    await includeAddTask();
    await templateOkBtn(id);
    const editTaskBnt = document.getElementById('finish-btn');
    editTaskBnt.classList.add('editTaskButton');
    TaskTextInEdit(id)
    document.querySelector('#taskCategoryBoxPopup').style.display = 'none';
    document.getElementById('subtasksBox').style.paddingTop = '16px';
}

/**
 * Pre-fills edit form fields with data from the task object based on its ID.
 *
 * @param {string} id - The ID of the task to edit.
 */
function TaskTextInEdit(id) {
    // Find the card object by ID in the cards array
    const card = cards.find(card => card.id === id);

    document.getElementById('addTaskInputTitle').value = card.title;
    document.getElementById('addTaskDescriptionInput').value = card.description;
    document.getElementById('addTaskDueDateInput').value = card.dueDate;
    priorityEdit(card);
    isAssignedEdit(card);
    document.getElementById('selectTaskCategoryTextField').innerHTML = card.category.name;
    subtaskEdit(card);
}

/**
 * Sets the priority button color based on the provided card's urgency level.
 *
 * @param {object} card - The task object containing urgency information.
 */
function priorityEdit(card) {
    if (card.priority.urgency === 'Urgent') {
        changePriorityColor('urgentPriorityButton');
    } if (card.priority.urgency === 'Medium') {
        changePriorityColor('mediumPriorityButton');
    } if (card.priority.urgency === 'Low') {
        changePriorityColor('lowPriorityButton');
    }
}

/**
 * Pre-fills assigned contact information based on the provided card's assigned contacts.
 *
 * @param {object} card - The task object containing assigned contact information.
 */
function isAssignedEdit(card) {
    selectedAssignedContacts = [];
    for (let i = 0; i < card.assigned.length; i++) {
        const contact = card.assigned[i];
        let selectedContact = { name: contact.name, initials: contact.initials, avatarColor: contact.avatarColor }; // Ein Objekt mit Namen, Initialen und Avatarfarbe erstellen
        selectedAssignedContacts.push(selectedContact); // Kontakt zum Array hinzufügen
    }
    showAvatarsOfSelectedContacts();
    
}

function searchIndexAssinged() {
    for (let i = 0; i < selectedAssignedContacts.length; i++) {
        const element = selectedAssignedContacts[i];
        const initials = element.initials;
        
        const indexOfAssigned = localContacts.findIndex(contact => contact.initials === initials);
        checkAssignContact(indexOfAssigned);
    }  
}

function findeIndex(initials, array) {
    return array.indexOf(initials);
  }

/**
 * Handles pre-filling subtask data based on the provided card's subtasks.
 * (Specific details depend on your subtask implementation)
 *
 * @param {object} card - The task object containing subtask information.
 */
function subtaskEdit(card) {
    for (let i = 0; i < card.subtasks.length; i++) {
        const subtask = card.subtasks[i];
        let createdSubtasksJson = { text: subtask.text, done: subtask.done };
        createdSubtasks.push(createdSubtasksJson);
    }
    openCreatedSubtaskBox();
}

/**
 * Edits a task with the given ID.
 * 
 * @param {number} id - The ID of the task to edit.
 * 
 * @returns {void} (nothing returned)
 */
function editTaskDone(id) {
    const card = cards.find(card => card.id === id);
    let place = card.place;
    let category = card.category.name;
    deleteUneditTask(id);

    let title = errorMessageIfEmptyTitle(); // Titel überprüfen und abrufen
    let dueDate = errorMessageIfEmptyDueDate(); // Fälligkeitsdatum überprüfen und abrufen
    let priority = priorities[0]; // Priorität abrufen
    let assigned = selectedAssignedContacts; // Zugeordnete Personen abrufen
    let description = document.getElementById('addTaskDescriptionInput').value.trim(); // Beschreibung abrufen
    let subtasks = createdSubtasks; // Subtasks erstellen

    if (!checkErrors(title, dueDate, category)) {
        return; // Early exit on validation failure
    }
    const priorityImg = priorityImgCheck(priority);
    
    let matchingCategory = taskCategories.find(categoryObj => categoryObj.name === category);
    let categoryColor = matchingCategoryCheck(matchingCategory);// Farben für Kategorie abrufen

    const newCard = createCardObject(id, place, category, categoryColor, title, description, dueDate, subtasks, assigned, priority, priorityImg);

    cards.push(newCard);// Karte zum Array hinzufügen
    UpdateTaskInRemote();

    console.log('Neue Karte erstellt:', newCard); // Zur Überprüfung in der Konsole ausgeben

    emptyArrays();
    bigCard(id);
    updateCards();
}

/**
 * Checks for empty title, due date or invalid category.
 * 
 * @param {string} title - The task title.
 * @param {string} dueDate - The task due date.
 * @param {string} category - The task category.
 * 
 * @returns {boolean} True if all fields are valid, false otherwise.
 */
function checkErrors(title, dueDate, category) {
    if (!title || !dueDate || !taskCategories.some(categoryObj => categoryObj.name === category)) {
        errorMessageIfEmptyTitle(!title);
        errorMessageIfEmptyDueDate(!dueDate);
        errorMessageIfEmptyCategory(!taskCategories.some(categoryObj => categoryObj.name === category));
        return false; // Indicate validation failure
    }
    return true; // Indicate validation success
}

/**
 * Maps priority level to corresponding image path.
 * 
 * @param {string} priority - The task priority (Urgent, Medium, Low).
 * 
 * @returns {string} The image path for the priority level.
 */
function priorityImgCheck(priority) {
    if (priority == 'Urgent') {
        return './img/priorityHighInactive.svg';
    } else if (priority == 'Medium') {
        return './img/priorityMediumInactive.svg';
    } else if (priority == 'Low') {
        return './img/priorityLowInactive.svg';
    }
}

/**
 * Retrieves category color based on matching category object.
 * 
 * @param {object|null} matchingCategory - The matching category object (if found).
 * 
 * @returns {string} The category color (if match found), otherwise logs an error.
 */
function matchingCategoryCheck(matchingCategory) {
    if (matchingCategory) {
        return matchingCategory.categoryColor; // Return the color value
    } else {
        // Fall, wenn keine Übereinstimmung gefunden wurde
        console.error("Keine Übereinstimmung für die Kategorie gefunden");
    }
}

/**
 * Empties the priority, assigned contacts, and created subtasks arrays.
 * 
 * @returns {void} (nothing returned)
 */
function emptyArrays() {
    priorities = [];
    selectedAssignedContacts = [];
    createdSubtasks = [];
}

/**
 * Removes a task from the cards array by its ID.
 * 
 * @param {number} id - The ID of the task to remove.
 * 
 * @returns {void} (nothing returned)
 */
function deleteUneditTask(id) {
    for (let i = cards.length - 1; i >= 0; i--) {
        if (cards[i].id === id) {
            cards.splice(i, 1);
        }
    }
}

/**
 * Creates a new card object with specified properties.
 * 
 * @param {number} id - The task ID.
 * @param {string} place - The task placement.
 * @param {string} category - The task category name.
 * @param {string} categoryColor - The task category color.
 * @param {string} title - The task title.
 * @param {string} description - The task description.
 * @param {string} dueDate - The task due date.
 * @param {array} subtasks - An array of subtasks.
 * @param {array} assigned - An array of assigned contacts.
 * @param {string} priority - The task priority level (Urgent, Medium, Low).
 * @param {string} priorityImg - The image path for the priority level.
 * 
 * @returns {object} The newly created card object.
 */
function createCardObject(id, place, category, categoryColor, title, description, dueDate, subtasks, assigned, priority, priorityImg) {
    return {
        id: id,
        place: place,
        category: {
            name: category,
            color: categoryColor
        },
        title: title,
        description: description,
        dueDate: dueDate,
        subtasks: subtasks,
        assigned: assigned,
        priority: {
            urgency: priority,
            img: priorityImg
        }
    };
  }

/**
 * Closes the Popup modal.
 */
function closeCard() {
    let container = document.getElementById('borad-card-overlay');
    container.classList.add('d-none');
    container.style.justifyContent = "center";
    container.style.alignItems = "center"
    container.innerHTML = `<div class="borad-card-popup d-none" id="borad-card-popup" onclick="doNotClose(event)"></div>`
    document.body.classList.remove('body-noscroll-class');

    priorities = [];
    selectedAssignedContacts = [];
    createdSubtasks = [];
    boardPlace = "";
    updateCards();
}

/**
 * Closes the Popup modal for Add Task Popup.
 */
function closeCardAddTaskPopup() {
    let container = document.getElementById('borad-card-overlay');
    container.classList.add('d-none');
    container.style.justifyContent = "center";
    container.style.alignItems = "center"
    container.innerHTML = `<div class="borad-card-popup d-none" id="borad-card-popup" onclick="doNotClose(event)"></div>`
    document.body.classList.remove('body-noscroll-class');

    priorities = [];
    selectedAssignedContacts = [];
    createdSubtasks = [];
    boardPlace = "";
}

/**
 * Removes a card from the cards array and the board based on its ID.
 * @param {number} cardId The ID of the card to be deleted.
 */
function deleteTask(cardId) {
    for (let i = cards.length - 1; i >= 0; i--) {
        if (cards[i].id === cardId) {
            cards.splice(i, 1);
            updateCards();
            closeCard();
            UpdateTaskInRemote();
            return;
        }
    }
    console.error("Card with ID", cardId, "not found in the cards array");
}

