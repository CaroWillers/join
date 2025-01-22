/**
 * Array to implement the Task cards !!
 */
let cards = []

/**
 * Loads tasks from local storage.
 * 
 * @returns {Promise<Array<object>>} A promise that resolves to an array of tasks or an empty array if no tasks are found.
 */
async function loadTasks() {
    try {
        let result = await getItem('cards');
        if (result) {
            cards = JSON.parse(result);
            return cards;
        } else {
            console.log("No cards found in storage, returning empty array.");
            return [];
        }
    } catch (e) {
        console.error('Loading error:', e);
        return [];
    }
}

/**
 * Saves the current tasks array to local storage.
 * 
 * @returns {Promise<void>} A promise that resolves after saving the tasks.
 */
async function UpdateTaskInRemote() {
    await setItem('cards', cards);
    console.log("cards saved to storage", cards);
}

/**
 * Asynchronously loads all necessary functions for the board in the correct order.
 */
async function loadBoard() {
    await Templates('board');
    updateCards();
    changeNavigation()
}

/**
 * Updates navigation visuals to show the board section.
 *
 * This function removes the "clicked" class from summary and add task elements, 
 * and adds it to the board element, visually marking it as selected.
 * Additionally, it adjusts element visibility based on screen size (potentially for mobile).
 */
function changeNavigation() {
    let summary = document.getElementById('navSummary');
    let addTask = document.getElementById('navAddTask');
    let board = document.getElementById('navBoard');
    summary.classList.remove('navigation-item-clicked');
    board.classList.add('navigation-item-clicked');
    addTask.classList.remove('navigation-item-clicked');

    if (window.innerWidth < 800) {
        summary.children[1].classList.add('d-none');
        summary.children[0].classList.remove('d-none');

        board.children[0].classList.add('d-none');
        board.children[1].classList.remove('d-none');

        addTask.children[1].classList.add('d-none');
        addTask.children[0].classList.remove('d-none');
    }
}

/**
 * Updates all card sections on the board by calling individual update functions for each section ("todo", "progress", etc.).
 */
function updateCards() {
    todoCardUpdate();
    progressCardUpdate();
    feedbackCardUpdate();
    doneCardUpdate();
}

/**
 * Updates the cards in the specified section of the board ("todo", "progress", etc.).
 * @param {string} todo The name of the board section to update.
 */
function todoCardUpdate() {
    let todo = cards.filter(t => t['place'] == 'todo');
    let todoContainer = document.getElementById('todo');
    todoContainer.innerHTML = '';

    if (todo.length > 0) {
        todoContainer.style.padding = '16px';

        for (let index = 0; index < todo.length; index++) {
            const card = todo[index];
            document.getElementById('todo').innerHTML += cardTemplate(card);
            assignedInitals(card);
        }
    } else {
        todoContainer.style.padding = '0px';
        todoContainer.innerHTML = '<div class="no-task-div">No tasks To do</div>';
    }
}

/**
 * Updates the cards in the specified section of the board ("todo", "progress", etc.).
 * @param {string} progress The name of the board section to update.
 */
function progressCardUpdate() {
    let progress = cards.filter(t => t['place'] == 'progress');
    let progressContainer = document.getElementById('progress');
    progressContainer.innerHTML = '';

    if (progress.length > 0) {
        progressContainer.style.padding = '16px';

        for (let index = 0; index < progress.length; index++) {
            const card = progress[index];
            document.getElementById('progress').innerHTML += cardTemplate(card);
            assignedInitals(card)
        }
    } else {
        progressContainer.style.padding = '0px';
        progressContainer.innerHTML = '<div class="no-task-div">No tasks in progress</div>';
    }
}

/**
 * Updates the cards in the specified section of the board ("todo", "progress", etc.).
 * @param {string} feedback The name of the board section to update.
 */
function feedbackCardUpdate() {
    let feedback = cards.filter(t => t['place'] == 'feedback');
    let feedbackContainer = document.getElementById('feedback');
    feedbackContainer.innerHTML = '';

    if (feedback.length > 0) {
        feedbackContainer.style.padding = '16px';

        for (let index = 0; index < feedback.length; index++) {
            const card = feedback[index];
            document.getElementById('feedback').innerHTML += cardTemplate(card);
            assignedInitals(card)
        }
    } else {
        feedbackContainer.style.padding = '0px';
        feedbackContainer.innerHTML = '<div class="no-task-div">No tasks feedback</div>';
    }
}

/**
 * Updates the cards in the specified section of the board ("todo", "progress", etc.).
 * @param {string} done The name of the board section to update.
 */
function doneCardUpdate() {
    let done = cards.filter(t => t['place'] == 'done');
    let doneContainer = document.getElementById('done');
    doneContainer.innerHTML = '';

    if (done.length > 0) {
        doneContainer.style.padding = '16px';

        for (let index = 0; index < done.length; index++) {
            done
            const card = done[index];
            document.getElementById('done').innerHTML += cardTemplate(card);
            assignedInitals(card)
        }
    } else {
        doneContainer.style.padding = '0px';
        doneContainer.innerHTML = '<div class="no-task-div">No tasks done</div>';
    }
}

/**
 * Initializes the assigned user initials display for a given card.
 *
 * @param {object} card - A card object containing an `assigned` array with user information.
 *        - The card object is expected to have an `assigned` property which is an array of objects.
 *        - Each object in the `assigned` array should have a `name` property (string) and a `color` property (string).
 */
function assignedInitals(card) {
    let container = document.getElementById(`assigned-container${card.id}`)
    container.innerHTML = '';
    if (card.assigned.length != 0) {
        for (let i = 0; i < card.assigned.length; i++) {
            const user = card.assigned[i];
            let names = user.name.split(' ');
            let initials = user.initials;

            if (i === 0) {
                container.innerHTML += `<div style="background-color:${user.avatarColor};" class="user-initals-card">${initials} </div>`;
            } else {
                container.innerHTML += `<div style="background-color:${user.avatarColor};" class="user-initals-card overlap">${initials} </div>`;
            }
        }
    }
}

/**
 * Calculates the completion percentage for a card's progress bar based on the number of completed subtasks.
 * @param {object} card The card object containing the subtasks list.
 * @returns {number} The percentage of completed subtasks (0-100).
 */
function progressbarCompetedRate(card) {
    let allSubtasks = card.subtasks.length;
    let completeSubtask = card.subtasks.reduce((acc, subtask) => acc + subtask.done, 0);

    let precentProgress = Math.floor((completeSubtask / allSubtasks) * 100);
    return precentProgress;
}

/**
 * A global variable to store the ID of the currently dragged card element.
 * @type {number}
 */
let currentDraggedElement;

/**
 * Sets the `currentDraggedElement` variable to the ID of the card being dragged.
 * @param {number} id The ID of the dragged card element.
 */
function startDragging(id) {
    currentDraggedElement = id;
}

/**
 * Allows dropping an element onto a designated target.
 * @param {DragEvent} ev The drag event object.
 */
function allowDrop(ev) {
    ev.preventDefault();
    currentDraggedElement;
}

/**
 * Updates the card's "place" property in the cards array based on the drop target.
 * @param {string} place The name of the drop target area (e.g., "todo", "progress").
 */
function drop(place) {
    let card = cards.find(card => card.id === currentDraggedElement);
    card['place'] = '';
    card['place'] = place;
    updateCards();
    UpdateTaskInRemote();
}

/**
 * Updates the card's "place" property in the cards array based on the drop target.
 * @param {string} place The name of the drop target area (e.g., "todo", "progress").
 */
function dropMobile(place, id) {
    let card = cards.find(card => card.id === id);
    card['place'] = '';
    card['place'] = place;
    closeDropdowenTask();
    updateCards();
    UpdateTaskInRemote();
}

/**
 * Opens the task dropdown menu.
 * 
 * @returns {void} (nothing returned)
 */
function dropdowenTask() {
    let container = document.getElementById('task-dropdown');
    container.classList.remove('d-none');
    container.focus()
}

/**
 * Closes the task dropdown menu.
 * 
 * @returns {void} (nothing returned)
 */
function closeDropdowenTask() {
    document.getElementById('task-dropdown').classList.add('d-none');
}

/**
 * Opens a big card modal for a specific card based on its ID.
 * @param {number} id The ID of the card to display.
 */
function bigCard(id) {
    // Find the card object by ID in the cards array
    const card = cards.find(card => card.id === id);

    if (card) {
        // Card found, proceed with big card logic
        let container = document.getElementById('borad-card-popup');

        document.getElementById('borad-card-overlay').classList.remove('d-none');
        document.getElementById('borad-card-popup').classList.remove('d-none');
        document.body.classList.add('body-noscroll-class');

        container.innerHTML = TaskCadBigTemplate(card, id);
        bigCardAssigned(card);
        bigCardSubtasksCheck(card);
        dueDateConvert(card);
    } else {
        console.error("Card with ID", id, "not found in the cards array");
    }
}

/**
 * Initializes the assigned user list display for the big card view based on the provided card data.
 * If the card has no assigned users, hides the container.
 *
 * @param {object} card - A card object containing an `assigned` array with user information.
 *        - The card object is expected to have an `assigned` property which is an array of objects.
 *        - Each object in the `assigned` array should have a `name` property (string) and a `color` property (string).
 */
function bigCardAssigned(card) {
    if (card.assigned.length > 0) {
        let container = document.getElementById(`assigned-container`)
        container.innerHTML = '<h2>Assigned To:</h2>';
        for (let i = 0; i < card.assigned.length; i++) {
            const user = card.assigned[i];
            let names = user.name.split(' ');
            let initials = user.initials
            container.innerHTML += bigCardAssignedTemplate(user, initials);
        }
    } else {
        document.getElementById(`assigned-container`).classList.add('d-none')
    }
}

function dueDateConvert(card) {
    let dueDateContainer = document.getElementById('due-date');

    // Check if dueDate exists and is a string (optional safety check)
    if (!card.dueDate || typeof card.dueDate !== 'string') {
        dueDateContainer.innerText = "No due date";
        return; // Exit the function if no due date or not a string
    }
    // Split the date string into year, month, and day components
    const [year, month, day] = card.dueDate.split('-');

    // Create the formatted date string in DD.MM.YYYY format
    const formattedDueDate = `${day.padStart(2, '0')}.${month.padStart(2, '0')}.${year}`;
    dueDateContainer.innerText = formattedDueDate;
}

/**
 * Checks for subtasks and conditionally hides the subtasks area of the big card modal.
 * @param {object} card The card object containing the subtasks array.
 */
function bigCardSubtasksCheck(card) {
    if (card.subtasks.length > 0) {
        bigCardSubtasks(card);
    } else {
        document.getElementById('board-card-big-subtasks-arear').classList.add('d-none');
    }
}

/**
 * Populates the subtasks section of the big card modal with individual subtask details.
 * @param {object} card The card object containing the subtasks array.
 */
function bigCardSubtasks(card) {
    let container = document.getElementById('board-task-subtasks-container');
    let id = card.id
    for (let i = 0; i < card.subtasks.length; i++) {
        const subtask = card.subtasks[i];

        let taskText = subtask.text;
        let done = subtask.done;
        let img;

        if (done === true) {
            img = './img/Check button.svg';
        } else {
            img = './img/Check button unchecked.svg';
        }
        container.innerHTML += bigCardSubtaskTemplate(taskText, img, done, i, id);
    }
}

/**
 * Updates the visual state (image) and internal completion status of a subtask.
 * Triggers UI updates and opens the big card modal for the associated card.
 *
 * @param {boolean} done - Indicates whether the subtask is marked as completed.
 * @param {number} i - The index of the subtask within the card's subtasks array.
 * @param {number} id - The ID of the card containing the subtask.
 */
function SubtaskStatus(done, i, id) {
    if (done === true) {
        subtaskNotCompleted(i, id);
    } else {
        subtaskCompleted(i, id);
    }
    updateCards();
    bigCard(id);
}

/**
 * Updates the image of a subtask to show incompletion and marks it as incomplete internally.
 *
 * @param {number} index - The index of the subtask within the card's subtasks array.
 * @param {number} cardId - The ID of the card containing the subtask.
 */
function subtaskNotCompleted(i, id) {
    document.getElementById(`subtask${i}`).src = "./img/Check button unchecked.svg";
    const card = cards.find(card => card.id === id)
    for (let index = 0; index < card.subtasks.length; index++) {
        const task = card.subtasks[index];
        if (index === i) {
            task.done = false;
        }
    }
}

/**
 * Updates the image of a subtask to show completion and marks it as completed internally.
 *
 * @param {number} index - The index of the subtask within the card's subtasks array.
 * @param {number} cardId - The ID of the card containing the subtask.
 */
function subtaskCompleted(i, id) {
    document.getElementById(`subtask${i}`).src = "./img/Check button.svg";
    const card = cards.find(card => card.id === id)
    for (let index = 0; index < card.subtasks.length; index++) {
        const task = card.subtasks[index];
        if (index === i) {
            task.done = true;
        }
    }
}