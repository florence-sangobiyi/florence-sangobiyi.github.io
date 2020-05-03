window.onload = function() {
    const answers = []
    let totalQuestions = 0
    let score = 0
  
    const disableOptionsAfterSelection = questionId => {
      const optionButtons = document.getElementsByClassName(`option-${questionId}`)
  
      for (let button of optionButtons) {
        button.disabled = true
  
        if (button.getAttribute('selected') === 'yes')
          button.style.color = 'white'
      }
    }
  
    const changeQuestion = event => {
        const questionId = parseInt(event.target.getAttribute('step'))
        const currentQuestion = document.getElementById(`question-${questionId}`)
        const nextQuestion = document.getElementById(`question-${questionId + 1}`)
  
      if (questionId) {
        currentQuestion.style.display = 'none'
        nextQuestion.style.display = 'block'
      }
    }
  
    const recordScore = event => {
      const selectedAnswer = event.target.getAttribute('value')
      const questionId = event.target.getAttribute('question')
  
      if (answers.includes(selectedAnswer)) {
        score += 1
        event.target.style.backgroundColor = 'green'
      } else {
        event.target.style.backgroundColor = 'red'
      }
      event.target.setAttribute('selected', 'yes')
  
      disableOptionsAfterSelection(parseInt(questionId))
    }
  
    const displayResult = () => {
      const lastQuestion = document.getElementById(`question-${totalQuestions}`)
  
      const result = document.createElement('div')
      const heading = document.createElement('h2')
      const accrued = document.createElement('h3')
      
      heading.innerText = 'Your Score is as follows'
      accrued.innerText = `${score} / ${totalQuestions}`
  
      result.appendChild(heading)
      result.appendChild(accrued)
  
      lastQuestion.style.display = 'none'
      document.getElementById('questions-box').appendChild(result)
    }
  
    fetch('./questions.json')
      .then(res => res.json())
      .then(data => {
        const fragment = document.createDocumentFragment()
        totalQuestions += data.questions.length
  
        data.questions.forEach(question => {
          answers.push(question.answer)
  
          const questionContainer = document.createElement('div')
          questionContainer.setAttribute('class', 'question-container')
          if (question.id !== 1)
            questionContainer.setAttribute('class', 'hide')
  
          questionContainer.setAttribute('id', `question-${question.id}`)
  
          // Display questions
          const questionBody = document.createElement('h3')
          questionBody.setAttribute('class', 'question')
          questionBody.innerText = question.body
  
          // Set up Next and result buttons
          const nextButton = document.createElement('button')
          if (question.id !== totalQuestions) {
            nextButton.setAttribute('step', question.id)
            nextButton.setAttribute('class', 'next-button')
          } else {
            nextButton.setAttribute('id', 'result')
          }
  
          nextButton.innerText = question.id === totalQuestions ? 'Result' : 'Next'
  
          const options = document.createElement('div')
          options.setAttribute('class', 'options')
  
          question.options.forEach(option => {
            const button = document.createElement('button')
            button.setAttribute('value', option)
            button.setAttribute('class', `option option-${question.id}`)
            button.setAttribute('question', question.id)
            button.innerText = option
  
            options.appendChild(button)
          })
          // Append question to it's container
          questionContainer.appendChild(questionBody)
          questionContainer.appendChild(options)
          questionContainer.appendChild(nextButton)
  
          fragment.appendChild(questionContainer)
        })
  
        document.getElementById('questions-box').appendChild(fragment)
  
        const buttons = document.getElementsByClassName('next-button')
        const optionButtons = document.getElementsByClassName('option')
  
        for (let button of buttons)
          button.addEventListener('click', changeQuestion)
        
        for (let button of optionButtons)
          button.addEventListener('click', recordScore)
        
        document.getElementById('result').addEventListener('click', displayResult)
    })
    .catch(err => console.error(err))
  }