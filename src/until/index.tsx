import type { Column } from "../interface";

export default function hexToTrelloRGBA(hex: string, alpha: number = 1): string {
  // Normalize short hex like #abc to #aabbcc
  if (hex.length === 4) {
    hex = '#' + [...hex.slice(1)].map(c => c + c).join('');
  }

  // Parse hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Trello uses strong color presence, no transparency
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}




export  function configPath  (paramPath:string){
    if(!paramPath) return
    const [part1, part2] = paramPath?.split("_");
    return part1+"_"+part2
}
export function genIdRandom (){
  return `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}
export function isValidUrl(str:string) {
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
}
export const findColumnIdByTaskId = (taskId:string, columns:Column[]) => {
    let idColumByTask
    columns.forEach((item)=>{
      item.listTask?.forEach((task)=>{
        if(task.id==taskId){
          idColumByTask = item.id
        }
      })
    })
    return idColumByTask
};

// Viết ngoài component, trên cùng file hoặc ở file utils riêng cũng được
export function addClassDarkMode() {
  let isMode = localStorage.getItem('isMode');
  if (
    isMode === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
