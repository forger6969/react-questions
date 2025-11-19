import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import ReactQuestions from './Pages/Questions'
import Home from './Pages/Home'
import axios from 'axios'
import Account from './Components/Account'
import Warning from './Components/Warning'

import { AppContext } from './AppContext'
import TestsHistory from './Pages/TestsHistory'

const App = () => {

  const [quests, setQuest] = useState({})
  const navigate = useNavigate()
  const [isWarning, setWarning] = useState(false)
  const [user, setUser] = useState({ firstName: "Войти" })

  const get = async () => {
    const react = await axios.get(`https://json-questions-3.onrender.com/react-questions`)
    const js = await axios.get(`https://json-questions-3.onrender.com/js-questions`)
    const quests = {
      react: react.data,
      js: js.data
    }
    setQuest(quests)
  }

  const getCurrentUser = () => {
    const currentUser = JSON.parse(localStorage.getItem(`currentUser`))
    if (currentUser) {
      setUser(currentUser)
    }
  }

  useEffect(() => {
    get()
    getCurrentUser()
  }, [])

  return (
    <AppContext.Provider value={{
      user: {
        currentUser: user,
        setUser: setUser
      }
    }}>
      <Account />
      <Routes>
        <Route path='/' element={<Home />
        } />
        {quests.react &&
          <>
            <Route path='/ReactQuestions' element={<ReactQuestions questions={quests.react} setWarning={setWarning} warning={isWarning} type="Тест по Реакт" />} />
            <Route path='/JavaScriptQuestions' element={<ReactQuestions questions={quests.js} setWarning={setWarning} warning={isWarning} type="Тест по JavaScript" />} />
            <Route path='/HistoryTest' element={<TestsHistory />} />
          </>
        }

      </Routes>

      {isWarning &&
        <Warning setModal={setWarning} text={`Не сворачивайте окно во время теста`} />
      }

    </AppContext.Provider>
  )
}

export default App