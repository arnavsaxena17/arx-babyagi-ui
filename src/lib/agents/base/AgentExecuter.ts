import { AgentMessage, AgentTask } from '@/types';
import { Printer } from '@/utils/print';

export class AgentExecuter {
  objective: string;
  modelName: string;
  handlers: {
    handleMessage: (message: AgentMessage) => Promise<void>;
    handleEnd: () => Promise<void>;
    handleError: (e: Error) => Promise<void>;
  };
  language: string;
  verbose: boolean;
  signal?: AbortSignal;

  printer: Printer;
  taskList: AgentTask[] = [];
  intervalId?: NodeJS.Timeout;

  constructor(
    objective: string,
    modelName: string,
    handlers: {
      handleMessage: (message: AgentMessage) => Promise<void>;
      handleEnd: () => Promise<void>;
      handleError: (e: Error) => Promise<void>;
    },
    language: string = 'en',
    varbose: boolean = false,
    signal?: AbortSignal,
  ) {
    this.objective = objective;
    this.modelName = modelName;
    this.handlers = handlers;
    this.language = language;
    this.verbose = varbose;
    this.signal = signal;
    this.printer = new Printer(this.handlers.handleMessage, this.verbose);
  }

  async run() {
    
    console.log("this.objective::", this.objective);
    console.log("this.modelName::", this.modelName);
    console.log("this.handlers::", this.handlers);
    console.log("this.language::", this.language);
    console.log("this.verbose::", this.verbose);
    console.log("this.signal::", this.signal);
    
    
    this.taskList = [];
    await this.prepare();
    await this.loop();
    await this.finishup();
  }

  // prepare() is called before loop()
  async prepare() {
    console.log("Got to preparea::");
    console.log("Got to preparea this objective::", this.objective);
    
    this.printer.printObjective(this.objective);

    // Start ping loop to keep the connection alive
    this.intervalId = setInterval(async () => {
      if (this.signal?.aborted) {
        clearInterval(this.intervalId);
      } else {
        await this.handlers.handleMessage({ type: 'ping', content: '' });
      }
    }, 10000);
  }
  async loop() {
    console.log("loop is blank!!??")
  }

  async finishup() {
    if (this.signal?.aborted) return;
    // Objective completed
    this.printer.printAllTaskCompleted();
    this.handlers.handleEnd();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
