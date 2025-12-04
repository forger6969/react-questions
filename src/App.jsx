import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Questions from './Pages/Questions'
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
  const [isDark, setTheme] = useState(false)


  const getCurrentUser = () => {
    const currentUser = JSON.parse(localStorage.getItem(`currentUser`))
    if (currentUser) {
      setUser(currentUser)
    }
  }

  useEffect(() => {
    getCurrentUser()
  }, [])

  useEffect(() => {
    document.body.style.background = isDark ? `#0D0F1A` : `#dcdbdb`
  }, [isDark])



  return (
    <AppContext.Provider value={{
      user: {
        currentUser: user,
        setUser: setUser
      },
      theme: {
        isDark: isDark,
        setTheme: setTheme
      }
    }}>

      <div>
        <Account />
        <Routes>
          <Route path='/' element={<Home />
          } />

          <>
            <Route path='/Questions/:id' element={<Questions setWarning={setWarning} warning={isWarning} />} />
            <Route path='/HistoryTest' element={<TestsHistory />} />
          </>


        </Routes>

        {isWarning &&
          <Warning setModal={setWarning} text={`Не сворачивайте окно во время теста`} />
        }


      </div>

    </AppContext.Provider>
  )
}

export default App