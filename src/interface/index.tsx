interface SettingItem {
  id: string;
  to: string;
  name: string;
  children?: SettingItem[];
  state? :boolean
}

type TaskType = { 
  id?: string; 
  value?: string; 
  date?:string,
  state?:boolean|false,
  img?:string,
  description?:string
};

type ListTasks = {
  id: string;
  name: string;
  listTask: TaskType[];
  color?:string
};

 interface Column {
  id: string;
  name?: string;
  color?: string;
  listTask?:TaskType[]; 
}

 interface Board {
  id:string
  userId: string;
  name: string;
  background: string;
}
export type { SettingItem, TaskType, ListTasks ,Column , Board };
