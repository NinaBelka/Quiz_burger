// Глобальный обработчик событий
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // Вывод элементов DOM
  const btnOpenModal = document.querySelector('#btnOpenModal'),
    modalBlock = document.querySelector('#modalBlock'),
    closeModal = document.querySelector('#closeModal'),
    questionTitle = document.querySelector('#question'),
    formAnswers = document.querySelector('#formAnswers'),
    burgerBtn = document.getElementById('burger'),
    prevButton = document.querySelector('#prev'),
    nextButton = document.querySelector('#next'),
    modalDialog = document.querySelector('.modal-dialog'),
    sendButton = document.querySelector('#send'),
    modalTitle = document.querySelector('.modal-title');
  
  const firebaseConfig = {
    apiKey: "AIzaSyC48UPXaHjwOKxlWC1nE8eJxH_0BtuyWi4",
    authDomain: "burger-c251a.firebaseapp.com",
    databaseURL: "https://burger-c251a.firebaseio.com",
    projectId: "burger-c251a",
    storageBucket: "burger-c251a.appspot.com",
    messagingSenderId: "71664721604",
    appId: "1:71664721604:web:b92e9ba5024bea47c0b391",
    measurementId: "G-ENY9RHRRJM"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Функция получения данных
  const getData = () => {
    formAnswers.textContent = 'LOAD';

    nextButton.classList.add('d-none');
    prevButton.classList.add('d-none');

    setTimeout(() => {
      firebase.database().ref().child('questions').once('value')
        .then(snap => playTest(snap.val()))
    }, 500);
  }


  // Появление-исчезание кнопки-бургера (начальная проверка)
  let clientWidth = document.documentElement.clientWidth;

  if (clientWidth < 768) {
    burgerBtn.style.display = 'flex';
  } else {
    burgerBtn.style.display = 'none';
  }

  // Запуск тестирования
  const playTest = (questions) => {

    const finalAnswers = [];
    const obj = {};

    // Переменная с номером вопроса
    let numberQuestion = 0;
    modalTitle.textContent = 'Ответь на вопрос:'

    // Функция рендеринга ответов
    const renderAnswers = (index) => {
      questions[index].answers.forEach((answer) => {

        const answerItem = document.createElement('div');

        answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');
        answerItem.innerHTML = `
          <input type="${questions[index].type}" id="${answer.title}"      name="answer" class="d-none" value="${answer.title}" >
          <label for="${answer.title}" class="d-flex flex-column justify-content-between">
          <img class="answerImg" src="${answer.url}" alt="burger">
          <span>${answer.title}</span>
          </label>
        `;
        formAnswers.appendChild(answerItem);
      });
    }

    // Функция рендеринга вопросов + ответов
    const renderQuestions = (indexQuestion) => {
      formAnswers.innerHTML = '';

      if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
        questionTitle.textContent = `${questions[indexQuestion].question}`;
        renderAnswers(indexQuestion);
        nextButton.classList.remove('d-none');
        prevButton.classList.remove('d-none');
        sendButton.classList.add('d-none');
      }

      if (numberQuestion === 0) {
        prevButton.classList.add('d-none');
      }

      if (numberQuestion === questions.length) {
        questionTitle.textContent = '';
        modalTitle.textContent = '';
        nextButton.classList.add('d-none');
        prevButton.classList.add('d-none');
        sendButton.classList.remove('d-none');
        formAnswers.innerHTML = `
          <div class="form-group">
            <label for="numberPhone">Enter your number</label>
            <input type="phone" class="form-control" id="numberPhone">
          </div>
        `;
        const numberPhone = document.getElementById('numberPhone');
        numberPhone.addEventListener('input', (event) => {
          event.target.value = event.target.value.replace(/[^0-9+-]/, '')
        });
      }

      if (numberQuestion === questions.length + 1) {
        formAnswers.textContent = 'Спасибо за пройденный тест!';
        sendButton.classList.add('d-none');

        for (let key in obj) {
          let newObj = {};
          newObj[key] = obj[key];
          finalAnswers.push(newObj);
        }

        setTimeout(() => {
          modalBlock.classList.remove('d-block');
        }, 2000);
      }
    };

    // Запуск функции рендеринга
    renderQuestions(numberQuestion);

    const checkAnswer = () => {
      const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone');

      inputs.forEach((input, index) => {
        if (numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
          obj[`${index}_${questions[numberQuestion].question}`] = input.value;
        }

        if (numberQuestion === questions.length) {
          obj['Номер телефона'] = input.value;
        }
      });
    };

    // Обработчики событий кнопок next и prev
    nextButton.onclick = () => {
      checkAnswer();
      numberQuestion++;
      renderQuestions(numberQuestion);
    };
    prevButton.onclick = () => {
      numberQuestion--;
      renderQuestions(numberQuestion);
    };
    sendButton.onclick = () => {
      checkAnswer();
      numberQuestion++;
      renderQuestions(numberQuestion);
      firebase
        .database()
        .ref()
        .child('contacts')
        .push(finalAnswers);
    }
  };

  // Появление-исчезание кнопки-бургера (проверка при изменении экрана)
  window.addEventListener('resize', () => {
    clientWidth = document.documentElement.clientWidth;

    if (clientWidth < 768) {
      burgerBtn.style.display = 'flex';
    } else {
      burgerBtn.style.display = 'none';
    }
  });

  // Открытие модального окна по клику на кнопку-бургер
  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.add('active');
    modalBlock.classList.add('d-block');
    playTest();
  });

  // Анимация открытия модального окна по кнопке внизу
  let count = -100;

  modalDialog.style.top = count + '%';

  const animateModal = () => {
    modalDialog.style.top = count + '%';
    count += 3;
    if (count < 0) {
      requestAnimationFrame(animateModal);
    } else {
      count = -100;
    }
  };

  // Открытие модального окна по кнопке внизу
  btnOpenModal.addEventListener('click', () => {
    requestAnimationFrame(animateModal);
    modalBlock.classList.add('d-block');
    getData()
  });

  // Закрытие модального окна по нажатию креста в модальном окне
  closeModal.addEventListener('click', () => {
    modalBlock.classList.remove('d-block');
    burgerBtn.classList.remove('active');
  });

  // Закрытие модального окна по нажатию мимо модального окна или на крест вместо кнопки-бургера

  document.addEventListener('click', (event) => {
    if (
      !event.target.closest('.modal-dialog') &&
      !event.target.closest('.openModalButton') &&
      !event.target.closest('.burger')
    ) {
      modalBlock.classList.remove('d-block');
      burgerBtn.classList.remove('active');
    }
  });

});