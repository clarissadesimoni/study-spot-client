class Task {
    constructor(isTodoist, id, title, projectId, labels, isCompleted, duration, due_obj=null, due_dict=null) {
        this.isTodoist = isTodoist;
        this.id = id;
        this.name = title;
        this.projectId = projectId;
        this.labels = labels;
        this.isCompleted = isCompleted;
        this.duration = duration;
        this.due = due_obj ?? Date.parse(due_dict.datetime ?? due_dict.date)
    }

    isBefore = function (other) {
        return this.due <= other.due;
    }
}

export default Task;