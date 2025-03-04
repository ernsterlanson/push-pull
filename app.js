// DOM Elements
const pushupGoalInput = document.getElementById('pushup-goal');
const pullupGoalInput = document.getElementById('pullup-goal');
const setGoalsBtn = document.getElementById('set-goals-btn');
const exerciseTypeSelect = document.getElementById('exercise-type');
const repsDoneInput = document.getElementById('reps-done');
const addSetBtn = document.getElementById('add-set-btn');
const resetProgressBtn = document.getElementById('reset-progress-btn');

// Progress display elements
const pushupCompletedEl = document.getElementById('pushup-completed');
const pullupCompletedEl = document.getElementById('pullup-completed');
const pushupGoalDisplayEl = document.getElementById('pushup-goal-display');
const pullupGoalDisplayEl = document.getElementById('pullup-goal-display');
const pushupProgressBar = document.getElementById('pushup-progress-bar');
const pullupProgressBar = document.getElementById('pullup-progress-bar');

// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

// App state
let state = {
    pushupGoal: 50,
    pullupGoal: 20,
    pushupCompleted: 0,
    pullupCompleted: 0
};

// Load state from localStorage
function loadState() {
    const savedState = localStorage.getItem('pushPullState');
    if (savedState) {
        state = JSON.parse(savedState);
        
        // Update input values
        pushupGoalInput.value = state.pushupGoal;
        pullupGoalInput.value = state.pullupGoal;
        
        // Update display
        updateDisplay();
    }
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('pushPullState', JSON.stringify(state));
}

// Update the display with current state
function updateDisplay() {
    // Update goal displays
    pushupGoalDisplayEl.textContent = state.pushupGoal;
    pullupGoalDisplayEl.textContent = state.pullupGoal;
    
    // Update completed counts
    pushupCompletedEl.textContent = state.pushupCompleted;
    pullupCompletedEl.textContent = state.pullupCompleted;
    
    // Update progress bars
    const pushupPercentage = (state.pushupCompleted / state.pushupGoal) * 100;
    const pullupPercentage = (state.pullupCompleted / state.pullupGoal) * 100;
    
    pushupProgressBar.style.width = `${Math.min(pushupPercentage, 100)}%`;
    pullupProgressBar.style.width = `${Math.min(pullupPercentage, 100)}%`;
    
    // Change color when goal is reached
    if (state.pushupCompleted >= state.pushupGoal) {
        pushupProgressBar.style.backgroundColor = '#27ae60';
    } else {
        pushupProgressBar.style.backgroundColor = '#e74c3c';
    }
    
    if (state.pullupCompleted >= state.pullupGoal) {
        pullupProgressBar.style.backgroundColor = '#27ae60';
    } else {
        pullupProgressBar.style.backgroundColor = '#3498db';
    }
}

// Set goals handler
function handleSetGoals() {
    state.pushupGoal = parseInt(pushupGoalInput.value) || 1;
    state.pullupGoal = parseInt(pullupGoalInput.value) || 1;
    
    // Ensure goals are at least 1
    if (state.pushupGoal < 1) state.pushupGoal = 1;
    if (state.pullupGoal < 1) state.pullupGoal = 1;
    
    // Update display and save
    updateDisplay();
    saveState();
    
    // Show confirmation
    alert('Goals updated!');
}

// Add set handler
function handleAddSet() {
    const exerciseType = exerciseTypeSelect.value;
    const repsDone = parseInt(repsDoneInput.value) || 0;
    
    if (repsDone <= 0) {
        alert('Please enter a valid number of reps');
        return;
    }
    
    if (exerciseType === 'pushup') {
        state.pushupCompleted += repsDone;
    } else if (exerciseType === 'pullup') {
        state.pullupCompleted += repsDone;
    }
    
    // Update display and save
    updateDisplay();
    saveState();
    
    // Reset reps input
    repsDoneInput.value = 1;
    
    // Check if goal is reached
    checkGoalReached(exerciseType);
}

// Check if goal is reached and show notification
function checkGoalReached(exerciseType) {
    if (exerciseType === 'pushup' && state.pushupCompleted >= state.pushupGoal) {
        if (state.pushupCompleted === state.pushupGoal) {
            alert('Congratulations! You reached your pushup goal!');
        }
    } else if (exerciseType === 'pullup' && state.pullupCompleted >= state.pullupGoal) {
        if (state.pullupCompleted === state.pullupGoal) {
            alert('Congratulations! You reached your pullup goal!');
        }
    }
    
    // Check if both goals are reached
    if (state.pushupCompleted >= state.pushupGoal && state.pullupCompleted >= state.pullupGoal) {
        if (state.pushupCompleted === state.pushupGoal || state.pullupCompleted === state.pullupGoal) {
            alert('Amazing! You completed all your goals for today!');
        }
    }
}

// Add event listeners
setGoalsBtn.addEventListener('click', handleSetGoals);
addSetBtn.addEventListener('click', handleAddSet);

// Reset progress functionality
resetProgressBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to reset today\'s progress?')) {
        state.pushupCompleted = 0;
        state.pullupCompleted = 0;
        updateDisplay();
        saveState();
        alert('Progress reset!');
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadState();
    
    // Check if it's a new day and reset progress if needed
    const lastDate = localStorage.getItem('lastDate');
    const today = new Date().toDateString();
    
    if (lastDate !== today) {
        // It's a new day, reset progress but keep goals
        state.pushupCompleted = 0;
        state.pullupCompleted = 0;
        localStorage.setItem('lastDate', today);
        saveState();
    }
}); 