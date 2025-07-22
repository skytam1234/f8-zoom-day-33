import "./components/app-modal.js";
import * as DAO from "./httpRequest/httpRequest.js";
const todoTask = {
  appModal: document.querySelector(`#app-modal`),
  btnOpenOrCloseForm: document.querySelector(`.add-btn`),
  btnCloseFormTask: document.querySelector(`.modal-close`),
  searchBtn: document.querySelector(`.search-input`),
  sortAllTaskBtn: document.querySelector(`#allTask-btn`),
  sortActiveTaskBtn: document.querySelector(`#active-btn`),
  sortCompleteTaskBtn: document.querySelector(`#completed-btn`),
  modal: document.querySelector(`.modal`),
  taskTitle: document.querySelector(`#taskTitle`),
  taskDescription: document.querySelector(`#taskDescription`),
  taskCategory: document.querySelector(`#taskCategory`),
  taskPriority: document.querySelector(`#taskPriority`),
  startTime: document.querySelector(`#startTime`),
  endTime: document.querySelector(`#endTime`),
  taskDate: document.querySelector(`#taskDate`),
  taskColor: document.querySelector(`#taskColor`),
  addOrEditForm: document.querySelector(`.todo-app-form`),
  listTask: document.querySelector(`#todoList`),
  formInsertOrEditTask: document.querySelector(`#addTaskModal`),
  modalTitle: document.querySelector(`.modal-title`),
  toasts: [
    {
      title: " Thành công",
      message: "Thành công",
      type: "susses",
      toastIcon: "fa-solid fa-check",
    },
    {
      title: " Thông báo",
      message: "Đây là thông báo",
      type: "info",
      toastIcon: "fa-solid fa-circle-exclamation",
    },
    {
      title: " Cảnh báo",
      message: "Đây là cảnh báo",
      type: "warning",
      toastIcon: "fa-solid fa-circle-exclamation",
    },
    {
      title: " Thất bại",
      message: "Thất bại",
      type: "error",
      toastIcon: "fa-solid fa-exclamation",
    },
  ],
  tasks: [],
  task: {},
  isInsert: true,
  async start() {
    await this.renderTask();
    await this.hangDleEvent();
  },
  createToast(toast, message) {
    if (!toast) return;
    const toastElementOld = document.querySelector(".toast");
    if (toastElementOld) document.body.removeChild(toastElementOld);
    const toastElement = document.createElement("div");
    message ? (toast.message = message) : toast;
    toastElement.classList.add("toast", `toast--${toast.type}`);
    toastElement.innerHTML = `
                          <div class="toast__icon">
                                <i class="${toast.toastIcon}"></i>
                              </div>
                              <div class="toast__body">
                                <h3 class="toast__title">${toast.title}</h3>
                                <p class="toast__msg">
                                ${toast.message}
                                </p>
                              </div>
                              <div class="toast__close">
                                <i class="fa-solid fa-xmark"></i>
                              </div>
                          `;
    document.body.appendChild(toastElement);
  },
  addCurrentTask() {
    this.taskTitle.value = this.task.title;
    this.taskDescription.value = this.task.description;
    this.taskCategory.value = this.task.category;
    this.taskPriority.value = this.task.priority;
    this.startTime.value = this.task.startTime;
    this.endTime.value = this.task.endTime;
    this.taskDate.value = this.task.dueDate;
    this.taskColor.value = this.task.color;
  },

  async renderTask(todoTasks) {
    if (todoTasks) {
      let html =
        "" +
        todoTasks
          .map(function (task) {
            return `
        <div class="task-card ${this.escape(
          task.color
        )} ${task.isCompleted ? "completed" : ""}" data-id=${this.escape(task.id)}>
        <div class="task-header">
          <h3 class="task-title">${this.escape(task.title)}</h3>
          <button class="task-menu">
            <i class="fa-solid fa-ellipsis fa-icon"></i>
            <div class="dropdown-menu">
              <div class="dropdown-item edit-btn" data-id="${this.escape(
                task.id
              )}">
                <i class="fa-solid fa-pen-to-square fa-icon"></i>
                Edit
              </div>
              <div class="dropdown-item complete-btn" data-id="${this.escape(
                task.id
              )}">
                <i class="fa-solid fa-check fa-icon"></i>
                ${task.isCompleted ? "Mark as Active" : "Mark as Complete"}
              </div>
              <div class="dropdown-item delete delete-btn" data-id="${this.escape(
                task.id
              )}">
                <i class="fa-solid fa-trash fa-icon"></i>
                Delete
              </div>
            </div>
          </button>
        </div>
        <p class="task-description">${this.escape(task.description)}</p>
        <div class="task-time">${this.escape(
          task.startTime
        )} - ${this.escape(task.endTime)}</div>
      </div>
        `;
          })
          .join("");
      if (html.length === 0)
        html = `<div class="error-ms">Không tìm thấy nhiệm vụ vào</div>`;
      this.listTask.innerHTML = html;
      return;
    }
    this.tasks = await DAO.getTasks();
    let html =
      "" +
      (await this.tasks
        .map((task) => {
          return `
        <div class="task-card ${this.escape(task.color)} ${
            task.isCompleted ? "completed" : ""
          }" data-id=${this.escape(task.id)}>
        <div class="task-header">
          <h3 class="task-title">${this.escape(task.title)}</h3>
          <button class="task-menu">
            <i class="fa-solid fa-ellipsis fa-icon"></i>
            <div class="dropdown-menu">
              <div class="dropdown-item edit-btn" data-id="${this.escape(
                task.id
              )}">
                <i class="fa-solid fa-pen-to-square fa-icon"></i>
                Edit
              </div>
              <div class="dropdown-item complete-btn" data-id="${this.escape(
                task.id
              )}">
                <i class="fa-solid fa-check fa-icon"></i>
                ${task.isCompleted ? "Mark as Active" : "Mark as Complete"}
              </div>
              <div class="dropdown-item delete delete-btn" data-id="${this.escape(
                task.id
              )}">
                <i class="fa-solid fa-trash fa-icon"></i>
                Delete
              </div>
            </div>
          </button>
        </div>
        <p class="task-description">${this.escape(task.description)}</p>
        <div class="task-time">${this.customTime(
          this.escape(task.startTime)
        )} - ${this.customTime(this.escape(task.endTime))}</div>
      </div>
        `;
        })
        .join(""));
    if (html.length === 0)
      html = `<div class="error-ms">Không tìm thấy nhiệm vụ vào</div>`;
    this.listTask.innerHTML = html;
  },
  customTime(time) {
    let result = "";
    let arr = time.toString().split(":");
    if (arr[0] >= 12)
      return (result = `${(arr[0] - 12).toString().padStart(2, "0")}:${
        arr[1]
      } PM`);
    if (arr[0] < 12) return (result = `${arr[0]}:${arr[1]} AM`);
  },
  //escape
  escape(html) {
    const tempDiv = document.createElement("div");
    tempDiv.textContent = html;
    return tempDiv.innerHTML;
  },
  hangDleEvent() {
    this.btnOpenOrCloseForm.onclick = () => {
      this.appModal.open();
    };
    //   if (confirm(`Bạn chắc chắn muốn thoát?`)) {
    //     this.toggleTask.call(this);
    //   }
    // };
    // this.cancelModalBtn.onclick = () => {
    //   if (confirm(`Bạn chắc chắn muốn thoát?`)) {
    //     this.toggleTask.call(this);
    //   }
    // };
    // this.formInsertOrEditTask.onclick = (e) => {
    //   if (!this.modal.contains(e.target)) {
    //     this.cancelModalBtn.onclick();
    //   }
    // };
    // this.addOrEditForm.onsubmit = async (e) => {
    //   e.preventDefault();
    //   if (this.isInsert) {
    //     const newTask = Object.fromEntries(new FormData(this.addOrEditForm));
    //     if (!this.tasks.find((task) => task.title === newTask.title)) {
    //       await this.createTask.call(this, newTask);
    //       this.createToast(
    //         this.toasts[0],
    //         "Thành công rồi bạn nhé! Yên tâm đi"
    //       );
    //       const oldTask = this.listTask.querySelector(`.error-ms`);
    //       if (oldTask) this.listTask.removeChild(oldTask);
    //       const div = document.createElement("div");
    //       div.classList.add(`task-card`);
    //       div.classList.add(this.escape(newTask.color));
    //       const html = `
    //                   <div class="task-header">
    //       <h3 class="task-title">${this.escape(newTask.title)}</h3>
    //       <button class="task-menu">
    //         <i class="fa-solid fa-ellipsis fa-icon"></i>
    //         <div class="dropdown-menu">
    //           <div class="dropdown-item edit-btn" data-id="${this.escape(
    //             this.task.id
    //           )}">
    //             <i class="fa-solid fa-pen-to-square fa-icon"></i>
    //             Edit
    //           </div>
    //           <div class="dropdown-item complete-btn" data-id="${this.escape(
    //             this.task.id
    //           )}">
    //             <i class="fa-solid fa-check fa-icon"></i>
    //             ${newTask.isCompleted ? "Mark as Active" : "Mark as Complete"}
    //           </div>
    //           <div class="dropdown-item delete delete-btn" data-id="${this.escape(
    //             this.task.id
    //           )}">
    //             <i class="fa-solid fa-trash fa-icon"></i>
    //             Delete
    //           </div>
    //         </div>
    //       </button>
    //     </div>
    //     <p class="task-description">${this.escape(newTask.description)}</p>
    //     <div class="task-time">${this.customTime(
    //       this.escape(newTask.startTime)
    //     )} - ${this.customTime(this.escape(newTask.endTime))}</div>`;
    //       div.innerHTML = html;
    //       this.listTask.appendChild(div);
    //       this.toggleTask();
    //     } else {
    //       this.createToast(
    //         this.toasts[3],
    //         "Không thể thêm được đâu, trùng title mất rồi bạn ơi."
    //       );
    //     }
    //   } else {
    //     const newTask = Object.fromEntries(new FormData(this.addOrEditForm));
    //     await this.editTask.call(this, this.task.id, newTask);
    //     this.renderTask.call(this);
    //     this.toggleTask();
    //   }
    // };
    this.listTask.onclick = async (e) => {
      const editBtn = e.target.closest(`.edit-btn`);
      const completeOrActiveBtn = e.target.closest(`.complete-btn`);
      const deleteBtn = e.target.closest(`.delete-btn`);

      if (editBtn) {
        this.appModal.innerHTML = `<span slot="title">Edit Form</span>
                                    <span slot="save-btn">Save</span>`;
        this.appModal.open();
      }
      if (completeOrActiveBtn) {
        const newTask = { isCompleted: true };
        await DAO.editTask(completeOrActiveBtn.dataset.id, newTask);
        await DAO.renderTask();
      }
      if (deleteBtn) {
        if (confirm("Bạn chắc chắn muốn xóa?")) {
          console.log(deleteBtn.dataset.id);
          await DAO.deleteTask(deleteBtn.dataset.id);
          await this.createToast(
            this.toasts[0],
            "Thành công rồi bạn nhé! Yên tâm đi"
          );
          this.renderTask();
        }
      }
    };
    this.searchBtn.oninput = async (e) => {
      this.sortCompleteTaskBtn.classList.remove("active");
      this.sortAllTaskBtn.classList.add("active");
      this.sortActiveTaskBtn.classList.remove("active");
      let str = this.searchBtn.value;
      let newList = this.tasks.filter(
        (task) =>
          task.title.toString().toLowerCase().includes(str) ||
          task.description.toString().toLowerCase().includes(str)
      );

      await this.renderTask.call(this, newList);
    };
    this.sortAllTaskBtn.onclick = async (e) => {
      this.sortCompleteTaskBtn.classList.remove("active");
      this.sortAllTaskBtn.classList.add("active");
      this.sortActiveTaskBtn.classList.remove("active");
      await this.renderTask.call(this);
    };
    this.sortActiveTaskBtn.onclick = async (e) => {
      this.sortCompleteTaskBtn.classList.remove("active");
      this.sortAllTaskBtn.classList.remove("active");
      this.sortActiveTaskBtn.classList.add("active");
      let newList = this.tasks.filter((task) => {
        if (task.isCompleted) {
          return true;
        } else {
          return false;
        }
      });
      await this.renderTask.call(this, newList);
    };
    this.sortCompleteTaskBtn.onclick = async (e) => {
      this.sortCompleteTaskBtn.classList.add("active");
      this.sortAllTaskBtn.classList.remove("active");
      this.sortActiveTaskBtn.classList.remove("active");
      let newList = this.tasks.filter((task) => {
        if (!task.isCompleted) {
          return true;
        } else {
          return false;
        }
      });
      await this.renderTask.call(this, newList);
    };
  },
};
todoTask.start();
