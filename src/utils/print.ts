import { AgentTask, AgentMessage } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export class Printer {
  messageCallback: (message: AgentMessage) => void;
  verbose: boolean = false;
  constructor(
    messageCallback: (message: AgentMessage) => void,
    verbose: boolean = false,
  ) {
    this.messageCallback = messageCallback;
    this.verbose = verbose;
  }

  printObjective(objective: string) {
    console.log("Got to printObjective::", objective);
    this.handleMessage({ content: objective, type: 'objective' });
    if (!this.verbose) return;
    console.log('\x1b[35m%s\x1b[0m', '*****OBJECTIVE*****\n' + objective);
  }

  printNextTask(task: AgentTask) {
    console.log("Going to print next atsk:", task);
    
    if (!this.verbose) return;
    console.log('\x1b[33m%s\x1b[0m', '*****NEXT TASK*****\n');
    console.log(task);
  }

  printTaskExecute(task: AgentTask) {
    console.log("This is printTaskExecute", task);
    
    this.handleMessage({ taskId: task.id.toString(), content: '', type: task.skill, title: task.task, icon: task.icon || '', options: { dependentTaskIds: task.dependentTaskIds?.join(', ') ?? '' }, status: 'running', });

    if (!this.verbose) return;
    console.log('\x1b[35m%s\x1b[0m', '*****NEXT TASK*****\n');
    console.log(task);
  }

  printTaskList(taskList: AgentTask[], id?: string) {
    console.log("taskList:", taskList);
    
    let message = '| ID | Status | Task  | Skill | Dependency | \n | :-: | :-: | - | :-: | :-: | \n';
    console.log("message:", message);
    taskList.forEach((task) => {
      const dependentTask = task.dependentTaskIds ? `${task.dependentTaskIds.join(', ')}` : '-';
      const status = task.status === 'complete' ? '✅' : '⬜️';
      message += `| ${task.id} | ${status} | ${task.task} | ${task.icon} | ${dependentTask} |\n`;
    });
    console.log("taskList:", taskList);
    this.messageCallback({ id, content: message, type: 'task-list', style: 'text', status: 'complete' });

    if (!this.verbose) return;
    console.log('\x1b[34m%s\x1b[0m', '*****TASK LIST*****\n' + message);
  }

  printTaskOutput(output: string, task: AgentTask) {
    console.log("This is output", output);
    if (!this.verbose) return;
    console.log('\x1b[32m%s\x1b[0m', '*****TASK OUTPUT*****\n' + output);
  }

  printTaskCompleted() {
    // this.messageCallback(setupMessage('done', 'Done!'));
    if (!this.verbose) return;
    console.log('\x1b[35m%s\x1b[0m', '*****DONE*****\n');
  }

  printAllTaskCompleted() {
    this.handleMessage({
      content: 'All task completed!',
      type: 'finish',
    });

    if (!this.verbose) return;
    console.log('\x1b[36m%s\x1b[0m', '*****ALL TASK COMPLETED*****\n');
  }

  // handleMessage() is called by the agent to send a message to the frontend
  async handleMessage(message: AgentMessage) {
    console.log("This is message", message);
    const msg = { ...message, id: message.id || uuidv4(), status: message.status || 'complete' };
    await this.messageCallback(msg);
  }
}
