const BaseURL = "https://to-do-list-95ir.onrender.com";
let loginForm, registerForm;
let container, dialogBox, taskInput, AddTaskBtn, RefreshBtn;
window.addEventListener("load", ()=>{
    checkLoggedIn();
})

function initializeMainPage() {
    container = document.querySelector("#container")
    dialogBox = document.querySelector("#dialogBox")
    taskInput = document.querySelector("#taskInput")
    AddTaskBtn = document.querySelector("#AddTaskBtn")
    RefreshBtn = document.querySelector("#RefreshBtn")
    
    if (!container || !dialogBox || !taskInput || !AddTaskBtn || !RefreshBtn) 
        {
            console.log("Hoo");
            return;
        }
    
    RefreshBtn.addEventListener("click", fillContainer)

    AddTaskBtn.addEventListener("click", ()=>{
        addTodo();
        AddTaskBtn.disabled = true
    })

    taskInput.addEventListener("input", ()=>{
        if(taskInput.value === "")
        {
            if(AddTaskBtn.disabled === true)
                return;
            else
                AddTaskBtn.disabled = true
            return;    
        }
        AddTaskBtn.disabled = false
    })

    taskInput.addEventListener("keydown", (e)=>{
        if(e.key === "Enter" && !AddTaskBtn.disabled)
            AddTaskBtn.dispatchEvent(new Event("click"))
    })

    dialogBox.addEventListener("click", (e)=>{
        if(e.target === dialogBox){
            closeDialogBox();
        }
    })

    dialogBox.addEventListener("keydown", (e)=>{
        if(e.key === "Enter")
            closeDialogBox();
    })

    container.addEventListener("click", async (e)=>{
        if(e.target.id ===  'container' || 
            e.target.id === "Edit" || 
            e.target.id === "Delete" ||
            e.target.id === "innerContainer"
        )
            return;

        const div = e.target.closest("div");
        if(!div)
            return;
        checkBox = div.querySelector("#taskCheckBox");
        checkBox.checked = !checkBox.checked;
        checkBoxLabel = div.querySelector("#taskCheckBoxlabel")
        div.disabled = true;
        if(checkBox.checked){
            div.classList.replace("taskNotCompleted","taskCompleted")
            checkBoxLabel.classList.replace("checkBoxUnChecked", "checkBoxChecked")
            div.querySelector("#Edit").disabled = true
        }else{
            div.classList.replace("taskCompleted","taskNotCompleted")
            checkBoxLabel.classList.replace("checkBoxChecked", "checkBoxUnChecked")
            div.querySelector("#Edit").disabled = false
        }
        console.log(div.dataset.id)
        changeTaskStatus(div.dataset.id, checkBox.checked)
    })

    fillContainer();
    updateUserProfileName();
}

function initloginPage(){
    loginForm = document.querySelector("#loginForm");
    registerForm = document.querySelector("#registerForm")

    function setFormDisabled(form, isDisabled){
        form.querySelectorAll("input, button").forEach((node)=>{
            node.disabled = isDisabled;
        });
    }

    loginForm.addEventListener("submit", async (e)=>{
        e.preventDefault();
        const formData = new FormData(loginForm);
        
        const loginFormObj = Object.fromEntries(formData)
        console.log(loginFormObj)
        setFormDisabled(loginForm, true);
        const ok = await loginUser(loginFormObj)
        if(!ok)
            setFormDisabled(loginForm, false);
        loginForm.querySelectorAll("input").forEach((node)=> node.value = "")
    })

    registerForm.addEventListener("submit", async (e)=>{
        e.preventDefault();
        const formData = new FormData(registerForm);
        const registerObj = Object.fromEntries(formData)
        console.log(registerObj);
        setFormDisabled(registerForm, true);
        const ok = await registerUser(registerObj);
        if(!ok)
            setFormDisabled(registerForm, false);
        registerForm.querySelectorAll("input").forEach((node)=> node.value = "")
    })
}
