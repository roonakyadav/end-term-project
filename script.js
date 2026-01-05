// Central state object controlling the entire app
var state = {
    tasks: [],
    habits: [],
    goals: []
};

/* ===== STORAGE ===== */
function saveState() {
    localStorage.setItem("lifeOS", JSON.stringify(state));
}

function loadState() {
    var saved = localStorage.getItem("lifeOS");
    if (saved) state = JSON.parse(saved);
}

/* ===== TASKS ===== */
function addTask() {
    var title = taskTitle.value.trim();
    var priority = taskPriority.value;
    var date = taskDate.value;

    if (!title || !date) return;

    state.tasks.push({
        title: title,
        priority: priority,
        date: date,
        done: false
    });

    saveState();
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = "";
    var today = new Date().toISOString().split("T")[0];

    for (var i = 0; i < state.tasks.length; i++) {
        var task = state.tasks[i];

        var status = "Pending";
        if (task.done) status = "Done";
        else if (task.date < today) status = "Overdue";

        var li = document.createElement("li");
        li.className = "task " + task.priority + (task.done ? " done" : "");

        li.innerHTML = `
            <span>${task.title} <small>[${status}]</small></span>
            <button onclick="toggleTask(${i})">✔</button>
        `;

        taskList.appendChild(li);
    }

    updateDashboard();
}

function toggleTask(index) {
    state.tasks[index].done = !state.tasks[index].done;
    saveState();
    renderTasks();
}

/* ===== HABITS ===== */
function addHabit() {
    var name = habitName.value.trim();
    if (!name) return;

    state.habits.push({
        name: name,
        streak: 0,
        lastDone: null
    });

    saveState();
    renderHabits();
}

function renderHabits() {
    habitList.innerHTML = "";

    var today = new Date().toISOString().split("T")[0];
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday = yesterday.toISOString().split("T")[0];

    for (var i = 0; i < state.habits.length; i++) {
        var habit = state.habits[i];

        if (habit.lastDone !== today && habit.lastDone !== yesterday) {
            habit.streak = 0;
        }

        var li = document.createElement("li");
        li.className = "habit";

        li.innerHTML = `
            <span>${habit.name} 🔥 ${habit.streak}</span>
            <button onclick="completeHabit(${i})">Done</button>
        `;

        habitList.appendChild(li);
    }

    updateDashboard();
}

function completeHabit(index) {
    var today = new Date().toISOString().split("T")[0];
    var habit = state.habits[index];

    if (habit.lastDone !== today) {
        habit.streak++;
        habit.lastDone = today;
    }

    saveState();
    renderHabits();
}

/* ===== GOALS ===== */
function addGoal() {
    var name = goalName.value.trim();
    if (!name) return;

    state.goals.push({
        name: name,
        progress: 0
    });

    saveState();
    renderGoals();
}

function renderGoals() {
    goalList.innerHTML = "";

    for (var i = 0; i < state.goals.length; i++) {
        var goal = state.goals[i];

        var div = document.createElement("div");
        div.className = "goal";

        div.innerHTML = `
            <strong>${goal.name}</strong>
            <div class="progress-bar">
                <div class="progress" style="width:${goal.progress}%"></div>
            </div>
            <button onclick="increaseGoal(${i})">+20%</button>
        `;

        goalList.appendChild(div);
    }
}

function increaseGoal(index) {
    state.goals[index].progress += 20;
    if (state.goals[index].progress > 100) {
        state.goals[index].progress = 100;
    }
    saveState();
    renderGoals();
}

/* ===== DASHBOARD ===== */
function updateDashboard() {
    var completedTasks = 0;
    for (var i = 0; i < state.tasks.length; i++) {
        if (state.tasks[i].done) completedTasks++;
    }

    var today = new Date().toISOString().split("T")[0];
    var completedHabits = 0;
    for (var j = 0; j < state.habits.length; j++) {
        if (state.habits[j].lastDone === today) completedHabits++;
    }

    taskStats.innerText = completedTasks + "/" + state.tasks.length;
    habitStats.innerText = completedHabits + "/" + state.habits.length;

    var total = state.tasks.length + state.habits.length;
    var score = total === 0 ? 0 : Math.round(((completedTasks + completedHabits) / total) * 100);
    productivity.innerText = score + "%";
}

/* ===== INIT ===== */
addTaskBtn.onclick = addTask;
addHabitBtn.onclick = addHabit;
addGoalBtn.onclick = addGoal;

loadState();
renderTasks();
renderHabits();
renderGoals();
