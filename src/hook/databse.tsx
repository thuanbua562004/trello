import {  ref, get,set, child, update, remove } from "firebase/database";
import { database } from "../config/firebase";
import type {  Column, TaskType } from "../interface";
import { genIdRandom } from "../until";
import { number } from "motion";

const dbRef = ref(database);

/////GET BOARD
export function getBoards() {
  return  get(child(dbRef, `boards/`))
    .then((snapshot: any) => {
      if (snapshot.exists()) {
        return snapshot.val()
      } else {
        console.log("No data available");
      }
    })
    .catch((error: any) => {
      console.error(error);
    });
}
//////ADD BOARD
export function addBoard(boardId :string,userId: string, name: string, imageUrl: string) {

  const boardData = {
    id: boardId,
    userId: userId,
    name: name,
    background: imageUrl,
  };

  return set(ref(database, `boards/${boardId}`), boardData);
}
///////COLUM HANDLER
export function fetchColum() {
  return   get(child(dbRef, `colums/`))
    .then((snapshot: any) => {
      if (snapshot.exists()) {
        return snapshot.val()
      } else {
        console.log("No data available");
      }
    })
    .catch((error: any) => {
      console.error(error);
    });
}

export function addColum(columId: string, name?: string , color?:string ,index?:number) {

  const colum = {
    id: columId,
    name: name,
    color:color ||null,
    index:index
  };

  return set(ref(database, `colums/${columId}`), colum);
}
export function updateColum(data: Column[] | Column) {
  if (Array.isArray(data)) {
    return Promise.all(
      data.map((colum) => {
        if (!colum.id) {
          throw new Error("Column phải có id");
        }
        if(colum.listTask==undefined){
          delete colum.listTask
        }
        return set(ref(database, `colums/${colum.id}`), colum);
      })
    );
  } else {
    if (!data.id) {
      throw new Error("Column phải có id");
    }
    if(data.listTask==undefined){
      delete data.listTask
    }
    return update(ref(database, `colums/${data.id}`), data);
  }
}

export function removeColumn(id: string) {
  console.log(id)
  return set(ref(database, `colums/${id}`),null);
}

export function addTask(idGen:string ,idColum:string, listTaksk :string ,index :number) {
  let listTask :TaskType = {id: idGen ,value :listTaksk , date: '' ,index: index }
  return set(ref(database, `colums/${idColum}/listTask/${idGen}`), listTask);
}


export function updateTask(idColum:string ,idTask:string, data :TaskType) {
  console.log(idTask)
  let listTask :TaskType =data
  return update(ref(database, `colums/${idColum}/listTask/${idTask}`), listTask);
}


export function removeTask(idColum:string ,idTask:string,) {
  return set(ref(database, `colums/${idColum}/listTask/${idTask}`), null);
}