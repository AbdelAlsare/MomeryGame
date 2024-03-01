// La recuperation des elements 
const form = document.querySelector("#form");
const username = document.querySelector('#nom');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const password2 = document.querySelector('#password2');

// Evenements
form.addEventListener('submit',e=>{
    e.preventDefault();
    form_verify();
})

// Fonstions
function form_verify() {
    //  les valeurs des inputs
    var userValue = username.value.trim();
    var emailValue = email.value.trim();
    var pwdValue = password.value.trim();
    var pwd2Value = password2.value.trim();
    
    // Username verify
    if (userValue === "") {
        let message ="le nom ne peut pas être vide";
        setError(username,message);
    }else if(!userValue.match(/[a-zA-Z]/)){
        let message ="le nom doit commencer par une lettre";
        setError(username,message)
    }else{
        let letterNum = userValue.length;
        if (letterNum < 3) {
            let message ="le nom doit avoir au moins 3 caractères";
            setError(username,message)
        } else {
            setSuccess(username);
        }
    }
  
    // email verify
    if (emailValue === "") {
        let message = "le Email ne peut pas être vide";
        setError(email,message);
    }else if(!email_verify(emailValue)){
        let message = "le Email n'est pas valide";
        setError(email,message);
    }else{
        setSuccess(email)
    }
    
    // password verify
    if (pwdValue ==="") {
        let message ="Le mot de passe ne peut pas être vide";
        setError(password,message)
    }else if(!password_verify(pwdValue)){
        let message = "Le mot de passe est trop faible (8 à 12 caractères)";
        setError(password,message)
    }else{
        setSuccess(password);
    }
    
    // pwd confirm

    if (pwd2Value ==="") {
        let message ="Le mot de passe confirm ne peut pas être vide";
        setError(password2,message)
    }else if( pwdValue !== pwd2Value){
        let message ="Les mot de passes ne correspondent pas";
        setError(password2,message)
    }else{
        setSuccess(password2)
    }

    console.log(userValue,emailValue,pwdValue,pwd2Value);
}




function setError(elem,message) {
    const formControl = elem.parentElement;
    const small = formControl.querySelector('small');

    //  message d'erreur
    small.innerText = message

    // classe error
    formControl.className = "form-control error";
}

function setSuccess(elem) {
    const formControl = elem.parentElement;
    formControl.className ='form-control success'
}

function email_verify(email) {
    
    return /^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/.test(email);
}
function password_verify(passeword) {
///^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,12}$/
    return /([0-9])/.test(passeword);
}
