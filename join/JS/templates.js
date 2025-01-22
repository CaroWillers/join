let users = [
    {
        "name": "Guest",
        "email": "guest@guestmail.com",
        "userContacts": [
            {
                "name": "Anton",
                "surname": "Mayer",
                "initials": "AM",
                "avatarColor": "rgb(255,122,0)",
                "email": "anton@gmail.com",
                "phone": "+49 1111 111 11 1",
                "category": "A"
            },
            {
                "name": "Albert",
                "surname": "Gerdes",
                "initials": "AG",
                "avatarColor": "rgb(255,70,70)",
                "email": "albert@gmail.com",
                "phone": "+49 2222 222 22 2",
                "category": "A"
            },
            {
                "name": "Aaron",
                "surname": "Brier",
                "initials": "AB",
                "avatarColor": "rgb(147,39,255)",
                "email": "aaron@gmail.com",
                "phone": "+49 3333 333 33 3",
                "category": "A"
            },
            {
                "name": "Britta",
                "surname": "Zielke",
                "initials": "BZ",
                "avatarColor": "rgb(110,82,255)",
                "email": "b.zielke@gmail.com",
                "phone": "+49 4444 444 44 4",
                "category": "B"
            },
            {
                "name": "Carsten",
                "surname": "Schmidt",
                "initials": "CS",
                "avatarColor": "rgb(252,113,255)",
                "email": "carsten.schmidt@gmail.com",
                "phone": "+49 5555 555 55 5",
                "category": "C"
            },
            {
                "name": "Bernt",
                "surname": "Saathoff",
                "initials": "BS",
                "avatarColor": "rgb(255,187,43)",
                "email": "bernt.s@gmail.com",
                "phone": "+49 6666 666 66 6",
                "category": "B"
            },
            {
                "name": "Caroline",
                "surname": "Tabeling",
                "initials": "CT",
                "avatarColor": "rgb(31,215,193)",
                "email": "caroline@gmail.com",
                "phone": "+49 7777 777 77 7",
                "category": "C"
            },
            {
                "name": "Diana",
                "surname": "König",
                "initials": "DK",
                "avatarColor": "rgb(255,70,70)",
                "email": "diana.koenig@gmail.com",
                "phone": "+49 8888 888 88 8",
                "category": "D"
            },
            {
                "name": "Erik",
                "surname": "Wagner",
                "initials": "EW",
                "avatarColor": "rgb(255,0,191)",
                "email": "erik.wagner@gmail.com",
                "phone": "+49 9999 999 99 9",
                "category": "E"
            },
            {
                "name": "Fiona",
                "surname": "Müller",
                "initials": "FM",
                "avatarColor": "rgb(255,122,0)",
                "email": "fiona.mueller@gmail.com",
                "phone": "+49 1010 101 01 0",
                "category": "F"
            }
        ]
    }
];

/**
 * Generates the HTML structure for a single card on the board.
 * @param {object} card The card object containing details to populate the template.
 * @returns {string} The HTML string representing a card on the board.
 */
function cardTemplate(card) {

    return `
    <div draggable="true" onclick="bigCard(${card.id})" ondragstart="startDragging(${card.id})" class="board-card-small" >
        <div style="background-color:${card.category.color};" class="category-card">${card.category.name}</div>
        <div class="card-text">
            <h3 class="card-title">${card.title}</h3>
            <p class="card-description">${card.description}</p>
            <!-- dont show more than 2 lines? JS? -->
        </div>
        ${TemplateSubtaskProgressbar(card)}
        <div class="icons-area">
            <div class="initial-card-container" id="assigned-container${card.id}">
                <div class="user-initals-card">TD</div>
                <div class="user-initals-card overlap">G</div>
                <div class="user-initals-card overlap">AB</div>
            </div>
            <img src="${card.priority.img}" alt="">
        </div>
    </div>
    `;
}

/**
 * check if ther are subtask to put on the card for the todo card.
 * 
 * @param {*} card the arry of the card for the needet task
 * @returns the Subtask section on the bord task card.
 */
function TemplateSubtaskProgressbar(card) {
    if (card.subtasks.length > 0) {
        let completeSubtask = card.subtasks.reduce((acc, subtask) => acc + subtask.done, 0);

        return `
        <div class="progressbar-area">
            <div class="progressbar">
                <div class="progress-color" style="width:${progressbarCompetedRate(card)}%;"></div>
            </div>
            <p>${completeSubtask}/${card.subtasks.length} Subtasks</p>
        </div>
        `;
    } else {
        return '';
    }
}

/**
 * Generates the HTML structure for the big card modal content based on a card object.
 * @param {object} card The card object containing details to populate the template.
 * @returns {string} The HTML string representing the big card modal content.
 */
function TaskCadBigTemplate(card, id) {
    return `
        <div class="board-card-big-top">
        <div class="flex-row">
            <div style="background-color:${card.category.color};" class="category-card-big">${card.category.name} </div>
            <div class="dropdowen-task">
                <img class="dropdowen-arrow" onclick="dropdowenTask()" src="./img/arrow_drop_down.svg" alt="openDropdown">
                <div onfocusout="closeDropdowenTask()" tabindex="0" class="dropdown-container-task d-none" id="task-dropdown" onclick="doNotClose(event)">
                    <div class="move-to">    
                        <p>Move Task to:</p>
                    </div> 
                    <div class="move-link">
                        <a onclick="dropMobile('todo', ${card.id})">todo</a>
                        <a onclick="dropMobile('progress', ${card.id})">In progress</a>
                        <a onclick="dropMobile('feedback', ${card.id})">Await feedback</a>
                        <a onclick="dropMobile('done', ${card.id})">done</a>
                    </div>
                </div>
            </div>
            </div>
            <div class="board-card-close-container" onclick="closeCard()">
                <img class="board-card-close" src="./img/Close.svg" alt="close">
                <img class="board-card-close-hover" src="./img/close hover.svg" alt="close hover">
            </div>
        </div>
        <h1>${card.title} </h1>
        <p class="board-card-big-description">${card.description} </p>
        <div class="board-card-big-info">
            <h2>Due date:</h2>
            <p id="due-date"> </p>
        </div>
        <div class="board-card-big-info">
            <h2>Priority: </h2>
            <div class="board-card-big-priority">
                <p> ${card.priority.urgency} </p>
                <img src="${card.priority.img} " alt="Priority">
            </div>
        </div>
        <div class="task-assigend-container" id="assigned-container">
        </div>
        <div class="board-card-big-subtasks-arear" id="board-card-big-subtasks-arear">
            <h2>Subtasks</h2> 
            <div class="board-task-subtasks-container" id="board-task-subtasks-container"></div> 
        </div>
        <div class="board-card-big-bottom" >
            <div class="board-card-icons" onclick="deleteTask(${id})">
                <img class="board-card-big-bottom-icon" src="./img/delete.svg" alt="Delete">
                <img class="board-card-big-bottom-icon-hover" src="./img/delete hover.svg" alt="delete hover">
                Delete
            </div>
            <div class="board-card-big-bottom-seperation"></div>
            <div class="board-card-icons" onclick="editTask(${id})">
                <img class="board-card-big-bottom-icon" src="./img/edit.svg" alt="Edit">
                <img class="board-card-big-bottom-icon-hover" src="./img/edit hover.svg" alt="edit hover">
                Edit
            </div>
        </div>
`;
}

/**
 * Generates the HTML template for a single assigned user within the big card view.
 *
 * @param {object} user - A user object containing a `name` property (string) and a `color` property (string).
 * @param {string} initials - The user's initials (uppercase) generated from their name.
 * @returns {string} The HTML template string representing a single assigned user.
 */
function bigCardAssignedTemplate(user, initials) {
    return `
    <div class="board-card-big-assingend-user">
        <div style="background-color:${user.avatarColor};" class="user-initals-card-big-card">${initials}</div>
        <p>${user.name}</p>
    </div>
    `;
}

/**
 * Generates the HTML template for a single subtask within the big card modal.
 *
 * @param {string} taskText - The text content of the subtask.
 * @param {string} img - The path to the image representing the subtask state.
 * @param {boolean} done - Indicates whether the subtask is marked as completed.
 * @param {number} i - The index of the subtask within the card's subtasks array.
 * @param {number} id - The ID of the card containing the subtask.
 * @returns {string} The HTML string representing the subtask template.
 */
function bigCardSubtaskTemplate(taskText, img, done, i, id) {
    return `
        <div class="board-task-subtask">
                <p><img id="subtask${i}" onclick="SubtaskStatus(${done},${i},${id})" src="${img}">${taskText}</p>
        </div>
    `;
}

/**
 * Generates the HTML template for the "Add Task" popup window.
 *
 * @returns {string} The HTML string representing the popup window structure.
 */
function boardPopupAddTaskWindow() {
    return `
    <div class="borad-card-popup-addTask" id="borad-card-popup-addTask" onclick="doNotClose(event)">
       <div class="board-addTask-popup-top">
            <div class="add-task-titel-popup">
                <h1>Add Task</h1>
            </div>
            <div class="board-popup-close-area">
                <div class="board-card-close-container" onclick="closeCard()">
                    <img class="board-card-close" src="./img/Close.svg" alt="close">
                    <img class="board-card-close-hover" src="./img/close hover.svg" alt="close hover">
                </div>
            </div>            
        </div>
        <div class="addTask-popup-container" id="addTask-popup-container">
        </div>
    </div> 
    `;
}

/**
 * Generates the HTML structure for a large board card popup.
 *
 * @returns {string} The HTML string representing the board card popup structure.
 */
function EditTemplate() {
    return `
    <div class="board-card-big-top-popup">
        <div class="board-card-close-container" onclick="closeCard()">
            <img class="board-card-close" src="./img/Close.svg" alt="close">
            <img class="board-card-close-hover" src="./img/close hover.svg" alt="close hover">
        </div>
    </div>
    <div class="fullHeight small-width" include-AddTask="./Templates/add_task-popup.html"> </div>
    `
}

/**
 * Updates the content of the "createTaskContainerPopup" element with an "Ok" button 
 * for completing task editing.
 *
 * @param {string} id - The ID of the task being edited (likely used for internal logic).
 */
function templateOkBtn(id) {
    const editTaskBntContainer = document.getElementById('createTaskContainerPopup');
    editTaskBntContainer.innerHTML = `
    <button id="finish-btn" class="createTaskButton" onclick="editTaskDone(${id})">
        <p>Ok</p>
        <img src="./img/createTaskCheckIcon.svg">
    </button>
    `;
}

/**
 * Generates the HTML structure for a mobile greeting element.
 *
 * Inserts the greeting content into the element with ID "content".
 */
function TemplateGreetMobile() {
    document.getElementById('content').innerHTML = `
    <div class="greeting-container">
        <p id="greeting-mobile-user"></p><br>
        <h1 class="greeting-mobile" id="greeting-mobile"></h1>
    </div>
    `;
}

/**
 * This function populates the contact info panel with the details of the clicked contact.
 * It retrieves the contact data from the `contacts` array using the provided index.
 * Then, it updates the HTML content of specific DOM elements with the contact's name, initials, avatar color, email, and phone number.
 * Finally, it updates the "Edit Contact" and "Delete Contact" buttons with the clicked contact's index for proper functionality.
 * @param {number} index - The index of the clicked contact in the `contacts` array.
 */
function openContactInfoHTMLTemplate(index) {
    let contact = localContacts[index];
    document.getElementById('contactInfoContactDetails').innerHTML = /*html*/`
                    <div class="contactInfoAvatarAndName">
                        <div class="contactInfoAvatar" style="background-color: ${contact.avatarColor};">
                            ${contact['initials']}
                        </div>
                        <div>
                            <div class="contactInfoName">
                                ${contact['name']} ${contact['surname']}
                            </div>
                            <div class="editContactMenuDesktop">
                                <div class="editContact" onclick="showEditContact(${index})">
                                    <img src="./img/editContactIcon.svg">
                                    <span>Edit</span>
                                </div>
                                <div class="deleteContact" onclick="deleteContact(${index})">
                                    <img src="./img/deleteContactIcon.svg">
                                    <span>Delete</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="contactInfoHeadlineDesktop">
                Contact Information
            </div>
                    <div class="contactInfoEmailAndPhone">
                        <div class="contactInfoEmail">
                            <p>Email</p>
                            <a href="mailto:abc@example.com">${contact['email']}</a>
                        </div>
                        <div class="contactInfoPhone">
                            <p>Phone</p>
                            <span>${contact['phone']}</span>
                        </div>
                    </div>
            `;

    document.getElementById('editContactButtonContainer').innerHTML = /*html*/`
             <button class="addContactButton" id="addContactButton" onclick="showContactEditDeleteMenu(${index})">
                <img src="./img/contactMenuButton.svg">
            </button>
                                                                `;
}

function openGuestContactInfoHTMLTemplate(index){
    let contact = localContacts[index];
    document.getElementById('contactInfoContactDetails').innerHTML = /*html*/`
                    <div class="contactInfoAvatarAndName">
                        <div class="contactInfoAvatar" style="background-color: ${contact.avatarColor};">
                            ${contact['initials']}
                        </div>
                        <div>
                            <div class="contactInfoName">
                                ${contact['name']} ${contact['surname']}
                            </div>
                            <div class="editContactMenuDesktop">
                                <div class="editGuestContact">
                                    <img src="./img/editContactIcon.svg">
                                    <span>Edit</span>
                                </div>
                                <div class="deleteGuestContact">
                                    <img src="./img/deleteContactIcon.svg">
                                    <span>Delete</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="contactInfoHeadlineDesktop">
                Contact Information
            </div>
                    <div class="contactInfoEmailAndPhone">
                        <div class="contactInfoEmail">
                            <p>Email</p>
                            <a href="mailto:abc@example.com">${contact['email']}</a>
                        </div>
                        <div class="contactInfoPhone">
                            <p>Phone</p>
                            <span>${contact['phone']}</span>
                        </div>
                    </div>
            `;

    document.getElementById('editContactButtonContainer').innerHTML = /*html*/`
             <button class="addContactButton" id="addContactButton" onclick="showContactEditDeleteMenu(${index})">
                <img src="./img/contactMenuButton.svg">
            </button>
                                                                `;
}


/**
* This function shows the edit and delete menu for the clicked contact on mobile screens (less than 800px wide).
* It populates the menu container with the "Edit" and "Delete" buttons and adds an event listener to prevent event bubbling.
* @param {number} index - The index of the clicked contact in the `contacts` array.
*/
function showContactEditDeleteMenu(index) {
    document.getElementById('editContactMenuContainer').classList.add('showEditContactMenu');
    document.getElementById('editContactMenuContainer').innerHTML = /*html*/`
                                                                                <div class="editContactMenu" id="editContactMenu">
                                                                                    <div class="editContact" onclick="showEditContact(${index})">
                                                                                        <img src="./img/editContactIcon.svg">
                                                                                        <span>Edit</span>
                                                                                    </div>
                                                                                    <div class="deleteContact" onclick="deleteContact(${index})">
                                                                                        <img src="./img/deleteContactIcon.svg">
                                                                                        <span>Delete</span>
                                                                                    </div>
                                                                                </div>

    `;
    document.getElementById('editContactMenu').onclick = function (event) {
        event.stopPropagation();
    };
}

/**
 * This function populates the edit contact card with the details of the clicked contact.
 * It sets the avatar background color and initials, fills the name, email, and phone input fields with the contact's data, and sets focus on the name field after a short delay.
 * @param {number} index - The index of the clicked contact in the `contacts` array.
 */
function editContactDeleteAndSaveButtonLayoutHTMLTemplate(index) {
    document.getElementById('addEditContactButtons').innerHTML = /*html*/`
                                                                            <button type="button" class="deleteEditContactButton" onclick="deleteContact(${index})">
                                                                                <p>Delete</p>
                                                                            </button>
                                                                            <button type="submit"class="saveEditContactButton" onclick="updateContact(${index})">
                                                                                <p>Save</p>
                                                                                <img src="./img/createTaskCheckIcon.svg">
                                                                            </button>
                                                                        `;
}

function renderAllContactsHTMLTemplate(i, backgroundColor, contact, textColor, checkBoxSrc) {
    return `<div class="dropdownEachContact" id="dropdownEachContact(${i})" style="background-color: ${backgroundColor}" onclick="assingContact(${i})">
                <div class="assignToContactAvatarAndName">
                    <div class="assignToContactAvatar" style="background-color: ${contact['avatarColor']};">
                    ${contact['initials']}
                    </div>
                    <div class="assignToContactName" id="assignToContactName(${i})" style="color: ${textColor}">
                    ${contact.name} ${contact.surname}
                    </div>
                </div>
                <div class="assignToCheckBox">
                    <img id="assignContactCheckBox(${i})" src="${checkBoxSrc}">
                </div>
            </div>
        `;
}

function renderFilteredContactsHTMLTemplate(i, backgroundColor, contact, textColor, checkBoxSrc) {
    return `
    <div class="dropdownEachContact" id="dropdownEachContact(${i})" style="background-color: ${backgroundColor}" onclick="assingContact(${i})">
        <div class="assignToContactAvatarAndName">
            <div class="assignToContactAvatar" style="background-color: ${contact['avatarColor']};">
            ${contact['initials']}
            </div>
            <div class="assignToContactName" id="assignToContactName(${i})" style="color: ${textColor}">
            ${contact.name} ${contact.surname}
            </div>
        </div>
        <div class="assignToCheckBox">
            <img id="assignContactCheckBox(${i})" src="${checkBoxSrc}">
        </div>
    </div>
    `;
}

function showSubtaskInputMenu() {
    document.getElementById('addTaskSubtasksIcons').innerHTML = `
    <img src="./img/cancelCreateSubtask.svg" onclick="clearSubtaskInputField()">
    <div class="addTaskSubtasksIconsSeperator"></div>
    <img src="./img/saveCreateSubtask.svg" id="saveSubtaskInput" onclick="saveSubtaskInput()">
    `;
}

function showDefaultInputMenu() {
    document.getElementById('addTaskSubtasksIcons').innerHTML = `
        <div class="addTaskSubtasksIcons" id="addTaskSubtasksIcons">
            <img src="./img/addSubtaskPlusIcon.svg">
        </div>
        `;
}

function openCreatedSubtaskBoxHTMLTemplate(i, subtask) {
    return `
    <div class="eachSubtask" id="eachSubtask(${i})">
       <li class="subtaskListInput" ondblclick="editCreatedSubtask(${i})">${subtask.text}</li>
       <div class="createdSubtasksIcons" id="createdSubtasksIcons">
            <img src="./img/edit.svg" onclick="editCreatedSubtask(${i})">
            <div class="addTaskSubtasksIconsSeperator"></div>
            <img src="./img/deleteContactIcon.svg" onclick="deleteCreatedSubtask(${i})">
        </div>
    </div>
`;
}

function editCreatedSubtaskHTMLTemplate(i, currentSubtaskText) {
    return `
    <div class="editEachSubtask" id="editEachSubtask(${i})" onclick="">
        <input class="editTaskSubtasksInput" id="editTaskSubtasksInput" type="text" autocomplete="off" value="${currentSubtaskText.text}" onkeypress="if (event.keyCode === 13) saveEditSubtaskInput(${i})">
        <div class="editCreatedSubtasksIcons" id="editCreatedSubtasksIcons">
        <img src="./img/deleteContactIcon.svg" onclick="deleteCreatedSubtask(${i}); event.stopPropagation();">
            <div class="addTaskSubtasksIconsSeperator"></div>
            <img src="./img/saveCreateSubtask.svg" onclick="saveEditSubtaskInput(${i}); event.stopPropagation();">
        </div>
    </div>
    `;
}

function saveEditSubtaskInputHTMLTemplate(i, editedSubtask) {
    return `
        <li class="subtaskListInput" ondblclick="editCreatedSubtask(${i})">${editedSubtask}</li>
        <div class="createdSubtasksIcons" id="createdSubtasksIcons">
          <img src="./img/edit.svg" onclick="editCreatedSubtask(${i})">
          <div class="addTaskSubtasksIconsSeperator"></div>
          <img src="./img/deleteContactIcon.svg" onclick="deleteCreatedSubtask(${i})">
        </div>
        `;
}

function restoreDefault() {
    setItem("cards", backupCards)
}

const backupCards = [
    {
        "id": 0,
        "place": "todo",
        "category": {
            "name": "Technical Task",
            "color": "rgb(0,56,255)"
        },
        "title": "Implement Drag and Drop",
        "description": "Allow users to drag and drop cards between columns (Todo, In Progress, Done) to update their status.",
        "dueDate": "2024-05-10",
        "subtasks": [
            {
                "text": "Design interaction for dragging cards",
                "done": false
            },
            {
                "text": "Implement logic for updating card positions",
                "done": false
            },
            {
                "text": "Handle visual feedback during drag and drop",
                "done": false
            }
        ],
        "assigned": [
            {
                "name": "Anton",
                "surname": "Mayer",
                "initials": "AM",
                "avatarColor": "rgb(255,122,0)"
            }
        ],
        "priority": {
            "urgency": "Low",
            "img": "./img/priorityLowInactive.svg"
        }
    },
    {
        "id": 1,
        "place": "todo",
        "category": {
            "name": "User Story",
            "color": "rgb(255,122,0)"
        },
        "title": "Design Card Component",
        "description": "Create a reusable card component that displays task information (title, description, due date, etc.)",
        "dueDate": "2024-05-12",
        "subtasks": [
            {
                "text": "Define card layout and styles",
                "done": false
            },
            {
                "text": "Implement visual elements for card properties (title, assignee)",
                "done": false
            },
            {
                "text": "Ensure responsiveness for different screen sizes",
                "done": false
            }
        ],
        "assigned": [
            {
                "name": "Caroline",
                "surname": "Tabeling",
                "initials": "CT",
                "avatarColor": "rgb(31,215,193)"
            },
            {
                "name": "Anton",
                "surname": "Mayer",
                "initials": "AM",
                "avatarColor": "rgb(255,122,0)"
            }
        ],
        "priority": {
            "urgency": "Urgent",
            "img": "./img/priorityHighInactive.svg"
        }
    },
    {
        "id": 2,
        "place": "progress",
        "category": {
            "name": "Technical Task",
            "color": "rgb(0,56, 255)"
        },
        "title": "Display Card Metadata",
        "description": "Fetch and display additional card information like assigned users and due dates.",
        "dueDate": "2024-05-26",
        "subtasks": [
            {
                "text": "Define API endpoint for card data",
                "done": true
            },
            {
                "text": "Implement logic to retrieve card data",
                "done": true
            },
            {
                "text": "Update card UI to display retrieved data",
                "done": false
            }
        ],
        "assigned": [
            {
                "name": "Bernt",
                "surname": "Saathoff",
                "initials": "BS",
                "avatarColor": "rgb(255,187,43)"
            }
        ],
        "priority": {
            "urgency": "Medium",
            "img": "./img/priorityMediumInactive.svg"
        }
    },
    {
        "id": 3,
        "place": "feedback",
        "category": {
            "name": "Technical Task",
            "color": "rgb(0,56,255)"
        },
        "title": "Refine User Authentication",
        "description": "Review and improve the implemented user authentication system. Consider adding features like password hashing, secure session management, and role-based access control (RBAC) if necessary.",
        "dueDate": "2024-08-07",
        "subtasks": [
            {
                "text": "Evaluate the security strength of current implementation",
                "done": true
            },
            {
                "text": "Implement additional security measures (password hashing, session management)",
                "done": true
            },
            {
                "text": "Consider adding RBAC for differentiated user permissions (optional)",
                "done": true
            }
        ],
        "assigned": [
            {
                "name": "Diana",
                "surname": "König",
                "initials": "DK",
                "avatarColor": "rgb(255,70,70)"
            },
            {
                "name": "Erik",
                "surname": "Wagner",
                "initials": "EW",
                "avatarColor": "rgb(255,0,191)"
            }
        ],
        "priority": {
            "urgency": "Medium",
            "img": "./img/priorityMediumInactive.svg"
        }
    },
    {
        "id": 4,
        "place": "progress",
        "category": {
            "name": "Technical Task",
            "color": "rgb(0,56,255)"
        },
        "title": "Implement Data Persistence",
        "description": "Store card data (title, description, due date, assigned users, etc.) in a persistent storage mechanism like a database or local storage. Ensure data integrity and retrieval.",
        "dueDate": "2024-05-10",
        "subtasks": [
            {
                "text": "Choose a suitable data storage solution",
                "done": false
            },
            {
                "text": "Design data schema to represent card information",
                "done": true
            },
            {
                "text": "Implement logic to save and load card data from storage",
                "done": false
            }
        ],
        "assigned": [
            {
                "name": "Erik",
                "surname": "Wagner",
                "initials": "EW",
                "avatarColor": "rgb(255,0,191)"
            }
        ],
        "priority": {
            "urgency": "Urgent",
            "img": "./img/priorityHighInactive.svg"
        }
    },
    {
        "id": 5,
        "place": "feedback",
        "category": {
            "name": "User Story",
            "color": "rgb(255,122,0)"
        },
        "title": "Implement User Interface",
        "description": "Design the overall user interface for the Kanban board, including card layouts, columns, drag-and-drop interactions, and visual feedback elements.",
        "dueDate": "2024-05-07",
        "subtasks": [
            {
                "text": "Create mockups for different Kanban board views",
                "done": true
            },
            {
                "text": "Design user interactions like adding, editing, and deleting cards",
                "done": true
            },
            {
                "text": "Ensure a clean and user-friendly visual style",
                "done": true
            }
        ],
        "assigned": [
            {
                "name": "Fiona",
                "surname": "Müller",
                "initials": "FM",
                "avatarColor": "rgb(255,122,0)"
            }
        ],
        "priority": {
            "urgency": "Urgent",
            "img": "./img/priorityHighInactive.svg"
        }
    }
]

let contacts = [
    {
        "name": "Anton",
        "surname": "Mayer",
        "initials": "AM",
        "avatarColor": "rgb(255,122,0)",
        "email": "anton@gmail.com",
        "phone": "+49 1111 111 11 1",
        "category": "A"
    },
    {
        "name": "Albert",
        "surname": "Gerdes",
        "initials": "AG",
        "avatarColor": "rgb(255,70,70)",
        "email": "albert@gmail.com",
        "phone": "+49 2222 222 22 2",
        "category": "A"
    },
    {
        "name": "Aaron",
        "surname": "Brier",
        "initials": "AB",
        "avatarColor": "rgb(147,39,255)",
        "email": "aaron@gmail.com",
        "phone": "+49 3333 333 33 3",
        "category": "A"
    },
    {
        "name": "Britta",
        "surname": "Zielke",
        "initials": "BZ",
        "avatarColor": "rgb(110,82,255)",
        "email": "b.zielke@gmail.com",
        "phone": "+49 4444 444 44 4",
        "category": "B"
    },
    {
        "name": "Carsten",
        "surname": "Schmidt",
        "initials": "CS",
        "avatarColor": "rgb(252,113,255)",
        "email": "carsten.schmidt@gmail.com",
        "phone": "+49 5555 555 55 5",
        "category": "C"
    },
    {
        "name": "Bernt",
        "surname": "Saathoff",
        "initials": "BS",
        "avatarColor": "rgb(255,187,43)",
        "email": "bernt.s@gmail.com",
        "phone": "+49 6666 666 66 6",
        "category": "B"
    },
    {
        "name": "Caroline",
        "surname": "Tabeling",
        "initials": "CT",
        "avatarColor": "rgb(31,215,193)",
        "email": "caroline@gmail.com",
        "phone": "+49 7777 777 77 7",
        "category": "C"
    },
    {
        "name": "Diana",
        "surname": "König",
        "initials": "DK",
        "avatarColor": "rgb(255,70,70)",
        "email": "diana.koenig@gmail.com",
        "phone": "+49 8888 888 88 8",
        "category": "D"
    },
    {
        "name": "Erik",
        "surname": "Wagner",
        "initials": "EW",
        "avatarColor": "rgb(255,0,191)",
        "email": "erik.wagner@gmail.com",
        "phone": "+49 9999 999 99 9",
        "category": "E"
    },
    {
        "name": "Fiona",
        "surname": "Müller",
        "initials": "FM",
        "avatarColor": "rgb(255,122,0)",
        "email": "fiona.mueller@gmail.com",
        "phone": "+49 1010 101 01 0",
        "category": "F"
    }
]

