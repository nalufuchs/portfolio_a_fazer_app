<script setup>
import { onMounted, ref } from 'vue'

let id = 0
const newTodo = ref('')
const todos = ref([])

// Adicionar item via FETCH API
async function createTask(text) {
  try {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text })
    };
    const response = await fetch('http://localhost:3001/api/tasks', requestOptions)
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

// Excluir item via FETCH API
async function deleteTask(id) {
  try {
    const requestOptions = {
      method: "DELETE",
    };
    const response = await fetch(`http://localhost:3001/api/tasks/${id}`, requestOptions);

    if (response.ok) {
      // Se o status da resposta for OK (204), atualizar todos os locais
      todos.value = todos.value.filter((t) => t.id !== id);
    } else {
      console.error("Görev silinirken hata oluştu:", response.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}


async function addTodo() {
  const newTask = await createTask(newTodo.value)
  todos.value.push(newTask)
  newTodo.value = ''
}

async function removeTodo(todo) {
  await deleteTask(todo.id)
  todos.value = todos.value.filter((t) => t.id !== todo.id)
}

onMounted(async () => {
  await fetchTasks();
})

async function fetchTasks() {
  try {
    const response = await fetch('http://localhost:3001/api/tasks');
    todos.value = await response.json();
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div id="containerr" style="text-align: center; display: inline-block; width: 49%;"> 
    <form @submit.prevent="addTodo">
      <input autofocus placeholder="Adicione sua tarefa aqui" id='inptBtn' v-model="newTodo">
      <button id="addBtn">Adicionar Tarefa</button>     
    </form>
    <ul>
      <li v-for="item in todos" :key="item.id">  
        {{ item.text }}         
        <button style='height: 39px; width: 39px; border-radius: 23px;' @click="removeTodo(item)">X</button>
      </li>
    </ul>
    <router-link to="/">
        <button style="width: 157px;">Menu Principal</button>
    </router-link>
  </div>
</template>


<style scoped> 
 
  /* Página Central */
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
  }

  /* Centralize o formulário e adicione uma moldura oval */
  form {
    display: flex;
    padding-left: 12px;
    padding-right: 12px;
    margin-bottom: 23px;
    flex-direction: column;
    align-items: center;
    border: 2px solid #ccc;
    border-radius: 34px;
    padding-top: 34px;
    padding-bottom: 34px;
    background-color: transparent;
  }

  input {
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;
    color: black; /* Defina a cor do texto como preto */
  }




  #inptBtn {
    border-radius: 23px;
    height: 59px;
    margin-bottom: 5%;
    width: 89%;
    background: transparent;
    color: white; 
  }


  #addBtn {
    width: 50%;
    border: 1px solid white !important;
  }


  button {
    padding: 10px;
    background-color: transparent;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 12px;
    cursor: pointer;
  }

  button:hover {
    background-color: #aaaaaa23;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ffffff4a;
    border-radius: 23px;
    background-color: #fff;
    color: rgb(255, 255, 255); /* Definir a cor do texto */
    background-color: transparent;
  }
</style>
