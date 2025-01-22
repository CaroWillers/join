/**
 * An array containing task category objects. Each object has properties for name and category color.
 * 
 * @typedef {object} TaskCategory
 * @property {string} name - The name of the task category.
 * @property {string} categoryColor - The color of the task category represented in RGB format.
 */
let taskCategories = [{
    name: "Technical Task",
    categoryColor: "rgb(0,56,255)"
},
{
    name: 'User Story',
    categoryColor: "rgb(255,122,0)"
}
];

/**
 * This function toggles the visibility of the "Select Task Category" dropdown menu.
 * If the dropdown is currently hidden, it will be opened and `openTaskCategoryDropdown` is called. Otherwise, it will be closed and `errorMessageIfEmptyCategory` is called to check for an empty selection.
 */
function toggleSelectTaskCategoryDropdown() {
    var content = document.getElementById("dropdownSelectTasksCategory");
    if (content.style.display == "none") {
        openTaskCategoryDropdown();
    } else {
        closeTaskCategoryDropdown();
        errorMessageIfEmptyCategory();
    }
}

/**
 * This function opens the "Select Task Category" dropdown menu.
 * It shows the dropdown container, clears its inner HTML, and loops through each task category.
 * For each category, it constructs the dropdown entry HTML with the category name and sets an onclick event listener to call `selectTaskCategory` when clicked.
 * Finally, it calls `scrollDown` (presumably to ensure visibility).
 */
function openTaskCategoryDropdown() {
    document.getElementById('dropdownSelectTasksCategory').style.display = 'flex';
    document.getElementById('dropdownSelectTasksCategory').innerHTML = '';
    for (let i = 0; i < taskCategories.length; i++) {
        const taskCategory = taskCategories[i];
        document.getElementById('dropdownSelectTasksCategory').innerHTML += /*html*/`
        <div class="dropdownEachTaskCategory" id="dropdownEachTaskCategory(${i})" onclick="selectTaskCategory(${i})">
            ${taskCategory.name}
        </div>
    `;
    }
    scrollDown();
}

/**
 * This function closes the "Select Task Category" dropdown menu.
 * It hides the dropdown container.
 */
function closeTaskCategoryDropdown() {
    document.getElementById('dropdownSelectTasksCategory').style.display = 'none';
}

/**
 * This function handles selecting a task category from the dropdown menu.
 * It retrieves the selected task category object based on the provided index.
 * It updates the text content of the "selectTaskCategoryTextField" element with the selected category name.
 * It then closes the dropdown and calls `errorMessageIfEmptyCategory` to check for an empty selection.
 * 
 * @param {number} i - The index of the selected task category in the `taskCategories` array.
 */
function selectTaskCategory(i) {
    let taskCategory = taskCategories[i];
    document.getElementById('selectTaskCategoryTextField').innerHTML = taskCategory.name;
    closeTaskCategoryDropdown();
    errorMessageIfEmptyCategory();
}

/**
 * This function checks if a task category has been selected and displays an error message if not.
 * It retrieves the text content of the "selectTaskCategoryTextField" element (presumably showing the selected category name).
 * It selects the error message element using a query selector.
 * If the text content is still "Select task category" (indicating no selection), it shows the error message and calls `highlightErrorMessage` for an animation effect.
 * Otherwise, it hides the error message.
 */
function errorMessageIfEmptyCategory() {
    let selectedCategory = document.getElementById('selectTaskCategoryTextField').textContent;
    let errorMessage = document.querySelector('.errorMessageIfEmptyCategory');
    if (selectedCategory === 'Select task category') { // Überprüfe, ob eine gültige Kategorie ausgewählt wurde
        errorMessage.style.visibility = 'visible';
        highlightErrorMessage(errorMessage);
    } else {
        errorMessage.style.visibility = 'hidden';
    }
}

/**
 * This function animates the error message element to highlight it briefly.
 * It sets an animation style for 1 second and then removes the animation style after a short delay.
 * 
 * @param {HTMLElement} errorMessage - The error message element to animate.
 */
function highlightErrorMessage(errorMessage) {
    errorMessage.style.animation = 'highlight 1s';
    setTimeout(() => {
        errorMessage.style.animation = '';
    }, 125);
}

/**
 * An array containing objects representing created subtasks.
 * Each object has properties for "text" (the subtask description) and "done" (a boolean indicating completion status).
 * 
 * @typedef {object} CreatedSubtask
 * @property {string} text - The description of the subtask.
 * @property {boolean} done - Whether the subtask is marked as completed.
 */
let createdSubtasks = [];

/**
 * This function checks the value entered in the "Add Subtask" input field.
 * It retrieves the trimmed value from the input field element.
 * If the input value is empty, it calls `showDefaultInputMenu` (presumably to hide subtask options).
 * Otherwise, it calls `showSubtaskInputMenu` (presumably to show options for subtasks).
 */
function checkInputValue() {
    const inputValue = document.getElementById('addTaskSubtasksInput').value.trim();
    if (inputValue === "") {
        showDefaultInputMenu();
    } else {
        showSubtaskInputMenu();
    }
}

/**
 * This function clears the value from the "Add Subtask" input field.
 * It sets the value of the input field element to an empty string.
 * It also calls `showDefaultInputMenu` (presumably to hide subtask options).
 */
function clearSubtaskInputField() {
    document.getElementById('addTaskSubtasksInput').value = '';
    showDefaultInputMenu();
}

/**
 * This function saves the entered subtask from the "Add Subtask" input field.
 * It retrieves the trimmed value from the input field element.
 * If the input value is not empty, it creates a new subtask object with the text and sets its "done" status to false.
 * It then pushes the new subtask object to the `createdSubtasks` array.
 * Finally, it calls `openCreatedSubtaskBox` to display the created subtasks and `scrollDown` (presumably to ensure visibility).
 */
function saveSubtaskInput() {
    let createdSubtask = document.getElementById('addTaskSubtasksInput').value.trim();
    if (createdSubtask !== "") {
        let createdSubtasksJson = { text: createdSubtask, done: false };
        createdSubtasks.push(createdSubtasksJson)
        openCreatedSubtaskBox();
        scrollDown();
    }
}

/**
 * This function opens the box that displays the created subtasks.
 * It shows the container element for the created subtasks and clears its inner HTML.
 * It then loops through each created subtask in the `createdSubtasks` array.
 * For each subtask, it calls `openCreatedSubtaskBoxHTMLTemplate` (presumably to generate the HTML for the subtask) and adds it to the container's inner HTML.
 * Finally, it calls `clearSubtaskInputField` to clear the input field.
 */
function openCreatedSubtaskBox() {
    document.getElementById('createdSubTasksBox').style.display = 'flex';
    document.getElementById('createdSubTasksBox').innerHTML = '';
    for (let i = 0; i < createdSubtasks.length; i++) {
        const subtask = createdSubtasks[i];
        document.getElementById('createdSubTasksBox').innerHTML += openCreatedSubtaskBoxHTMLTemplate(i, subtask);
    }
    clearSubtaskInputField();
}

/**
 * This function edits a created subtask when its corresponding element is clicked.
 * It adds a class "eachSubtaskFocused" to the clicked subtask element (likely for styling).
 * It retrieves the current subtask text from the `createdSubtasks` array based on the provided index.
 * It updates the inner HTML of the clicked subtask element with the `editCreatedSubtaskHTMLTemplate` (presumably to show an edit input field).
 * It then focuses the edit input field and selects all its content.
 * 
 * @param {number} i - The index of the subtask in the `createdSubtasks` array.
 */
function editCreatedSubtask(i) {
    document.getElementById(`eachSubtask(${i})`).classList.add('eachSubtaskFocused');
    let currentSubtaskText = createdSubtasks[i];
    document.getElementById(`eachSubtask(${i})`).innerHTML = editCreatedSubtaskHTMLTemplate(i, currentSubtaskText);
    let inputField = document.getElementById(`editTaskSubtasksInput`);
    inputField.focus();
    inputField.selectionStart = inputField.selectionEnd = inputField.value.length;
}

/**
 * This function saves the edited subtask when the user confirms changes in the edit input field.
 * It removes the "eachSubtaskFocused" class from the edited subtask element (likely for styling).
 * It retrieves the trimmed value from the edit input field element.
 * If the edited value is not empty, it updates the inner HTML of the edited subtask element with the `saveEditSubtaskInputHTMLTemplate` (presumably to show the updated text).
 * It then updates the corresponding subtask object in the `createdSubtasks` array with the edited text and sets its "done" status to false (assuming it wasn't changed).
 * Otherwise, if the edited value is empty, it calls `deleteCreatedSubtask` to remove the subtask.
 * 
 * @param {number} i - The index of the subtask in the `createdSubtasks` array.
 */
function saveEditSubtaskInput(i) {
    document.getElementById(`eachSubtask(${i})`).classList.remove('eachSubtaskFocused');
    let editedSubtask = document.getElementById('editTaskSubtasksInput').value.trim();
    if (editedSubtask !== "") {
        document.getElementById(`eachSubtask(${i})`).innerHTML = saveEditSubtaskInputHTMLTemplate(i, editedSubtask);
        createdSubtasks[i] = { text: editedSubtask, done: false };
    } else if (editedSubtask == "") {
        deleteCreatedSubtask(i);
    }
}

/**
 * This function removes a created subtask from the list.
 * It removes the subtask at the provided index from the `createdSubtasks` array using the `splice` method.
 * It then calls `openCreatedSubtaskBox` to refresh the displayed list of subtasks.
 * 
 * @param {number} subTastIndex - The index of the subtask to delete in the `createdSubtasks` array.
 */
function deleteCreatedSubtask(subTastIndex) {
    createdSubtasks.splice(subTastIndex, 1);
    openCreatedSubtaskBox();
}

/**
 * This function resets the form fields for creating a new task.
 * It clears the values of the following input elements:
 *   - addTaskInputTitle (presumably for the task title)
 *   - addTaskDescriptionInput (presumably for the task description)
 *   - addTaskDueDateInput (presumably for the task due date)
 * It calls `changePriorityColor` to reset the priority color selection (presumably to a default value like 'mediumPriorityButton').
 * It clears the inner HTML of the element with the ID 'avatarsOfSelectedContacts' (likely to remove any displayed assigned contacts).
 * It resets the `selectedAssignedContacts` array to an empty array.
 * It updates the text content of the element with the ID 'selectTaskCategoryTextField' to "Select task category" (presumably to reset the selected category).
 * It resets the `createdSubtasks` array to an empty array (presumably to remove any created subtasks).
 * Finally, it hides any error messages related to empty title, due date, or category selection using query selectors.
 */
function resetAddTaskForm() {
    document.getElementById('addTaskInputTitle').value = '';
    document.getElementById('addTaskDescriptionInput').value = '';
    document.getElementById('addTaskDueDateInput').value = '';
    changePriorityColor('mediumPriorityButton');
    document.getElementById('assignContactsDropdown').value = '';
    closeAssignToDropdown();
    document.getElementById('avatarsOfSelectedContacts').innerHTML = "";
    selectedAssignedContacts = [];
    document.getElementById('selectTaskCategoryTextField').innerHTML = "Select task category";
    createdSubtasks = [];
    document.getElementById('addTaskSubtasksInput').value = '';
    document.querySelector('.errorMessageIfEmptyTitle').style.visibility = 'hidden';
    document.querySelector('.errorMessageIfEmptyDueDate').style.visibility = 'hidden';
    document.querySelector('.errorMessageIfEmptyCategory').style.visibility = 'hidden';
}

/**
 * This function is the main entry point for creating a new task.
 * It gathers data from the form, validates it, and builds a new task object.
 * If validation fails, it displays error messages and exits.
 * Otherwise, it adds the new task to the board, resets the form, and displays a success popup.
 */
function createTask() {
    let taskData = getTaskData();
    let id = giveId();
    let place = boardPlace === "" ? 'todo' : boardPlace;
    if (!validateTaskData(taskData)) {
        return;
    }
    let priorityImg = getPriorityImagePath(taskData.priority);
    let categoryColor = getCategoryColor(taskData.category);
    let newCard = buildTemplateForArrayInput(id, place, taskData.category, categoryColor, taskData.title, taskData.description, taskData.dueDate, taskData.subtasks, taskData.assigned, taskData.priority, priorityImg);
    addTaskToBoard(newCard);
    resetCreateTaskFormInputs();
    CreatedPopUpOptions();
    
}

/**
 * Generates a unique ID for a new card.
 * 
 * @returns {number} A unique ID for the new card.
 */
function giveId() {
    if (cards.length === 0) {
      return 0; // Return 0 if no cards exist
    }
  
    let highestId = cards.reduce((maxId, currentCard) => Math.max(maxId, currentCard.id), 0);
  
    let missingIds = [];// Find any missing IDs in the sequence (gaps between existing IDs)
    for (let i = 0; i <= highestId; i++) {
      if (!cards.find(card => card.id === i)) {
        missingIds.push(i);
      }
    }
    
    if (missingIds.length > 0) {
      return missingIds[0];
    }
  
    return highestId + 1;// If no missing IDs exist, return the highest ID + 1
  }

/**
 * Selects and displays the appropriate popup based on element availability.
 * 
 * @returns {void} (nothing returned)
 */
function CreatedPopUpOptions() {
    if (document.getElementById('taskCreatedButtonContainer')) {
        showTaskCreatedPopUp();
    } else {
        showTaskCreatedPopUpBoard();
    }
}

/**
 * This function gathers data from the create task form and returns an object containing the task details.
 * It retrieves title, due date, category, assigned contacts, description, and subtasks using relevant functions.
 */
function getTaskData() {
    return {
        title: errorMessageIfEmptyTitle(),
        dueDate: errorMessageIfEmptyDueDate(),
        priority: priorities[0],
        category: document.getElementById('selectTaskCategoryTextField').innerText.trim(),
        assigned: selectedAssignedContacts,
        description: document.getElementById('addTaskDescriptionInput').value.trim(),
        subtasks: createdSubtasks,
    }
}

/**
 * This function validates the provided task data.
 * It checks for missing title, due date, or invalid category.
 * If any are missing, it displays corresponding error messages and returns false.
 * Otherwise, it returns true.
 */
function validateTaskData(taskData) {
    if (!taskData.title || !taskData.dueDate || !taskCategories.some(categoryObj => categoryObj.name === taskData.category)) {
        errorMessageIfEmptyTitle();
        errorMessageIfEmptyDueDate();
        errorMessageIfEmptyCategory();
        return false;
    }
    return true;
}

/**
 * This function takes the priority urgency level (e.g., 'Urgent', 'Medium', 'Low') and returns the corresponding image path for the priority icon.
 */
function getPriorityImagePath(priority) {
    if (priority == 'Urgent') {
        return './img/priorityHighInactive.svg';
    } else if (priority == 'Medium') {
        return './img/priorityMediumInactive.svg';
    } else {
        return './img/priorityLowInactive.svg';
    }
}

/**
 * This function takes the selected category name and finds the corresponding category object from the `taskCategories` array.
 * If a match is found, it returns the category color. Otherwise, it logs an error message.
 */
function getCategoryColor(category) {
    let matchingCategory = taskCategories.find(categoryObj => categoryObj.name === category);
    if (matchingCategory) {
        return matchingCategory.categoryColor;
    } else {
        console.error("Error: Category color not found");
    }
}

/**
 * This function builds a new task object with the provided details.
 * It constructs the object with properties like `id`, `place`, `category` (including name and color), `title`, `description`, `dueDate`, `subtasks`, `assigned contacts`, and `priority` (including urgency and image path).
 */
function buildTemplateForArrayInput(id, place, category, categoryColor, title, description, dueDate, subtasks, assigned, priority, priorityImg) {
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
    }
}

/**
 * This function adds the provided new task object (presumably containing task details) to the `cards` array.
 * The `cards` array likely represents the collection of tasks displayed on the board.
 * Additionally, it calls the `UpdateTaskInRemote` function (assumed to be defined elsewhere) to potentially update the task data remotely.
 * 
 * @param {Object} newCard - The new task object to be added to the board.
 */
function addTaskToBoard(newCard) {
    cards.push(newCard);
    UpdateTaskInRemote();
}

/**
 * This function resets the input fields and state of the create task form.
 * It clears the `boardPlace` variable (presumably holding the selected board location),
 * resets the `priorities` array (likely containing available priorities),
 * clears the `selectedAssignedContacts` array (presumably holding selected contacts),
 * and empties the `createdSubtasks` array (likely containing created subtasks).
 */
function resetCreateTaskFormInputs() {
    boardPlace = "";
    priorities = [];
    selectedAssignedContacts = [];
    createdSubtasks = [];
}

/**
 * This function displays a popup notification for successfully creating a new task.
 * It manipulates the styles of DOM elements with specific IDs to achieve the visual effect.
 * - Sets the display of the container element (`taskCreatedButtonContainer`) to "flex".
 * - Uses `setTimeout` to schedule adding the 'showTaskCreatedButtonContainer' class to the button element (`taskCreatedButton`) with a 20ms delay.
 * - Uses another `setTimeout` to schedule removing the class and hiding the container element after 800ms.
 * - Finally, it calls the `loadBoard` function (assumed to be defined elsewhere) with another 20ms delay, potentially to refresh the board view.
 */
function showTaskCreatedPopUp() {
    document.getElementById('taskCreatedButtonContainer').style.display = "flex";
    setTimeout(() => {
        document.getElementById('taskCreatedButton').classList.add('showTaskCreatedButtonContainer');
    }, 20);
    setTimeout(() => {
        document.getElementById('taskCreatedButton').classList.remove('showTaskCreatedButtonContainer');
        document.getElementById('taskCreatedButtonContainer').style.display = "none";
    }, 800);
    setTimeout(() => {
        loadBoard();
    }, 820);
}

/**
 * Displays a temporary popup board indicating task creation and reloads the board.
 * 
 * @returns {void} (nothing returned)
 */
function showTaskCreatedPopUpBoard() {
    document.getElementById('taskCreatedButtonContainerBoard').style.display = "flex";
    setTimeout(() => {
        document.getElementById('taskCreatedButtonContainerBoard').style.display = "none";
    }, 800);
    setTimeout(() => {
        loadBoard();
        closeCardAddTaskPopup();
    }, 820); 
};