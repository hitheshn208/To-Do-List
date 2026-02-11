let hasShownTaskSkeleton = false;

class TaskStats{
    static noOfCompleted = 0;
    static noOfPending = 0;

    static incrCompleted(){
        this.noOfCompleted++;
    }

    static incrPending(){
        this.noOfPending++;
    }

    static decrCompleted(){
        this.noOfCompleted--;
    }

    static decrPending(){
        this.noOfPending--;
    }

    static updateUI(){
        document.getElementById("totalCount").textContent = this.noOfCompleted + this.noOfPending;
        document.getElementById("completedCount").textContent = this.noOfCompleted;
        document.getElementById("pendingCount").textContent = this.noOfPending;
    }
}

function mainPageDOM(){
    hasShownTaskSkeleton = false;
    body = document.querySelector("body");
    body.innerHTML = `
    <nav class="navbar">
    <div class="logo">My Tasks</div>

    <div class="nav-actions">
        <div class="profile">
            <div class="profile-info">
                <img src="assets/avatar.png" alt="User" class="avatar">
                <span id="UserNameDisplay">Name</span>
            </div>
            <button class="logout-btn" onclick="showLogoutConfirmation()"><img src="assets/logout.png" alt="logout Img"></button>
        </div>
    </div>
</nav>

<div class="upperContainer">
    <button id="RefreshBtn"><img src="assets/refresh.png" alt=""></button>
    <div class="input-wrapper">
        <input id="taskInput" type="text" placeholder="Add new task..">
        <button id="AddTaskBtn" disabled>
            <img src="assets/plus_icon.png" alt="+">
        </button>
    </div>
</div>

<div class="stats">
    <div class="stat total">
        <span class="icon"><img src="assets/task.png" alt=""></span>
        <span class="label">Total</span>
        <span class="count" id="totalCount">0</span>
    </div>
    <div class="stat pending">
            <span class="icon"><img src="assets/pending.png" alt=""></span>
            <span class="label">Pending</span>
            <span class="count" id="pendingCount">0</span>
    </div>
    <div class="stat completed">
        <span class="icon"><img src="assets/completed.png" alt=""></span>
        <span class="label">Completed</span>
        <span class="count" id="completedCount">0</span>
    </div>

    
</div>

<div id="container">
</div>

<div id="MessageBox"></div>
<dialog id="dialogBox"></dialog>`
}

async function fillContainer()
{
    try{
        // Reset stats when loading fresh data
        TaskStats.noOfCompleted = 0;
        TaskStats.noOfPending = 0;
        
        if(!hasShownTaskSkeleton){
            for(let i = 0; i < 3; i++) {
                let skeleton = document.createElement("div")
                skeleton.classList.add("skeleton-task")
                container.append(skeleton)
            }
            hasShownTaskSkeleton = true;
        }
        const response = await fetch(`${BaseURL}/tasks`,{
            credentials: "include"
        })

        console.log(response)
        const tasks = await response.json()

        if(!response.ok)
            throw new Error(`HTTP Error : ${response.status} ${tasks.detail}`)

        console.log(typeof(tasks))
        const innerContainer = document.createElement("div");
        innerContainer.setAttribute("id", "innerContainer");
    
        if(tasks.length === 0)
        {
            console.log("Empty")
            let div = document.createElement("div")
            div.setAttribute("id","empty-row")
            div.innerHTML = `<h2>You're all caught up 🎉</h2>
                            <p>Add a task when you're ready.</p>`
            innerContainer.append(div)
        } else {
            for (let obj of tasks)
            {
                let div = document.createElement("div")
                div.classList.add("taskRow");
                div.dataset.id = obj.id;
                let isCompleted = obj.completed;
                if(isCompleted)
                {
                    div.classList.add("taskCompleted")
                    div.innerHTML = `
                        <span>
                            <input type="checkbox" id="taskCheckBox" checked>
                            <label for="taskCheckBox" id="taskCheckBoxlabel" class="checkBoxChecked">
                                <img src="assets/tick.png" alt="">
                            </label>
                        </span>
                        <h3>${obj.task}</h3>
                        <button id="Edit" onclick="openDialog(${obj.id})" disabled></button>
                        <button id = "Delete" onclick="deleteTask(${obj.id})"></button>`
                        innerContainer.append(div);
                        TaskStats.incrCompleted();

                }else{
                    div.classList.add("taskNotCompleted")
                    div.innerHTML = `
                        <span>
                            <input type="checkbox" id="taskCheckBox">
                            <label for="taskCheckBox" id="taskCheckBoxlabel" class="checkBoxUnChecked">
                                <img src="assets/tick.png" alt="">
                            </label>
                        </span>
                        <h3>${obj.task}</h3>
                        <button id="Edit" onclick="openDialog(${obj.id})"></button>
                        <button id = "Delete" onclick="deleteTask(${obj.id})"></button>`
                        innerContainer.append(div);
                        TaskStats.incrPending();
                }
            }
        }
        TaskStats.updateUI();
        container.innerHTML = `<h2>Tasks</h2>`
        container.append(innerContainer);
    }
    catch(e){
        showErrorMsg(e);
    }
}

async function addTodo()
{
    let newTaskDiv;
    try{
        let task = taskInput.value
        let completed = false
        
        if(task === ""){
            throw new Error("Enter the task")
        }
        const innerContainer = container.querySelector("#innerContainer");
        newTaskDiv = document.createElement("div");
        newTaskDiv.classList.add("taskRow", "taskNotCompleted");
        newTaskDiv.innerHTML = `
            <span>
                <input type="checkbox" id="taskCheckBox">
                <label for="taskCheckBox" id="taskCheckBoxlabel" class="checkBoxUnChecked">
                    <img src="assets/tick.png" alt="">
                </label>
            </span>
            <h3>${task}</h3>
            <button id="Edit" onclick="openDialog()"></button>
            <button id="Delete" onclick="deleteTask()"></button>`;
        
        if(innerContainer.querySelector("#empty-row")){
            innerContainer.innerHTML = "";
        }
        innerContainer.appendChild(newTaskDiv);
        TaskStats.incrPending();
        TaskStats.updateUI();

        newTaskDiv.querySelector("#Edit").disabled = true;
        newTaskDiv.querySelector("#Delete").disabled = true;

        let response = await fetch(`${BaseURL}/task`, {
            method : "POST",
            credentials: "include",
            headers : {
                "Content-type" : "application/json"
            },
            body :  JSON.stringify({
                task,
                completed
            })
        })

        if(!response.ok)
            throw new Error(`HTTP Error ! Status : ${response.status}`)
        
        const responseData = await response.json();
        console.log(responseData)
        newTaskDiv.dataset.id = responseData.id;
        newTaskDiv.querySelector("#Edit").onclick = function() { openDialog(`${responseData.id}`) };
        newTaskDiv.querySelector("#Delete").onclick = function() { deleteTask(`${responseData.id}`) };
        newTaskDiv.querySelector("#Edit").disabled = false;
        newTaskDiv.querySelector("#Delete").disabled = false;
        taskInput.value = ""
    }
    catch (e){
        if(newTaskDiv){
            newTaskDiv.remove();
            TaskStats.decrPending();
            TaskStats.updateUI();
            
            const innerContainer = container.querySelector("#innerContainer");
            if(innerContainer && innerContainer.children.length === 0){
                let emptyDiv = document.createElement("div");
                emptyDiv.setAttribute("id", "empty-row");
                emptyDiv.innerHTML = `<h2>You're all caught up 🎉</h2>
                                    <p>Add a task when you're ready.</p>`;
                innerContainer.appendChild(emptyDiv);
            }
        }
        showErrorMsg(e);
    }
}

async function deleteTask(id){
    let deletedDiv;
    try{
        deletedDiv = document.querySelector(`[data-id="${id}"]`);
        deletedDiv.style.display = "none";

        const response = await fetch(`${BaseURL}/task/${id}`, {
            method : "DELETE",
            credentials: "include"
        })

        if(!response.ok)
            throw new Error(`Could not delete in database`)

        if(deletedDiv.classList.contains("taskCompleted")){
            TaskStats.decrCompleted();
            TaskStats.updateUI();
        }else{
            TaskStats.decrPending();
            TaskStats.updateUI();
        }

        console.log(await response.text());
    }
    catch(e){
        showErrorMsg(e);
        deletedDiv.style.display = "flex";
    }
}

async function updateToDo(id)
{
    let previousName, taskName;
    try{
        let new_task = document.querySelector("#updateTaskInput");
        if (!new_task.value.trim()) {
            new_task.focus();
            new_task.style.borderColor = "red";
            throw new Error("Enter the task")
        }

        let deletedDiv = document.querySelector(`[data-id="${id}"]`);
        taskName = deletedDiv.querySelector("h3");
        previousName = taskName.textContent;
        taskName.textContent = new_task.value.trim();
        closeDialogBox();

        const response = await fetch(`${BaseURL}/task/${id}`, {
            method: "PUT",
            credentials: "include",
            headers : {
                "Content-type" : "application/json",
            },
            body : JSON.stringify({
                task: new_task.value ,
                completed : false
            })
        })

        if(!response.ok)
            throw new Error(`Could not update the task name`);
    }
    catch(e){
        showErrorMsg(e);
        taskName.textContent = previousName;
    }
}

async function changeTaskStatus(id, isCompleted)
{
    try{
        const taskDiv = document.querySelector(`[data-id="${id}"]`);
        const checkBoxLabel = taskDiv.querySelector("#taskCheckBoxlabel");
        
        if(isCompleted){
            taskDiv.classList.replace("taskNotCompleted", "taskCompleted");
            checkBoxLabel.classList.replace("checkBoxUnChecked", "checkBoxChecked");
            TaskStats.decrPending();
            TaskStats.incrCompleted();
        } else {

            taskDiv.classList.replace("taskCompleted", "taskNotCompleted");
            checkBoxLabel.classList.replace("checkBoxChecked", "checkBoxUnChecked");
            TaskStats.decrCompleted();
            TaskStats.incrPending();
        }
        TaskStats.updateUI();

        const response = await fetch(`${BaseURL}/task/completed/${id}?status=${isCompleted}`, {
            method: "PATCH",
            credentials: "include"
        })
        if(!response.ok)
            throw new Error(`HTTP Error ! Status : ${response.status}`)
        console.log(await response.text())
    }catch (e){
        const taskDiv = document.querySelector(`[data-id="${id}"]`);
        if(taskDiv){
            const checkBoxLabel = taskDiv.querySelector("#taskCheckBoxlabel");
            if(isCompleted){
                taskDiv.classList.replace("taskCompleted", "taskNotCompleted");
                checkBoxLabel.classList.replace("checkBoxChecked", "checkBoxUnChecked");
                TaskStats.decrCompleted();
                TaskStats.incrPending();
            } else {
                taskDiv.classList.replace("taskNotCompleted", "taskCompleted");
                checkBoxLabel.classList.replace("checkBoxUnChecked", "checkBoxChecked");
                TaskStats.decrPending();
                TaskStats.incrCompleted();
            }
            TaskStats.updateUI();
        }
        showErrorMsg(e);
    }
}

function openDialog(id){
    console.log(id);
    dialogBox.innerHTML = `
    <div class="update-modal">
        <h3>Update Task</h3>
        <input type="text" id="updateTaskInput" placeholder="Edit your task..." autocomplete="off"/>
        <div class="modal-actions">
            <button class="btn cancel-btn" onclick="closeDialogBox()">Cancel</button>
            <button class="btn update-btn" id="updateToDoButton" onclick="updateToDo(${id})">Update</button>
        </div>
    </div>`
    dialogBox.showModal();
}

function showErrorMsg(text){
    MessageBox = document.querySelector("#MessageBox");
    MessageBox.textContent = text;
    MessageBox.style.cssText  = "top: 30px; background-color: #ff3b3b;";
    let timer = setTimeout(()=>{
        MessageBox.style.top = "-100px"
    },4500)
    console.log(text)
}

function showSuccessMsg(text){
    MessageBox = document.querySelector("#MessageBox");
    MessageBox.textContent = text;
    MessageBox.style.cssText  = "top: 30px; background-color: #29a85e;";
    let timer = setTimeout(()=>{
        MessageBox.style.top = "-100px"
    },2500)
}

function closeDialogBox(){
    dialogBox.innerHTML = "";
    dialogBox.close()
}

function switchTab(type) {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (type === 'login') {
        loginTab.className = 'tab active';
        registerTab.className = 'tab inactive';
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        registerTab.className = 'tab active';
        loginTab.className = 'tab inactive';
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
    }
}

async function registerUser(user)
{
    try{
        const response = await fetch(`${BaseURL}/auth/register`,{
            method: "POST",
            credentials: "include",
            headers :{
                "Content-type": "application/json"
            },
            body: JSON.stringify(user)
        });
        const responseData = await response.json();

        if(!response.ok)
            throw new Error(`${responseData.detail}`)

        mainPageDOM();
        setTimeout(()=>{    
            initializeMainPage();
            showSuccessMsg(responseData.message);
        }, 50)
        return true;
    }
    catch(e){
        showErrorMsg(e.message);
        return false;
    }
}

async function loginUser(user){
    try{
        const response = await fetch(`${BaseURL}/auth/login`,{
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type" : "application/json"
            },
            body: JSON.stringify(user)
        });
        const responseData = await response.json();

        if(!response.ok)
            throw new Error(responseData.detail)

        mainPageDOM();
        setTimeout(()=>{    
                initializeMainPage();
                showSuccessMsg(responseData.message);
            }, 50)
        return true;
    }
    catch(e){
        showErrorMsg(e.message)
        return false;
    }
}

function loadLoginDOM(){
    const body = document.querySelector("body");
    
    body.innerHTML = `
<div class="outer-cover">
    <div class="auth-card">
        <div class="tab-container">
            <button class="tab active" id="loginTab" onclick="switchTab('login')">Login</button>
            <button class="tab inactive" id="registerTab" onclick="switchTab('register')">Register</button>
        </div>

        <form id="loginForm" class="form-content active" action="#" method="POST">
            <input type="email" placeholder="Email" name="email" required>
            <div class="input-group">
                <input type="password" placeholder="Password" name="password" required>
            </div>
            <button type="submit" class="submit-btn">Log In</button>
            <div class="footer-links">
                <a href="#">Forgot Password?</a>
            </div>
        </form>

        <form id="registerForm" class="form-content" action="#" method="POST">
            <input type="email" placeholder="Email " name="email" required>
            <input type="text" placeholder="Display Name" name="name" required>
            <input type="password" placeholder="Create Password" name="password" required>
            <button type="submit" class="submit-btn">Register</button>
            <div class="footer-links">
                Already have an account? <a href="#" onclick="switchTab('login')">Login</a>
            </div>
        </form>
    </div>
    <div id="MessageBox">Failed</div>
</div>`
}

async function checkLoggedIn(){
    try{
        const response = await fetch(`${BaseURL}/auth/me`,{
        method: "GET",
        credentials: "include"
    });

        if(!response.ok){
            loadLoginDOM();
            setTimeout(()=>{
                initloginPage();
            },50);
        }
        else{
            mainPageDOM();
            setTimeout(()=>{    
                    initializeMainPage();
            }, 50)
        }
    }

    catch(e){
        loadLoginDOM();
        setTimeout(()=>{
            initloginPage();
        },50);
    }
}

async function updateUserProfileName(){
    const response = await fetch(`${BaseURL}/auth/me`,{
        method: "GET",
        credentials: "include"
    });

    const user = await response.json()
    document.querySelector("#UserNameDisplay").textContent = user.name;
}

function showLogoutConfirmation(){
    dialogBox.innerHTML = `
    <div class="update-modal">
        <h3>Confirm Logout</h3>
        <p style="margin: 10px 0 20px 0; color: #555; font-size: 14px;">Are you sure you want to logout?</p>
        <div class="modal-actions">
            <button class="btn cancel-btn" onclick="closeDialogBox()">Cancel</button>
            <button class="btn update-btn" onclick="confirmLogout()">Yes, Logout</button>
        </div>
    </div>`
    dialogBox.showModal();
}

async function confirmLogout(){
    closeDialogBox();
    await logout();
}

async function logout(){
    try{
        const logoutBtn = document.querySelector(".logout-btn");
        logoutBtn.disabled = true;

        const response = await fetch(`${BaseURL}/auth/logout`, {
            method: "POST",
            credentials: "include"
        });
        let responseData = await response.json();

        if(!response.ok)
            throw new Error("Failed to logout");

        loadLoginDOM();
        setTimeout(()=>{
            initloginPage();
            showSuccessMsg(responseData.message);
        },50);
    }
    catch(e){
        const logoutBtn = document.querySelector(".logout-btn");
        logoutBtn.disabled = false;
        showErrorMsg(e);
    }

}