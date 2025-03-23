import { createClient } from '@supabase/supabase-js'
import './App.css'
import { useState, useEffect, useRef, useReducer, useCallback, useMemo } from 'react'

export default function App() {
  const supabaseUrl = "https://ghtbstlkusguopgmhhax.supabase.co"
  const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdodGJzdGxrdXNndW9wZ21oaGF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NTMzMTgsImV4cCI6MjA1ODMyOTMxOH0.HzLPX6eZr3fVnSDMQgprTKztIDNsX-Up2QdWgVxS6xM"

  const supabase = createClient(supabaseUrl, supabaseKey)

  const [name, setName] = useState("")
  const [users, setUsers] = useState([])
  const inputRef = useRef(null) // Инициализация useRef

  const fetchUsers = useCallback(async () => {
    const { data, error } = await supabase.from("users").select("*")
    if (error) {
      console.error(error)
    } else {
      setUsers(data)
    }
  }, [])

  useEffect(() => {
    fetchUsers().catch((error) => console.error('Ошибка обновления списка пользователей:', error))
  }, [fetchUsers])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, []) // Используем useEffect для фокусировки на input после монтирования компонента

  const reducer = (state, action) => {
    switch (action.type) {
      case "increment":
        return { count: state.count + 1 }
      case "decrement":
        return { count: state.count - 1 }
      default:
        return state
    }
  }
  const [state, dispatch] = useReducer(reducer, { count: 0 })

  const addUser = useCallback(async () => {
    if (!name) return
    try {
      const { data, error } = await supabase.from("users").insert([{ name }]).select()
      if (error) {
        console.error(error)
      } else {
        if (data && data.length > 0) {
          setUsers((prevUsers) => [...prevUsers, data[0]])
        }
        setName("")
        inputRef.current.focus()
      }
    } catch (err) {
      console.error("Ошибка добавления пользователя: ", err)
    }
  }, [name])

  const userCount = useMemo(() => users.length, [users])

  return (
    <>
      <h1>React Hooks</h1>
      <div className='input-container'>
        <input
          ref={inputRef}
          type="text"
          placeholder='Введите имя:'
          value={name}
          onChange={(e) => setName(e.target.value)} // Исправлено на e.target.value
        />
        <button onClick={addUser}>
          Добавить пользователя
        </button>
      </div>
      <h2>Users ({userCount})</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <div>
        <h2>
          Пример useReducer
        </h2>
        <p>Количество: {state.count}</p>
        <button onClick={() => dispatch({ type: "increment" })}>+</button>
        <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      </div>
    </>
  )
}