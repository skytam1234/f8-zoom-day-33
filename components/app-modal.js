import * as DAO from "../httpRequest/httpRequest.js";
class AppModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        const template = document.querySelector(`#app-modal-tpl`);
        const appModalNode = template.content.cloneNode(true);
        const ad = this.shadowRoot.querySelector(`span`);
        console.log(ad);
        this.shadowRoot.appendChild(appModalNode);
        this.shadowRoot.addEventListener("click", (e) => {
            const modalContainer =
                this.shadowRoot.querySelector(`#addTaskModal`);
            if (!modalContainer.classList.contains("show")) {
                return;
            }
            e.stopPropagation();
            const cancelBtn = e.target.closest(`.btn-cancel`);
            const confirmBtn = e.target.closest(`.btn-submit`);
            const modal = this.shadowRoot.querySelector(`.modal`);
            const isOverlay = modal && !modal.contains(e.target);
            const form = this.shadowRoot.querySelector(`.todo-app-form`);
            const modalClose = e.target.closest(`.modal-close`);
            if (cancelBtn || modalClose || isOverlay) {
                if (confirm("Bạn chắc chắn muốn tắt  form?")) {
                    this.close();
                }
            }
            if (confirmBtn) {
                const newTask = Object.fromEntries(new FormData(form));
                DAO.createTask(newTask);
                this.close();
            }
        });
        this.shadowRoot.addEventListener("keydown", (e) => {
            if (e.key === `Escape`) {
                if (confirm("Bạn chắc chắn muốn tắt  form?")) {
                    this.close();
                }
            }
        });
    }

    open() {
        const modal = this.shadowRoot.querySelector(`.modal`);
        const taskTitle = this.shadowRoot.querySelector(`#taskTitle`);
        const modalApp = this.shadowRoot.querySelector(`#addTaskModal`);
        const form = this.shadowRoot.querySelector(`.todo-app-form`);
        form.reset();
        modal.scrollTop = 0;
        modalApp.classList.add(`show`);
        setTimeout(() => {
            taskTitle.focus();
        }, 100);
    }
    close() {
        this.shadowRoot.querySelector(`#addTaskModal`).classList.remove(`show`);
    }
}
customElements.define(`app-modal`, AppModal);
