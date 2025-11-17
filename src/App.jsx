import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import ReactQuestions from './Pages/Questions'
import Home from './Pages/Home'
import axios from 'axios'
import Account from './Components/Account'

const App = () => {

  const [quests, setQuest] = useState({})

  const get = async () => {
    const react = await axios.get(`http://localhost:3001/reactQuests`)
    const js = await axios.get(`http://localhost:3001/JavaScriptQuestions`)
    const quests = {
      react: react.data,
      js: js.data
    }
    setQuest(quests)
  }

  useEffect(() => {
    get()
  })

  return (
    <>
      <Account />
      <Home />
      <Routes>

        {quests.react &&
          <>
            <Route path='/ReactQuestions' element={<ReactQuestions questions={quests.react} />} />
            <Route path='/JavaScriptQuestions' element={<ReactQuestions questions={quests.js} />} />
          </>
        }

      </Routes>

    </>
  )
}

export default App