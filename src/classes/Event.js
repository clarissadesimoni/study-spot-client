class Event {
    constructor(isTodoist, id, title, projectId, labels, isCompleted, duration=null, due_obj=null, due_dict=null) {
        this.isTodoist = isTodoist;
        this.id = id;
        this.name = title;
        this.projectId = projectId;
        this.labels = labels;
        this.isCompleted = isCompleted;
        this.duration = duration;
        this.due = !due_obj || !due_dict ? null : due_obj ?? new Date(Date.parse(due_dict.datetime ?? due_dict.date));
    }
}

export default Task;