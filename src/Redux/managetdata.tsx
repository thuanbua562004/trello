import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  addBoard,
  addColum,
  addTask,
  fetchColum,
  getBoards,
  removeColumn,
  removeTask,
  updateColum,
  updateTask,
} from "../hook/databse";
import type { Board, Column, ListTasks, TaskType } from "../interface";
import { genIdRandom } from "../until";

// =================== TYPES ====================

export interface DataState {
  Colum: Column[];
  Boards: Board[];
}

const initialState: DataState = {
  Colum: [],
  Boards: [],
};

// =================== THUNKS ====================
export const addBoardRedux = createAsyncThunk(
  "addBoard",
  async (dataBoard: Board): Promise<Board> => {
    await addBoard(dataBoard.id,dataBoard.userId, dataBoard.name, dataBoard.background);
    return {id:dataBoard.id,userId:dataBoard.userId, name:dataBoard.name,background: dataBoard.background};
  }
);

export const fetchDataBoard = createAsyncThunk(
  "fetchDataBoard",
  async (): Promise<Record<string, Board>> => {
    const data = await getBoards();
    return data;
  }
);

export const fetchColumRedux = createAsyncThunk(
  "fetchColum",
  async (): Promise<Record<string, Column>> => {
    const data = await fetchColum();
    return data;
  }
);

export const addColumRedux = createAsyncThunk("addColum",async (data: Column): Promise<Column> => {
    const columId = `${data.id}_${genIdRandom()}`;

    await addColum(columId,data.name,data.color );
    return {id:columId ,name:data.name , listTask:data.listTask,color:data.color};
  }
);
export const updateColumRedux = createAsyncThunk("updateColum",async (data: Column[] |Column): Promise<any> => {
    let reMapData;
    const normalizeTasks = (tasks?: any[]) => {
      return tasks?.reduce((acc, task) => {
        if (task.id) acc[task.id] = task;
        return acc;
      }, {} as Record<string, any>);
    };

    if (Array.isArray(data)) {
      reMapData = data.map((item) => ({
        ...item,
        listTask: normalizeTasks(item.listTask),
      }));
    } else {
      reMapData = {
        ...data,
        listTask: normalizeTasks(data.listTask),
      };
    }
    await updateColum(reMapData)
    return data
  }
);

export const removeColumRedux = createAsyncThunk('removeColumn', async (id: string): Promise<{id:string}> => {
    await removeColumn(id);
    return {id}
}
);



export const addTaskRedux = createAsyncThunk(
  "addTask",
  async (data: TaskType): Promise<TaskType> => {
    let idgeb = genIdRandom()
    if(data.id !==undefined && data.value!==undefined){
      await addTask(idgeb, data.id, data.value);
    }
    return {id:idgeb , value:data.value};
  }
);
type UpdateTaskArg = {
  idCol: string;
  idTask: string;
  data: TaskType;
};

export const updateTaskRedux = createAsyncThunk<UpdateTaskArg, UpdateTaskArg>("updateTask",async ({ idCol, idTask, data })  => {
    await updateTask(idCol, idTask, data);
    console.log('upredux')
    return { idCol, idTask, data };
  }
);

export const removeTaskRedux = createAsyncThunk("removeTask",async ({ idCol, idTask }: { idCol: string; idTask: string }): Promise<{ idCol: string; idTask: string }> => {
    await removeTask(idCol , idTask)
    return { idCol, idTask };
  }
);



// =================== SLICE ====================
export const managerdata = createSlice({
  name: "manager",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch Boards
      .addCase(
        fetchDataBoard.fulfilled,
        (state, action: PayloadAction<Record<string, Board>>) => {
          if(action.payload==undefined)return
          state.Boards = Object.values(action.payload);
        }
      )
      .addCase(fetchDataBoard.rejected, (state, action) => {
        console.error("Lỗi khi lấy dữ liệu board:", action.error.message);
      })

      // Add Board
      .addCase(addBoardRedux.fulfilled,(state, action: PayloadAction<Board>) => {
        console.log(action.payload)  
        state.Boards.push(action.payload);
        }
      )
      .addCase(addBoardRedux.rejected, (state, action) => {
        console.error("Lỗi khi thêm board:", action.error.message);
      })

      // Fetch Columns
      .addCase(fetchColumRedux.fulfilled,
        (state, action: PayloadAction<Record<string, Column>>) => {
          if(!action.payload) return
          let data = Object.values(action?.payload);
          let handData = data.map((item) => {
            if (item.listTask) {
              return { ...item, listTask: Object.values(item.listTask) };
            }
            return item;
          });
          state.Colum = (handData)
        }
      )
      .addCase(fetchColumRedux.rejected, (state, action) => {
        console.error("Lỗi khi lấy cột:", action.error.message);
      })

      // Add Column
      .addCase(addColumRedux.fulfilled,(state, action: PayloadAction<Column>) => {
          console.log(state)
          state.Colum.push(action.payload);
        }
      )
      .addCase(addColumRedux.rejected, (state, action) => {
        console.error("Lỗi khi thêm cột:", action.error.message);
      })

      ////////////UPDATE COLUM
      .addCase(updateColumRedux.fulfilled, (state, action: PayloadAction<Column[] | Column>) => {
        const payload = action.payload;

        if (Array.isArray(payload)) {
          state.Colum = state.Colum.map((oldCol) => {
            const updated = payload.find((newCol) => newCol.id === oldCol.id);
            return updated ? updated : oldCol;
          });
        } else {
          state.Colum = state.Colum.map((col) =>
            col.id === payload.id ? {...col ,color:payload.color} : col
          );
        }
      })
      .addCase(updateColumRedux.rejected, (state, action) => {
        console.error("Lỗi khi thêm cột:", action.error.message);
      })

      .addCase(
        addTaskRedux.fulfilled,
        (state, action: PayloadAction<TaskType>) => {
          console.log(action.payload)
          const { id } = action.payload;
          const column = state.Colum.find((col) => col.id === id);
          if (column) {
            if (!column.listTask) column.listTask = [];
            column.listTask.push(action.payload);
          }
        }
      )
      .addCase(addTaskRedux.rejected, (state, action) => {
        console.error("Lỗi khi thêm cột:", action.error.message);
      })
      
      .addCase(updateTaskRedux.fulfilled,(state ,action)=>{
          let updateTask = state.Colum.map((item)=>{
            if(item.id == action.payload.idCol){
              return {...item , listTask : item.listTask?.map((task)=>{
                if(task.id == action.payload.idTask){
                  return {...task ,...action.payload.data}
                }
                return task
              })}
            }
            return item
          })
          state.Colum =updateTask
      })
      .addCase(updateTaskRedux.rejected, (state, action) => {
        console.error("Lỗi khi thêm cột:", action.error.message);
      })
      

      .addCase(removeColumRedux.fulfilled,(state , action)=>{
          state.Colum = state.Colum.filter((item)=>item.id!== action.payload.id)
      })
      .addCase(removeColumRedux.rejected, (state, action) => {
        console.error("Lỗi khi thêm cột:", action.error.message);
      })

      .addCase(removeTaskRedux.fulfilled,(state , action)=>{
        state.Colum = state.Colum.map((item)=>{
          if(item.id == action.payload.idCol){
              return {...item , listTask : item.listTask?.filter((task)=>task.id!== action.payload.idTask)}
          }
          return item
        })  
        
      })
      .addCase(removeTaskRedux.rejected, (state, action) => {
        console.error("Lỗi khi thêm cột:", action.error.message);
      })




      ;
  },
});

// =================== EXPORT ====================
export default managerdata.reducer;
