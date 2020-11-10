// edit functionality
document.addEventListener("click", (ev) => {
    if(ev.target.classList.contains("edit-me")){
        // get user input from prompt and save it to the var
        let userInput = prompt("Enter your desired new text:", ev.target.parentElement.parentElement.querySelector('.item-text').innerHTML);
        if(userInput){
            axios.post('/update-item', {text: userInput, id: ev.target.getAttribute("data-id")}).then(() => {
                // traverse two steps up of the dom and select the span that contains text and change it for new one
                ev.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput;
            }).catch(err => {
                alert(err);
            });
        }else {
            ev.target.parentElement.parentElement.querySelector('.item-text').innerHTML;
        }
    }
});

document.getElementById('items_form').addEventListener('submit', (e) => {
    e.preventDefault();
    if(document.getElementById('item_text_add').value === ""){
        alert('You must enter something !');
    }else {
        document.getElementById('items_form').submit();
    }
});