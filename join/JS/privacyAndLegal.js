// leagalnotes / privacy Policy Navigation---------------------------------------------------------------
/**
 * Loads legal notice template and highlights the legal notice section.
 *
 * This function uses `async` to load the legal notice template via `Templates` (not provided).
 * After successful loading (assumed), it:
 *  - Closes the dropdown (implementation in `closeDropdown` not provided).
 *  - Highlights the legal notice section with `legalNoticeHiglite`.
 */
async function dropdownLegalNotice() {
    await Templates('legal_notice');
    await closeDropdown();
    legalNoticeHiglite();
    removeNavHighlightLegalPartOnDropdown();
    removeNavHighlightOnDropdown();
}

/**
 * Highlights the legal notice navigation element.
 *
 * This function adds the "navigation-legal-clicked" class to the element with ID "navLegalNotice", visually marking it as selected.
 */
function legalNoticeHiglite() {
    let legalNotice = document.getElementById('navLegalNotice');
    legalNotice.classList.add('navigation-legal-clicked');
}

/**
 * Loads privacy policy template and highlights the privacy policy section.
 *
 * This function uses `async` to load the privacy policy template via `Templates` (not provided).
 * After successful loading (assumed), it:
 *  - Closes the dropdown (implementation in `closeDropdown` not provided).
 *  - Highlights the privacy policy section with `privacyPolicyHighlight`.
 * Loads the legal notice template and closes the navigation overlay dropdown menu.
 */
async function dropdownPrivacyPolicy() {
    await Templates('privacy_policy');
    await closeDropdown();
    privacyPolicyHighlight();
}

/**
 * Highlights the privacy policy navigation element.
 *
 * This function adds the "navigation-legal-clicked" class to the element with ID "navPrivacyPolicy", visually marking it as selected.
 * Loads the privacy policy template and closes the navigation overlay dropdown menu.
 */
function privacyPolicyHighlight() {
    let privacyPolicy = document.getElementById('navPrivacyPolicy');
    privacyPolicy.classList.add('navigation-legal-clicked');
}

/**
 * Retrieves the value of a specified URL parameter.
 * @param {string} param - The name of the URL parameter to retrieve.
 * @returns {string|null} The value of the URL parameter if found, otherwise null.
 * This function uses the URLSearchParams interface to handle query string parameters.
 * 'window.location.search' gives the query string part of the URL.
 */
function getQueryParam(param) {
    var search = window.location.search;
    var params = new URLSearchParams(search);
    return params.get(param);
}

/**
 * Redirects the user to a specified page while retaining the 'ref' URL parameter.
 * @param {string} page - The relative URL to which the user should be redirected.
 * This function is primarily used to navigate between related pages (like Privacy Policy and Legal Notice)
 * while keeping track of the user's original entry page (e.g., 'login' or 'signup').
 * It appends the 'ref' parameter to the URL to maintain the reference throughout the navigation.
 */
function navigateTo(page) {
    let referrer = getQueryParam('ref'); // 'login' or 'signup'
    window.location.href = page + '?ref=' + referrer;
}

/**
 * Redirects the user back to their original entry page.
 * This function determines whether the user originally came from the 'login' or 'signup' page
 * by checking the 'ref' URL parameter and redirects them back to that page.
 * It provides a convenient way for users to return to their previous context after visiting a linked page,
 * like a Privacy Policy or Legal Notice.
 */
function goBack() {
    let referrer = getQueryParam('ref'); // 'login' or 'signup'
    let page = referrer === 'signup' ? '../signup.html' : '../login.html';
    window.location.href = page;
}