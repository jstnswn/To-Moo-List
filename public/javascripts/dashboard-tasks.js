// import { createTaskDiv } from './dashboard-list'


export const finishTask = (e) => {
    const completeTask = document.querySelector(".completed");
    const taskId = e.target.dataset.task;
    completeTask.addEventListener("click", async(e) =>{
        const res = await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({isCompleted: true})
        });
        if (!res.ok) {
            console.log("Something went wrong")
        } else {
            console.log("it worked")
        }
    })    
}

export const deleteTask = (e) => {
    const trashTask = document.querySelector(".delete");
    const taskId = e.target.dataset.task;
    
    trashTask.addEventListener('click', async (e) => {
        const res = await fetch(`/api/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        })
        if (!res.ok) {
            console.log("Something went wrong")
        } else {
            console.log("it worked")
            const deleteDiv = document.querySelector(`[data-task="${taskId}"]`);
            deleteDiv.remove();
        }
    })
}

export const moveTask = (e) => {
    const moveCal = document.querySelector(".moveTo");
    const taskId = e.target.dataset.task;

    moveCal.addEventListener("click", async (e) => {
        const res = await fetch(`/api/tasks/${taskId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({listId: 6})
        })
        if (!res.ok) {
            console.log("Something went wrong")
        } else {
            console.log("it worked")
            const deleteDiv = document.querySelector(`[data-task="${taskId}"]`);
            deleteDiv.remove();
        }
    })
}
// window.addEventListener("load", async (e) => {
// })
