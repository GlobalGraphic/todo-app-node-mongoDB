// create feature field
let createField = document.getElementById('create-field');

// item template function
const itemTemplate = item => {
    return `
        <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <span class="item-text">${item.text}</span>
        <div>
            <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
            <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
        </div>
        </li>
    `;
};

// initial page load render
let ourHTML = items.map(item => {
    return itemTemplate(item);
}).join('');
document.getElementById('item-list').insertAdjacentHTML("beforeend", ourHTML);

// listening for submiting the form
document.getElementById('create-form').addEventListener('submit', e => {
    e.preventDefault();
    axios.post('/create-item', {text: createField.value}).then(response => {
        // create the html for a new item
        document.getElementById('item-list').insertAdjacentHTML('beforeend', itemTemplate(response.data));

        // clear input field after submiting and add focus to input field
        createField.value = "";
        createField.focus();
    }).catch(err => {
        // handling error
        alert(err);
    });
});

document.addEventListener("click", (ev) => {
    // delete functionality
    if(ev.target.classList.contains("delete-me")){
        if(confirm("Do you really want to delete this item permanetly?")){
            axios.post('/delete-item', {id: ev.target.getAttribute("data-id")}).then(() => {
                // delete targeted element
                ev.target.parentElement.parentElement.remove();
            }).catch(err => {
                // handling error
                alert(err);
            });
        }
    }

    // edit functionality
    if(ev.target.classList.contains("edit-me")){
        // get user input from prompt and save it to the var
        let userInput = prompt("Enter your desired new text:", ev.target.parentElement.parentElement.querySelector('.item-text').innerHTML);
        if(userInput){
            axios.post('/update-item', {text: userInput, id: ev.target.getAttribute("data-id")}).then(() => {
                // traverse two steps up of the dom and select the span that contains text and change it for new one
                ev.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput;
            }).catch(err => {
                // handling error
                alert(err);
            });
        }else {
            ev.target.parentElement.parentElement.querySelector('.item-text').innerHTML;
        }
    }
});