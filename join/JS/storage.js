const STORAGE_TOKEN = '7FEF1R3K05KBKGHN2WYW4CSV3UPKAA6MPGKAEMAK';
const STORAGE_URL =  "https://remote-storage.developerakademie.org/item";


async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) { 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
} 